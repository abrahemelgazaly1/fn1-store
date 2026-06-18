const crypto = require('crypto');
const { getDB } = require('./db');

const generateToken = async () => {
  const token = 'admin-' + crypto.randomBytes(32).toString('hex');
  const db = await getDB();
  await db.collection('sessions').insertOne({
    token,
    createdAt: new Date(),
    // expire after 7 days
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });
  return token;
};

const verifyToken = async (req) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return false;
  const db = await getDB();
  const session = await db.collection('sessions').findOne({
    token,
    expiresAt: { $gt: new Date() },
  });
  return !!session;
};

const requireAdmin = async (req, res) => {
  const valid = await verifyToken(req);
  if (!valid) {
    res.status(401).json({ error: 'Unauthorized' });
    return false;
  }
  return true;
};

module.exports = { generateToken, requireAdmin };
