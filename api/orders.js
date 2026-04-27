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
    const collection = db.collection('orders');

    if (req.method === 'GET') {
      const orders = await collection.find({}).sort({ createdAt: -1 }).toArray();
      return res.status(200).json(orders);
    }

    if (req.method === 'POST') {
      const order = { ...req.body, createdAt: new Date() };
      const result = await collection.insertOne(order);
      return res.status(201).json({ ...order, _id: result.insertedId });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
