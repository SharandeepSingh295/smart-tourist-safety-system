# 🚀 Smart Tourist Safety System - Deployment Guide

This guide will help you deploy your Smart Tourist Safety System to production with proper public URLs.

## 🎯 Deployment Overview

We'll deploy the system using:
- **Frontend Web App**: Vercel (Free)
- **Backend API**: Render.com (Free)
- **Database**: PostgreSQL on Render (Free)
- **Caching**: Redis on Render (Free)

## 📋 Prerequisites

1. **GitHub Account**: Your code needs to be on GitHub
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
3. **Render Account**: Sign up at [render.com](https://render.com)

## 🌐 Frontend Deployment (Vercel)

### Step 1: Prepare Your Repository
```bash
# Ensure your code is pushed to GitHub
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### Step 2: Deploy to Vercel

1. **Login to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Sign in with your GitHub account

2. **Import Your Project**:
   - Click "New Project"
   - Import your `smart-tourist-safety-system` repository
   - Select "Frontend Web App" as the framework preset

3. **Configure Build Settings**:
   - **Root Directory**: `frontend/web`
   - **Build Command**: `npm run build` (or leave empty for static)
   - **Output Directory**: `./` (current directory)
   - **Install Command**: `npm install`

4. **Environment Variables**:
   Add these environment variables in Vercel:
   ```
   NODE_ENV=production
   ```

5. **Deploy**:
   - Click "Deploy"
   - Wait for deployment to complete
   - Your app will be available at: `https://your-project-name.vercel.app`

### Step 3: Update Frontend URLs
Once deployed, update the API URL in your frontend code:

```javascript
// In frontend/web/script.js
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3001/api'  // Local development
    : 'https://your-backend-name.onrender.com/api';  // Replace with your actual Render URL
```

## ⚙️ Backend Deployment (Render)

### Step 1: Deploy Backend Service

1. **Login to Render**:
   - Go to [render.com](https://render.com)
   - Sign in with your GitHub account

2. **Create a New Web Service**:
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Select your `smart-tourist-safety-system` repository

3. **Configure Service Settings**:
   ```
   Name: smart-tourist-safety-api
   Environment: Node
   Branch: main
   Root Directory: backend/api-gateway
   Build Command: npm install
   Start Command: npm start
   ```

4. **Environment Variables**:
   Add these environment variables:
   ```
   NODE_ENV=production
   PORT=10000
   JWT_SECRET=your_secure_jwt_secret_here_change_this
   ALLOWED_ORIGINS=https://your-vercel-app.vercel.app
   ```

### Step 2: Create Database (PostgreSQL)

1. **Create PostgreSQL Database**:
   - In Render dashboard, click "New" → "PostgreSQL"
   - Name: `smart-tourist-safety-db`
   - Select free plan
   - Click "Create Database"

2. **Get Database Connection Info**:
   - Once created, go to database settings
   - Copy the connection details
   - Add to your web service environment variables:
   ```
   DB_HOST=your_db_host
   DB_NAME=your_db_name
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_PORT=5432
   ```

### Step 3: Create Redis Cache

1. **Create Redis Instance**:
   - In Render dashboard, click "New" → "Redis"
   - Name: `smart-tourist-safety-redis`
   - Select free plan
   - Click "Create Redis"

2. **Add Redis Connection**:
   Add to your web service environment variables:
   ```
   REDIS_HOST=your_redis_host
   REDIS_PORT=6379
   REDIS_PASSWORD=your_redis_password
   ```

## 🔄 Update Your Code

### Update CORS Settings
In your backend `server.js`, update CORS to allow your Vercel domain:

```javascript
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? [process.env.ALLOWED_ORIGINS.split(',')]
        : ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true
}));
```

### Update Frontend API URL
In `frontend/web/script.js`:

```javascript
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3001/api'
    : 'https://smart-tourist-safety-api.onrender.com/api'; // Replace with your actual URL
```

## 🚀 Deployment Commands

### Quick Deployment Script
```bash
# Frontend (push to trigger Vercel deployment)
git add .
git commit -m "Deploy frontend"
git push origin main

# Backend (push to trigger Render deployment)
git add .
git commit -m "Deploy backend with production configs"
git push origin main
```

## 📊 Post-Deployment Checklist

### ✅ Verify Frontend Deployment
- [ ] Visit your Vercel URL
- [ ] Check that the website loads properly
- [ ] Test basic functionality (navigation, UI)
- [ ] Check browser console for errors

### ✅ Verify Backend Deployment
- [ ] Visit `https://your-backend.onrender.com/health`
- [ ] Should return JSON with status "OK"
- [ ] Test API endpoints with tools like Postman

### ✅ Test Integration
- [ ] Frontend can connect to backend API
- [ ] Location tracking works
- [ ] Geofencing API calls succeed
- [ ] Safety monitoring functions properly

## 🔧 Troubleshooting

### Common Issues:

1. **CORS Errors**:
   ```
   Solution: Update ALLOWED_ORIGINS environment variable
   ```

2. **API Connection Failed**:
   ```
   Solution: Check API_BASE_URL in frontend script.js
   ```

3. **Database Connection Issues**:
   ```
   Solution: Verify database environment variables in Render
   ```

4. **Build Failures**:
   ```
   Solution: Check package.json and build commands
   ```

## 🌐 Your Live URLs

After successful deployment, you'll have:

- **Frontend**: `https://your-project-name.vercel.app`
- **Backend API**: `https://your-backend-name.onrender.com`
- **API Health Check**: `https://your-backend-name.onrender.com/health`

## 🔄 Continuous Deployment

Both Vercel and Render will automatically deploy when you push changes to your GitHub repository:

```bash
# Make changes to your code
git add .
git commit -m "Your changes"
git push origin main
# Automatic deployment will trigger
```

## 🎉 Success!

Your Smart Tourist Safety System is now live on the internet with proper public URLs! 

Share your live website URL with others and test all the safety features in a real-world environment.

---

**Need Help?** Check the [troubleshooting section](#🔧-troubleshooting) or create an issue in the repository.