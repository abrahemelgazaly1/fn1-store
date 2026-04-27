# خطوات حل مشكلة الـ API على Vercel

## المشكلة:
الـ API بيرجع HTML بدل JSON - معناها إن Vercel مش شغال الـ serverless functions

## الحل:

### 1. تأكد من Environment Variables
روح على Vercel Dashboard → Project Settings → Environment Variables

تأكد إن `MONGODB_URI` موجودة وصحيحة:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/offstore?retryWrites=true&w=majority
```

### 2. تأكد من هيكل المشروع
لازم يكون عندك:
```
off-store/
├── api/
│   ├── products.js
│   ├── orders.js
│   ├── admin/
│   │   └── login.js
│   ├── products/
│   │   ├── [id].js
│   │   ├── latest.js
│   │   └── category/
│   │       └── [name].js
│   └── orders/
│       └── [id].js
├── src/
├── public/
├── package.json
└── vercel.json
```

### 3. أعد Deploy المشروع
بعد التأكد من الـ Environment Variables:

```bash
# من الـ terminal
vercel --prod

# أو من Vercel Dashboard
اضغط "Redeploy" من تبويب Deployments
```

### 4. اختبر الـ API
بعد الـ deploy، جرب الرابط ده في المتصفح:
```
https://your-project.vercel.app/api/products
```

لازم يرجعلك JSON مش HTML

### 5. لو لسه فيه مشكلة
- روح على Vercel Dashboard → Deployments → اختار آخر deployment
- اضغط على "View Function Logs"
- شوف الـ errors اللي ظاهرة

## ملاحظات مهمة:
- Vercel بيكتشف الـ `/api` folder تلقائياً كـ serverless functions
- كل ملف `.js` في `/api` بيبقى endpoint
- الـ `vercel.json` مبسط عشان ما يعملش conflicts
- لو الـ MONGODB_URI غلط، الـ API مش هيشتغل
