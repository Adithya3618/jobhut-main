import { NextResponse } from 'next/server'
import clientPromise from '../../../lib/mongodb'
import { ObjectId } from 'mongodb'

export async function GET(request, { params }) {
  try {
    const { id } = params
    const client = await clientPromise
    const db = client.db('jobhut')
    
    const blog = await db.collection('blogs').findOne({ _id: new ObjectId(id) })
    
    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 })
    }
    
    const serializedBlog = {
      ...blog,
      _id: blog._id.toString(),
      createdAt: blog.createdAt.toISOString(),
      updatedAt: blog.updatedAt ? blog.updatedAt.toISOString() : null
    }
    
    return NextResponse.json(serializedBlog)
  } catch (error) {
    console.error('Error in GET /api/blogs/[id]:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params
    const updateData = await request.json()
    const client = await clientPromise
    const db = client.db('jobhut')
    
    const result = await db.collection('blogs').updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...updateData, updatedAt: new Date() } }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: 'Blog updated successfully' })
  } catch (error) {
    console.error('Error in PUT /api/blogs/[id]:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params
    const client = await clientPromise
    const db = client.db('jobhut')
    
    const result = await db.collection('blogs').deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: 'Blog deleted successfully' })
  } catch (error) {
    console.error('Error in DELETE /api/blogs/[id]:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

