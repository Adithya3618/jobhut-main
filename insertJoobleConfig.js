// insertJoobleConfig.js

require('dotenv').config();

const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('❌ MONGODB_URI not found in .env file');
  process.exit(1);
}

const isAtlas = uri.startsWith('mongodb+srv');

// Updated connection options for better SSL/TLS handling
const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  ...(isAtlas && {
    ssl: true,
    tls: true,
    tlsAllowInvalidCertificates: process.env.NODE_ENV === 'development',
    tlsAllowInvalidHostnames: process.env.NODE_ENV === 'development',
    retryWrites: true,
    w: 'majority'
  })
};

async function run() {
  const client = new MongoClient(uri, options);
  try {
    console.log('🔌 Connecting to MongoDB...');
    await client.connect();
    console.log('✅ Connected to MongoDB successfully');
    
    const db = client.db('jobhut');
    const externalApis = db.collection('external_apis');

    const joobleApiKey = '043163f3-ba5a-4065-b850-229ebfe1f9bb';

    // Remove existing config with same ID
    console.log('🗑️  Removing existing Jooble config...');
    await externalApis.deleteMany({ id: 'jooble' });

    console.log('📝 Inserting new Jooble config...');
    const result = await externalApis.insertOne({
      id: "jooble",
      name: "Jooble",
      enabled: true,
      endpoint: `https://jooble.org/api/${joobleApiKey}`,
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      queryTemplate: {
        keywords: "{{keyword}}",
        location: "{{location}}"
      },
      jobsPath: "jobs",
      fieldMap: {
        title: "title",
        location: "location",
        company: "company",
        description: "snippet",
        type: "type",
        link: "link",
        updatedAt: "updated"
      }
    });

    console.log('✅ Jooble API config inserted:', result.insertedId);
  } catch (err) {
    console.error('❌ Error inserting Jooble API config:', err);
    console.error('Error details:', err.message);
    if (err.code) {
      console.error('Error code:', err.code);
    }
  } finally {
    await client.close();
    console.log('🔌 Disconnected from MongoDB');
  }
}

run();
