import { NextResponse } from 'next/server'
import clientPromise from '../../../lib/mongodb'
import { ObjectId } from 'mongodb'
import { verifyToken } from '../../../lib/auth'

export async function GET(request, context) {
  try {
    const { params } = context;
    const { id } = await params;

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid job ID' },
        { status: 400 }
      )
    }

    const client = await clientPromise
    const db = client.db('jobhut')
    
    const job = await db.collection('jobs').findOne({
      _id: new ObjectId(id)
    })

    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      )
    }

    const serializedJob = {
      ...job,
      _id: job._id.toString(),
      datePosted: job.datePosted ? new Date(job.datePosted).toISOString() : null,
      lastDate: job.lastDate ? new Date(job.lastDate).toISOString() : null,
      expirationDate: job.expirationDate ? new Date(job.expirationDate).toISOString() : null
    }

    return NextResponse.json(serializedJob)
  } catch (error) {
    console.error('Error in GET /api/jobs/[id]:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function PUT(request, context) {
  try {
    const { params } = context;
    const { id } = await params;
    
    const token = request.headers.get('authorization')?.split(' ')[1]
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decodedToken = verifyToken(token)
    if (!decodedToken) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid job ID' },
        { status: 400 }
      )
    }

    const client = await clientPromise
    const db = client.db('jobhut')
    
    const updatedJob = await request.json()
    const { _id, ...jobWithoutId } = updatedJob

    const result = await db.collection('jobs').updateOne(
      { _id: new ObjectId(id) },
      { $set: jobWithoutId }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      )
    }

    // Fetch the updated job to return it
    const updatedJobFromDB = await db.collection('jobs').findOne({
      _id: new ObjectId(id)
    })

    const serializedUpdatedJob = {
      ...updatedJobFromDB,
      _id: updatedJobFromDB._id.toString(),
      datePosted: updatedJobFromDB.datePosted ? new Date(updatedJobFromDB.datePosted).toISOString() : null,
      lastDate: updatedJobFromDB.lastDate ? new Date(updatedJobFromDB.lastDate).toISOString() : null,
      expirationDate: updatedJobFromDB.expirationDate ? new Date(updatedJobFromDB.expirationDate).toISOString() : null
    }

    return NextResponse.json({ success: true, job: serializedUpdatedJob })
  } catch (error) {
    console.error('Error in PUT /api/jobs/[id]:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request, context) {
  try {
    const { params } = context;
    const { id } = await params;
    
    const token = request.headers.get('authorization')?.split(' ')[1]
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decodedToken = verifyToken(token)
    if (!decodedToken) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid job ID' },
        { status: 400 }
      )
    }

    const client = await clientPromise
    const db = client.db('jobhut')
    
    const result = await db.collection('jobs').deleteOne({
      _id: new ObjectId(id)
    })

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in DELETE /api/jobs/[id]:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

