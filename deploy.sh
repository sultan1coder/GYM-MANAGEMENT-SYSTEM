#!/bin/bash

echo "🚀 Gym Management System - Render Deployment Script"
echo "=================================================="

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not found. Please initialize git first:"
    echo "   git init"
    echo "   git add ."
    echo "   git commit -m 'Initial commit'"
    echo "   git remote add origin <your-github-repo-url>"
    exit 1
fi

# Check if there are uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  You have uncommitted changes. Please commit them first:"
    git status --short
    echo ""
    echo "Run: git add . && git commit -m 'Prepare for deployment'"
    exit 1
fi

# Check if remote origin is set
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "❌ Git remote origin not set. Please add your GitHub repository:"
    echo "   git remote add origin <your-github-repo-url>"
    exit 1
fi

echo "✅ Git repository is ready"
echo ""

# Push to GitHub
echo "📤 Pushing to GitHub..."
git push origin main

if [ $? -eq 0 ]; then
    echo "✅ Successfully pushed to GitHub"
else
    echo "❌ Failed to push to GitHub"
    exit 1
fi

echo ""
echo "🎯 Next Steps:"
echo "=============="
echo "1. Go to https://render.com and sign in"
echo "2. Create a new PostgreSQL database"
echo "3. Deploy your backend service"
echo "4. Deploy your frontend service"
echo ""
echo "📖 See DEPLOYMENT_GUIDE.md for detailed instructions"
echo ""
echo "🔗 Your services will be available at:"
echo "   Frontend: https://gym-management-frontend.onrender.com"
echo "   Backend:  https://gym-management-backend.onrender.com"
echo ""
echo "✨ Happy deploying!"
