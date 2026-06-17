const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const { getDB } = require('../config/db');
const { requireAdmin } = require('./admin');

// Get all products - public
router.get('/', async (req, res) => {
  try {
    const db = getDB();
    const products = await db.collection('products').find({}).sort({ createdAt: -1 }).toArray();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get latest product
router.get('/latest', async (req, res) => {
  try {
    const db = getDB();
    const product = await db.collection('products').findOne({}, { sort: { createdAt: -1 } });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get products by category
router.get('/category/:name', async (req, res) => {
  try {
    const db = getDB();
    const products = await db.collection('products').find({
      category: { $regex: new RegExp(req.params.name, 'i') }
    }).sort({ createdAt: -1 }).toArray();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const db = getDB();
    const product = await db.collection('products').findOne({ _id: new ObjectId(req.params.id) });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create product - admin only
router.post('/', requireAdmin, async (req, res) => {
  try {
    const db = getDB();
    const product = { ...req.body, createdAt: new Date(), soldOut: false };
    const result = await db.collection('products').insertOne(product);
    res.status(201).json({ ...product, _id: result.insertedId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update product - admin only
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const db = getDB();
    const { _id, ...updateData } = req.body;
    await db.collection('products').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: updateData }
    );
    const updated = await db.collection('products').findOne({ _id: new ObjectId(req.params.id) });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete product - admin only
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const db = getDB();
    await db.collection('products').deleteOne({ _id: new ObjectId(req.params.id) });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
