import { NextResponse } from 'next/server'
import clientPromise from '../../../lib/mongodb'
import { sign } from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key' // In production, use a proper secret

export async function POST(request) {
  const { username, password } = await request.json()

  const client = await clientPromise
  const db = client.db('jobhut')

  const admin = await db.collection('admins').findOne({ username, password })

  if (admin) {
    const token = sign({ username, role: 'admin' }, JWT_SECRET, { expiresIn: '1d' })
    return NextResponse.json({ success: true, token })
  } else {
    return NextResponse.json({ success: false }, { status: 401 })
  }
}

