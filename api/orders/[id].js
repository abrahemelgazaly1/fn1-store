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
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { id } = req.query;

  try {
    const client = await connectToDatabase();
    const db = client.db('offstore');
    const collection = db.collection('orders');

    if (req.method === 'PUT') {
      const { _id, ...updateData } = req.body;
      await collection.updateOne({ _id: new ObjectId(id) }, { $set: updateData });
      const updated = await collection.findOne({ _id: new ObjectId(id) });
      return res.status(200).json(updated);
    }

    if (req.method === 'DELETE') {
      await collection.deleteOne({ _id: new ObjectId(id) });
      return res.status(200).json({ success: true });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
