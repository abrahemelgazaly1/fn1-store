const { ObjectId } = require('mongodb');
const { getDB } = require('../_lib/db');
const { requireAdmin } = require('../_lib/auth');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { id } = req.query;
  if (!id || !ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid product ID' });

  try {
    const db = await getDB();
    const collection = db.collection('products');

    if (req.method === 'GET') {
      const product = await collection.findOne({ _id: new ObjectId(id) });
      if (!product) return res.status(404).json({ error: 'Product not found' });
      return res.status(200).json(product);
    }

    if (req.method === 'PUT') {
      if (!requireAdmin(req, res)) return;
      const { _id, ...updateData } = req.body;
      await collection.updateOne({ _id: new ObjectId(id) }, { $set: updateData });
      const updated = await collection.findOne({ _id: new ObjectId(id) });
      return res.status(200).json(updated);
    }

    if (req.method === 'DELETE') {
      if (!requireAdmin(req, res)) return;
      await collection.deleteOne({ _id: new ObjectId(id) });
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
