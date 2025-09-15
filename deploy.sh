#!/bin/bash

# 🚀 Smart Tourist Safety System - Quick Deploy Script

echo "🔒 Smart Tourist Safety System - Deployment Script"
echo "=================================================="

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first."
    exit 1
fi

# Check if we're in the right directory
if [[ ! -f "package.json" ]]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

echo "📦 Preparing for deployment..."

# Install dependencies
echo "📥 Installing frontend dependencies..."
cd frontend/web
npm install
cd ../..

echo "📥 Installing backend dependencies..."
cd backend/api-gateway
npm install
cd ../..

# Commit and push changes
echo "📤 Committing changes to Git..."
git add .
git status

echo ""
read -p "📝 Enter commit message (or press Enter for default): " commit_message
if [[ -z "$commit_message" ]]; then
    commit_message="Deploy Smart Tourist Safety System"
fi

git commit -m "$commit_message"

echo ""
echo "🚀 Pushing to GitHub..."
git push origin main

echo ""
echo "✅ Code pushed to GitHub successfully!"
echo ""
echo "🌐 Next Steps:"
echo "1. Deploy Frontend to Vercel:"
echo "   - Go to https://vercel.com"
echo "   - Import your GitHub repository"
echo "   - Set root directory to: frontend/web"
echo ""
echo "2. Deploy Backend to Render:"
echo "   - Go to https://render.com"
echo "   - Create new Web Service from GitHub"
echo "   - Set root directory to: backend/api-gateway"
echo "   - Set start command to: npm start"
echo ""
echo "3. Create databases on Render:"
echo "   - PostgreSQL database"
echo "   - Redis cache"
echo ""
echo "📖 For detailed instructions, see DEPLOYMENT.md"
echo ""
echo "🎉 Deployment preparation complete!"
echo "Your Smart Tourist Safety System is ready to go live!"