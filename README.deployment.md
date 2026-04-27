# دليل رفع المشروع على Vercel

## الخطوات المطلوبة:

### 1. تجهيز المشروع
```bash
cd off-store
npm install
npm run build
```

### 2. رفع على Vercel

#### الطريقة الأولى: من خلال Vercel CLI
```bash
npm i -g vercel
vercel login
vercel
```

#### الطريقة الثانية: من خلال موقع Vercel
1. اذهب إلى https://vercel.com
2. اضغط على "New Project"
3. اربط حساب GitHub الخاص بك
4. اختر المشروع
5. اضغط Deploy

### 3. إعدادات Environment Variables على Vercel

بعد رفع المشروع، اذهب إلى:
- Project Settings → Environment Variables
- أضف المتغير التالي:

```
MONGODB_URI = your_mongodb_connection_string
```

### 4. إعادة Deploy
بعد إضافة Environment Variables، اضغط على "Redeploy" من تبويب Deployments

## ملاحظات مهمة:

- جميع API endpoints موجودة في مجلد `/api`
- الـ serverless functions جاهزة للعمل على Vercel
- مجلد `/server` لن يتم رفعه (موجود في .vercelignore)
- تأكد من إضافة MONGODB_URI في Environment Variables

## API Endpoints المتاحة:

- `GET /api/products` - جلب كل المنتجات
- `POST /api/products` - إضافة منتج جديد
- `GET /api/products/:id` - جلب منتج معين
- `PUT /api/products/:id` - تحديث منتج
- `DELETE /api/products/:id` - حذف منتج
- `GET /api/products/latest` - جلب آخر منتج
- `GET /api/products/category/:name` - جلب منتجات حسب الفئة
- `GET /api/orders` - جلب كل الطلبات
- `POST /api/orders` - إضافة طلب جديد
- `PUT /api/orders/:id` - تحديث طلب
- `DELETE /api/orders/:id` - حذف طلب
- `POST /api/admin/login` - تسجيل دخول الأدمن
