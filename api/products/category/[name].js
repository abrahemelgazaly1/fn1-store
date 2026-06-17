const { getDB } = require('../../_lib/db');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { name } = req.query;
  if (!name) return res.status(400).json({ error: 'Category name is required' });

  try {
    const db = await getDB();
    const products = await db.collection('products').find({
      category: { $regex: new RegExp(name, 'i') }
    }).sort({ createdAt: -1 }).toArray();
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
