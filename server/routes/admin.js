const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { getDB } = require('../config/db');

// Simple token store (in-memory, fine for single admin use)
const activeSessions = new Set();

// Middleware to verify admin token
const requireAdmin = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token || !activeSessions.has(token)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

module.exports.requireAdmin = requireAdmin;

// Admin login
router.post('/login', async (req, res) => {
  try {
    const db = getDB();
    const { email, password } = req.body;
    
    const admin = await db.collection('admins').findOne({ email, password });
    
    if (admin) {
      const token = 'admin-' + crypto.randomBytes(32).toString('hex');
      activeSessions.add(token);
      res.json({ 
        success: true, 
        token,
        admin: { email: admin.email }
      });
    } else {
      res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create admin (run once to create admin account)
router.post('/create', async (req, res) => {
  try {
    const db = getDB();
    const { email, password } = req.body;
    
    const existing = await db.collection('admins').findOne({ email });
    if (existing) {
      return res.status(400).json({ error: 'Admin already exists' });
    }
    
    await db.collection('admins').insertOne({ email, password, createdAt: new Date() });
    res.status(201).json({ success: true, message: 'Admin created' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
