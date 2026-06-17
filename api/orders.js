const { getDB } = require('./_lib/db');
const { requireAdmin } = require('./_lib/auth');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const db = await getDB();
    const collection = db.collection('orders');

    if (req.method === 'GET') {
      if (!requireAdmin(req, res)) return;
      const orders = await collection.find({}).sort({ createdAt: -1 }).toArray();
      return res.status(200).json(orders);
    }

    if (req.method === 'POST') {
      // Public — customers place orders
      const order = { ...req.body, createdAt: new Date(), status: 'pending' };
      const result = await collection.insertOne(order);
      return res.status(201).json({ ...order, _id: result.insertedId });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
