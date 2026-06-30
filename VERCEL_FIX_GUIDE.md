# ✅ خطوات حل مشكلة Vercel - Permission Denied

## 📋 الخطوة الأولى: فحص إذا كان المشروع على Git

```powershell
cd "c:\Users\Mohamed HatemMubarak\Desktop\markasphare UP"

# تحقق من وجود git
git status
```

إذا رأيت رسالة "fatal: not a git repository"، هذا يعني أن المشروع ليس على Git بعد.

---

## 🚀 **الحل الكامل (Step by Step):**

### **الخطوة 1: تهيئة المشروع على Git (إذا لم يكن موجوداً)**

```powershell
cd "c:\Users\Mohamed HatemMubarak\Desktop\markasphare UP"

# حذف المجلد القديم إن كان موجوداً
git init

# إضافة البيانات الأساسية
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

---

### **الخطوة 2: تنظيف الملفات المخزنة مسبقاً**

```powershell
# حذف جميع الملفات من الـ Git Index (لكن ليس من النظام)
git rm -r --cached .

# ملاحظة: هذا الأمر يحذف من الـ Git فقط، لا يحذف الملفات الفعلية

# في حالة حدوث خطأ، جرب:
git rm -r --cached node_modules/
git rm -r --cached dist/
git rm -r --cached .vite/
```

---

### **الخطوة 3: إضافة الملفات الصحيحة**

```powershell
# أضف المشروع كله (بدون المستثنيات في .gitignore)
git add .

# تحقق من الملفات المضافة
git status

# ستلاحظ أن node_modules/ و dist/ لن تظهر (لأنها في .gitignore)
```

---

### **الخطوة 4: عمل Commit أول**

```powershell
git commit -m "Initial commit: Add MarkaSphere project with proper .gitignore"
```

---

### **الخطوة 5: إضافة المستودع البعيد (GitHub)**

```powershell
# استبدل YOUR_USERNAME و YOUR_REPO باسمك وإسم المستودع
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# تحقق من الاتصال
git remote -v

# يجب أن تري:
# origin  https://github.com/YOUR_USERNAME/YOUR_REPO.git (fetch)
# origin  https://github.com/YOUR_USERNAME/YOUR_REPO.git (push)
```

---

### **الخطوة 6: رفع المشروع على GitHub**

```powershell
# اسحب أي ملفات قد تكون موجودة بالفعل (خاصة README)
git pull origin main --allow-unrelated-histories

# رفع إلى الفرع الرئيسي
git branch -M main
git push -u origin main

# في المرات القادمة، استخدم فقط:
# git push
```

---

### **الخطوة 7: إذا كان المستودع موجوداً بالفعل (تحديث موجود)**

```powershell
# حذف الملفات المخزنة مسبقاً
git rm -r --cached node_modules/
git rm -r --cached dist/
git rm -r --cached .vite/

# أضف .gitignore جديد
git add .gitignore

# التزم بالتغييرات
git commit -m "Update .gitignore to exclude node_modules, dist, and cache files"

# أضف الملفات المتبقية
git add .

git commit -m "Clean up: Remove cached dependencies and build files"

# رفع التحديثات
git push -u origin main
```

---

## 🔧 **أمر سريع لحل المشكلة الكاملة:**

إذا كنت تريد حل سريع واحد، استخدم هذا:

```powershell
cd "c:\Users\Mohamed HatemMubarak\Desktop\markasphare UP"

# 1. حذف الملفات المخزنة
git rm -r --cached .

# 2. أضف الملفات الصحيحة
git add .

# 3. التزم
git commit -m "Fix: Remove node_modules and build cache, update .gitignore"

# 4. رفع
git push -u origin main
```

---

## ✅ **بعد الرفع على GitHub:**

1. اذهب إلى **Vercel Dashboard**
2. اختر المشروع **MarkaSphere**
3. اذهب إلى **Project Settings** → **Git Integration**
4. تأكد أن الـ Branch هو `main`
5. اضغط **Redeploy** أو **Deploy** مرة أخرى

---

## 🐛 **إذا استمرت المشكلة:**

### **أضف ملف build override على Vercel:**

أنشئ ملف `vercel.json` بالكود التالي:

```json
{
  "buildCommand": "npm install --legacy-peer-deps && npm run build",
  "outputDirectory": "dist",
  "devCommand": "vite",
  "env": {
    "NODE_ENV": "production"
  }
}
```

أو جرب:

```json
{
  "buildCommand": "npx vite build",
  "outputDirectory": "dist"
}
```

---

## 📋 **أمر للتحقق من الحالة:**

```powershell
# تحقق من الملفات المتتبعة
git ls-files

# لا يجب أن ترى node_modules/ أو dist/ في النتيجة
```

---

## 🎯 **ملخص المشكلة والحل:**

| المشكلة | السبب | الحل |
|--------|------|------|
| Permission denied on vite | node_modules مرفوعة على GitHub | حذفها من Git وإضافة .gitignore |
| Build fails on Vercel | صلاحيات الملفات التنفيذية خاطئة | استخدام `npm ci` و `npx` |
| Vercel not finding vite | node_modules ناقصة على الخادم | npm سيعيد تثبيتها تلقائياً |

