import { NextResponse } from 'next/server'
import clientPromise from '../../lib/mongodb'
import { verifyToken } from '../../lib/auth'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page')) || 1
    const limit = parseInt(searchParams.get('limit')) || 20
    const search = searchParams.get('search') || ''
    const skip = (page - 1) * limit

    const client = await clientPromise
    const db = client.db('jobhut')
    
    const query = search
      ? { name: { $regex: search, $options: 'i' } }
      : {}

    const totalCoupons = await db.collection('coupons').countDocuments(query)
    const coupons = await db.collection('coupons')
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray()
    
    const serializedCoupons = coupons.map(coupon => ({
      ...coupon,
      _id: coupon._id.toString()
    }))
    
    return NextResponse.json({
      coupons: serializedCoupons,
      total: totalCoupons,
      page,
      totalPages: Math.ceil(totalCoupons / limit)
    })
  } catch (error) {
    console.error('Error in GET /api/coupons:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1]
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decodedToken = verifyToken(token)
    if (!decodedToken) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const coupon = await request.json()
    const client = await clientPromise
    const db = client.db('jobhut')
    
    // Add createdAt field to the coupon
    const couponWithTimestamp = {
      ...coupon,
      createdAt: new Date()
    }
    
    const result = await db.collection('coupons').insertOne(couponWithTimestamp)
    return NextResponse.json({ success: true, _id: result.insertedId.toString() })
  } catch (error) {
    console.error('Error in POST /api/coupons:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

