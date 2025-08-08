import { NextResponse } from 'next/server'
import clientPromise from '../../../lib/mongodb'
import { ObjectId } from 'mongodb'
import { verifyToken } from '../../../lib/auth'

export async function GET(request, { params }) {
  try {
    const id = params?.id ? await Promise.resolve(params.id) : null;
    
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid coupon ID' }, { status: 400 });
    }

    const client = await clientPromise
    const db = client.db('jobhut')
    const coupon = await db.collection('coupons').findOne({ 
      _id: new ObjectId(id) 
    })
    
    if (!coupon) {
      return NextResponse.json({ error: 'Coupon not found' }, { status: 404 })
    }
    
    const serializedCoupon = {
      ...coupon,
      _id: coupon._id.toString()
    }
    
    return NextResponse.json(serializedCoupon)
  } catch (error) {
    console.error('Error in GET /api/coupons/[id]:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1]
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decodedToken = verifyToken(token)
    if (!decodedToken) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const id = params?.id ? await Promise.resolve(params.id) : null;
    
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid coupon ID' }, { status: 400 });
    }

    const client = await clientPromise
    const db = client.db('jobhut')
    
    const updatedCoupon = await request.json()
    const { _id, ...couponWithoutId } = updatedCoupon

    const result = await db.collection('coupons').updateOne(
      { _id: new ObjectId(id) },
      { $set: couponWithoutId }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Coupon not found' }, { status: 404 })
    }

    // Fetch the updated coupon to return it
    const updatedCouponFromDB = await db.collection('coupons').findOne({
      _id: new ObjectId(id)
    })

    const serializedUpdatedCoupon = {
      ...updatedCouponFromDB,
      _id: updatedCouponFromDB._id.toString()
    }

    return NextResponse.json({ success: true, coupon: serializedUpdatedCoupon })
  } catch (error) {
    console.error('Error in PUT /api/coupons/[id]:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1]
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decodedToken = verifyToken(token)
    if (!decodedToken) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const id = params?.id ? await Promise.resolve(params.id) : null;
    
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid coupon ID' }, { status: 400 });
    }

    const client = await clientPromise
    const db = client.db('jobhut')
    
    const result = await db.collection('coupons').deleteOne({
      _id: new ObjectId(id)
    })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Coupon not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in DELETE /api/coupons/[id]:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

