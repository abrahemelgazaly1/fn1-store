const { MongoClient, ObjectId } = require('mongodb');

const uri = process.env.MONGODB_URI;
let cachedClient = null;

async function connectToDatabase() {
  if (cachedClient) return cachedClient;
  const client = new MongoClient(uri);
  await client.connect();
  cachedClient = client;
  return client;
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

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

    res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
