import clientPromise from './mongodb';

export async function getApiConfig(apiId) {
  const client = await clientPromise;
  const db = client.db('jobhut');
  const config = await db.collection('external_apis').findOne({ id: apiId, enabled: true });
  return config;
} 