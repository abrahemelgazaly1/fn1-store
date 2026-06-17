const crypto = require('crypto');

// In-memory token store — persists within the same serverless instance
// For Vercel, this is acceptable for a single-admin setup
const activeSessions = new Set();

const generateToken = () => {
  const token = 'admin-' + crypto.randomBytes(32).toString('hex');
  activeSessions.add(token);
  return token;
};

const verifyToken = (req) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  return token && activeSessions.has(token);
};

const requireAdmin = (req, res) => {
  if (!verifyToken(req)) {
    res.status(401).json({ error: 'Unauthorized' });
    return false;
  }
  return true;
};

module.exports = { generateToken, requireAdmin };
