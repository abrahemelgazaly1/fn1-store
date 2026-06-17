const { MongoClient } = require('mongodb');

let cachedClient = null;

const connectToDatabase = async () => {
  if (cachedClient) return cachedClient;
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI environment variable is not set');
  const client = new MongoClient(uri);
  await client.connect();
  cachedClient = client;
  return client;
};

const getDB = async () => {
  const client = await connectToDatabase();
  return client.db('offstore');
};

module.exports = { getDB };
