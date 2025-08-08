// insertAdmin.js
require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('MONGODB_URI not found in .env file');
  process.exit(1);
}

const username = 'admin';      // Change this if you want a different username
const password = '#123#12'; // Change this to your desired password

async function run() {
  const client = new MongoClient(uri, {});
  try {
    await client.connect();
    const db = client.db('jobhut');
    const admins = db.collection('admins');

    // Check if admin already exists
    const existing = await admins.findOne({ username });
    if (existing) {
      console.log('Admin user already exists:', existing);
    } else {
      const result = await admins.insertOne({ username, password });
      console.log('Admin user inserted:', result.insertedId);
    }
  } catch (err) {
    console.error('Error inserting admin user:', err);
  } finally {
    await client.close();
  }
}

run();