import clientPromise from '../../app/lib/mongodb'

export default async function handler(req, res) {
  try {
    const client = await clientPromise
    const isConnected = client.isConnected()
    res.status(200).json({ 
      mongoDBConnection: isConnected ? 'Connected' : 'Not connected',
      NODE_ENV: process.env.NODE_ENV
    })
  } catch (error) {
    res.status(500).json({ error: 'Failed to connect to MongoDB', message: error.message })
  }
}

