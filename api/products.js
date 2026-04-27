const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error('MONGODB_URI is not defined');
}

let cachedClient = null;

async function connectToDatabase() {
  if (cachedClient) {
    return cachedClient;
  }
  
  if (!uri) {
    throw new Error('MONGODB_URI environment variable is not set');
  }
  
  const client = new MongoClient(uri);
  await client.connect();
  cachedClient = client;
  return client;
}

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const client = await connectToDatabase();
    const db = client.db('offstore');
    const collection = db.collection('products');

    if (req.method === 'GET') {
      const products = await collection.find({}).sort({ createdAt: -1 }).toArray();
      return res.status(200).json(products);
    }

    if (req.method === 'POST') {
      const product = { ...req.body, createdAt: new Date(), soldOut: false };
      const result = await collection.insertOne(product);
      return res.status(201).json({ ...product, _id: result.insertedId });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      error: error.message,
      details: 'Check server logs for more information'
    });
  }
};
