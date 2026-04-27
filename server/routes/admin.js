const express = require('express');
const router = express.Router();
const { getDB } = require('../config/db');

// Admin login
router.post('/login', async (req, res) => {
  try {
    const db = getDB();
    const { email, password } = req.body;
    
    const admin = await db.collection('admins').findOne({ email, password });
    
    if (admin) {
      res.json({ 
        success: true, 
        token: 'admin-token-' + Date.now(),
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
