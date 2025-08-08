import { NextResponse } from 'next/server';
import clientPromise from '../../lib/mongodb';

// Placeholder for admin check (implement real auth in production)
function isAdmin() { return true; }

export async function GET() {
  if (!isAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const client = await clientPromise;
    const db = client.db('jobhut');
    const apis = await db.collection('external_apis').find({}).toArray();
    return NextResponse.json({ success: true, apis });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  if (!isAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const api = await req.json();
    if (!api.id || !api.name || !api.host || !api.endpoint || !api.key) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const client = await clientPromise;
    const db = client.db('jobhut');
    const exists = await db.collection('external_apis').findOne({ id: api.id });
    if (exists) {
      return NextResponse.json({ error: 'API config with this id already exists' }, { status: 400 });
    }
    await db.collection('external_apis').insertOne(api);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  if (!isAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const api = await req.json();
    if (!api.id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }
    const client = await clientPromise;
    const db = client.db('jobhut');
    // Remove _id from update payload
    const { _id, ...apiWithoutId } = api;
    await db.collection('external_apis').updateOne({ id: api.id }, { $set: apiWithoutId });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  if (!isAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    const client = await clientPromise;
    const db = client.db('jobhut');
    await db.collection('external_apis').deleteOne({ id });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 