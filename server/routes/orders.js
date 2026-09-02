const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const { getDB } = require('../config/db');
const { requireAdmin } = require('./admin');

// Get all orders - admin only
router.get('/', requireAdmin, async (req, res) => {
  try {
    const db = getDB();
    const orders = await db.collection('orders').find({}).sort({ createdAt: -1 }).toArray();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single order
router.get('/:id', requireAdmin, async (req, res) => {
  try {
    const db = getDB();
    const order = await db.collection('orders').findOne({ _id: new ObjectId(req.params.id) });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create order
router.post('/', async (req, res) => {
  try {
    const db = getDB();
    const order = { ...req.body, createdAt: new Date(), status: 'pending' };
    
    console.log('📦 New order received with items:', order.items?.length || 0);
    
    // Update stock for each item in the order
    if (order.items && Array.isArray(order.items)) {
      for (const item of order.items) {
        console.log(`Processing item: ${item.name}, productId: ${item.productId}, quantity: ${item.quantity}`);
        
        if (!item.productId) {
          console.error('❌ Missing productId for item:', item.name);
          continue;
        }
        
        try {
          const product = await db.collection('products').findOne({ _id: new ObjectId(item.productId) });
          
          if (!product) {
            console.error(`❌ Product not found: ${item.productId}`);
            continue;
          }
          
          console.log(`✓ Found product: ${product.name}, current stock: ${product.stock || 0}`);
          
          const currentStock = product.stock || 0;
          const newStock = Math.max(0, currentStock - (item.quantity || 1));
          
          console.log(`📉 Updating stock from ${currentStock} to ${newStock}`);
          
          // Update stock and set soldOut if stock reaches 0
          const updateResult = await db.collection('products').updateOne(
            { _id: new ObjectId(item.productId) },
            { 
              $set: { 
                stock: newStock,
                soldOut: newStock === 0
              } 
            }
          );
          
          console.log(`✓ Stock updated successfully. Modified: ${updateResult.modifiedCount}`);
        } catch (itemError) {
          console.error(`❌ Error processing item ${item.name}:`, itemError.message);
        }
      }
    }
    
    const result = await db.collection('orders').insertOne(order);
    console.log('✅ Order created successfully:', result.insertedId);
    res.status(201).json({ ...order, _id: result.insertedId });
  } catch (error) {
    console.error('❌ Error creating order:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update order
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const db = getDB();
    const { _id, ...updateData } = req.body;
    await db.collection('orders').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: updateData }
    );
    const updated = await db.collection('orders').findOne({ _id: new ObjectId(req.params.id) });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete order
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const db = getDB();
    await db.collection('orders').deleteOne({ _id: new ObjectId(req.params.id) });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
