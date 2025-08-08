// testConnection.js - Simple MongoDB connection test
require('dotenv').config();

const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('❌ MONGODB_URI not found in .env file');
  process.exit(1);
}

const isAtlas = uri.startsWith('mongodb+srv');

const options = {
  maxPoolSize: 5,
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  ...(isAtlas && {
    ssl: true,
    tls: true,
    tlsAllowInvalidCertificates: true,
    tlsAllowInvalidHostnames: true,
    retryWrites: true,
    w: 'majority'
  })
};

async function testConnection() {
  const client = new MongoClient(uri, options);
  try {
    console.log('🔌 Testing MongoDB connection...');
    console.log('URI:', uri.substring(0, 20) + '...');
    console.log('Is Atlas:', isAtlas);
    
    await client.connect();
    console.log('✅ Connected to MongoDB successfully!');
    
    const db = client.db('jobhut');
    const collections = await db.listCollections().toArray();
    console.log('📊 Collections found:', collections.map(c => c.name));
    
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
    if (err.code) {
      console.error('Error code:', err.code);
    }
  } finally {
    await client.close();
    console.log('🔌 Disconnected from MongoDB');
  }
}

testConnection();
