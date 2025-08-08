import { NextResponse } from 'next/server'
import clientPromise from '../../lib/mongodb'
import { ObjectId } from 'mongodb'
import { verifyToken } from '../../lib/auth'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'all'
    const search = searchParams.get('search') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    console.log('[Blogs API] Request params:', { status, search, page, limit })

    const client = await clientPromise
    const db = client.db('jobhut')
    
    const query = {}
    if (status !== 'all') {
      query.status = status
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ]
    }

    console.log('[Blogs API] Query:', query)

    const totalBlogs = await db.collection('blogs').countDocuments(query)
    console.log('[Blogs API] Total blogs found:', totalBlogs)
    
    const blogs = await db.collection('blogs')
      .find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray()
    
    console.log('[Blogs API] Blogs returned:', blogs.length)
    
    const serializedBlogs = blogs.map(blog => ({
      ...blog,
      _id: blog._id.toString(),
      createdAt: blog.createdAt.toISOString(),
      updatedAt: blog.updatedAt ? blog.updatedAt.toISOString() : null
    }))
    
    return NextResponse.json({ 
      blogs: serializedBlogs, 
      total: totalBlogs,
      page,
      limit,
      hasMore: (page * limit) < totalBlogs
    })
  } catch (error) {
    console.error('Error in GET /api/blogs:', error)
    return NextResponse.json({ 
      error: 'Internal Server Error',
      message: error.message 
    }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const blog = await request.json()
    const client = await clientPromise
    const db = client.db('jobhut')
    
    const newBlog = {
      ...blog,
      createdAt: new Date(),
      status: 'pending',
      tags: blog.tags ? blog.tags.split(',').map(tag => tag.trim()) : [],
      relatedLinks: blog.relatedLinks ? blog.relatedLinks.split('\n').map(link => link.trim()).filter(Boolean) : []
    }
    
    const result = await db.collection('blogs').insertOne(newBlog)
    return NextResponse.json({ success: true, _id: result.insertedId.toString() })
  } catch (error) {
    console.error('Error in POST /api/blogs:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PUT(request) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1]
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decodedToken = verifyToken(token)
    if (!decodedToken) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const { id, ...updateData } = await request.json()
    const client = await clientPromise
    const db = client.db('jobhut')
    
    if (updateData.status === 'rejected') {
      const result = await db.collection('blogs').deleteOne({ _id: new ObjectId(id) })
      if (result.deletedCount === 0) {
        return NextResponse.json({ error: 'Blog not found' }, { status: 404 })
      }
      return NextResponse.json({ success: true, message: 'Blog rejected and deleted' })
    }
    
    const result = await db.collection('blogs').updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...updateData, updatedAt: new Date() } }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in PUT /api/blogs:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json()
    const client = await clientPromise
    const db = client.db('jobhut')
    
    const result = await db.collection('blogs').deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: 'Blog deleted successfully' })
  } catch (error) {
    console.error('Error in DELETE /api/blogs:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

