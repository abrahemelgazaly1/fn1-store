const { getDB } = require('./_lib/db');
const { requireAdmin } = require('./_lib/auth');
const { ObjectId } = require('mongodb');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const db = await getDB();
    const collection = db.collection('orders');

    if (req.method === 'GET') {
      if (!(await requireAdmin(req, res))) return;
      const orders = await collection.find({}).sort({ createdAt: -1 }).toArray();
      return res.status(200).json(orders);
    }

    if (req.method === 'POST') {
      const order = { ...req.body, createdAt: new Date(), status: 'pending' };
      
      // Update stock for each item in the order
      if (order.items && Array.isArray(order.items)) {
        const productsCollection = db.collection('products');
        
        for (const item of order.items) {
          if (!item.productId) continue;
          
          try {
            const product = await productsCollection.findOne({ _id: new ObjectId(item.productId) });
            
            if (product) {
              const currentStock = product.stock || 0;
              const newStock = Math.max(0, currentStock - (item.quantity || 1));
              
              // Update stock and set soldOut if stock reaches 0
              await productsCollection.updateOne(
                { _id: new ObjectId(item.productId) },
                { 
                  $set: { 
                    stock: newStock,
                    soldOut: newStock === 0
                  } 
                }
              );
            }
          } catch (itemError) {
            console.error('Error updating stock for item:', itemError);
          }
        }
      }
      
      const result = await collection.insertOne(order);
      return res.status(201).json({ ...order, _id: result.insertedId });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
