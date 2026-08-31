require('dotenv').config();
const { MongoClient } = require('mongodb');

const testConnection = async () => {
  console.log('🔄 جاري الاتصال بقاعدة البيانات...');
  console.log('📌 URI:', process.env.MONGODB_URI?.replace(/:[^:@]+@/, ':****@'));
  
  try {
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    console.log('✅ تم الاتصال بقاعدة البيانات بنجاح!');
    
    // اختبار الوصول للقاعدة
    const db = client.db('offstore');
    const collections = await db.listCollections().toArray();
    
    console.log('\n📦 المجموعات الموجودة في قاعدة البيانات:');
    if (collections.length === 0) {
      console.log('   لا توجد مجموعات بعد (قاعدة بيانات فارغة)');
    } else {
      collections.forEach(col => {
        console.log(`   - ${col.name}`);
      });
    }
    
    // عرض بعض الإحصائيات
    console.log('\n📊 إحصائيات:');
    for (const col of collections) {
      const count = await db.collection(col.name).countDocuments();
      console.log(`   ${col.name}: ${count} مستند`);
    }
    
    await client.close();
    console.log('\n✅ تم إغلاق الاتصال بنجاح');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ فشل الاتصال بقاعدة البيانات:');
    console.error('   الخطأ:', error.message);
    if (error.code) {
      console.error('   الكود:', error.code);
    }
    process.exit(1);
  }
};

testConnection();
