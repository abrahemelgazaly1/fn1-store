const { getDB } = require('./_lib/db');
const { requireAdmin } = require('./_lib/auth');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const db = await getDB();
    const collection = db.collection('products');

    if (req.method === 'GET') {
      const products = await collection.find({}).sort({ createdAt: -1 }).toArray();
      return res.status(200).json(products);
    }

    if (req.method === 'POST') {
      if (!(await requireAdmin(req, res))) return;
      const product = { ...req.body, createdAt: new Date(), soldOut: false };
      const result = await collection.insertOne(product);
      return res.status(201).json({ ...product, _id: result.insertedId });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
