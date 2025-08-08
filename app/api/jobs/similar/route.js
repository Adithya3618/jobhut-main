import { NextResponse } from 'next/server'
import clientPromise from '../../../lib/mongodb'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')

    if (!category) {
      return NextResponse.json({ error: 'Category is required' }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db('jobhut')
    
    const jobs = await db.collection('jobs')
      .find({ subCategory: category })
      .sort({ datePosted: -1 })
      .limit(6)
      .toArray()

    const serializedJobs = jobs.map(job => ({
      ...job,
      _id: job._id.toString(),
      datePosted: job.datePosted ? new Date(job.datePosted).toISOString() : null,
      lastDate: job.lastDate ? new Date(job.lastDate).toISOString() : null,
      expirationDate: job.expirationDate ? new Date(job.expirationDate).toISOString() : null,
    }))

    return NextResponse.json(serializedJobs)
  } catch (error) {
    console.error('Error in similar jobs API:', error)
    return NextResponse.json({ error: 'Failed to fetch similar jobs' }, { status: 500 })
  }
}

