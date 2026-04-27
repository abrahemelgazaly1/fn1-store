const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://abrahemelgazaly2:abrahem88@cluster0.trilwka.mongodb.net/?appName=Cluster0';

async function seedAdmin() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('offstore');
    
    // Create admin
    const adminData = {
      email: 'admin@fn1.com',
      password: 'fn1@123',
      createdAt: new Date()
    };
    
    // Check if admin exists
    const existing = await db.collection('admins').findOne({ email: adminData.email });
    
    if (existing) {
      console.log('Admin already exists');
    } else {
      await db.collection('admins').insertOne(adminData);
      console.log('Admin created successfully!');
      console.log('Email: admin@fn1.com');
      console.log('Password: fn1@123');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
    process.exit(0);
  }
}

seedAdmin();
