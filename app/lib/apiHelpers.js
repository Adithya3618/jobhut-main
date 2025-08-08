import clientPromise from './mongodb';

export async function getPublicApiConfigs() {
  const client = await clientPromise;
  const db = client.db('jobhut');
  const apis = await db.collection('external_apis').find({ enabled: true }).toArray();
  return apis;
} 