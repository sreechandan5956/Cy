#!/bin/bash

echo "🛠️  CyTutor Development Setup"
echo "================================"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"
echo ""

# Navigate to backend
cd backend

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "✅ .env file created"
    echo ""
    echo "⚠️  IMPORTANT: Edit backend/.env with your configuration:"
    echo "   - JWT_SECRET (generate a secure random string)"
    echo "   - Database credentials (if using PostgreSQL)"
    echo "   - Email SMTP settings (for welcome emails)"
    echo ""
else
    echo "✅ .env file already exists"
    echo ""
fi

# Install dependencies
echo "📦 Installing backend dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

cd ..

# Create necessary directories
echo ""
echo "📁 Creating required directories..."

mkdir -p UI/uploads/avatars
mkdir -p UI/uploads/challenges
mkdir -p logs

echo "✅ Directories created"
echo ""

# Create .gitignore for uploads
if [ ! -f UI/uploads/.gitignore ]; then
    echo "*" > UI/uploads/.gitignore
    echo "!.gitignore" >> UI/uploads/.gitignore
    echo "✅ Created .gitignore for uploads"
fi

echo ""
echo "================================"
echo "✅ Setup Complete!"
echo ""
echo "Next steps:"
echo "1. Edit backend/.env with your configuration"
echo "2. Run './start.sh' to start the server"
echo "3. Open http://localhost:5000 in your browser"
echo ""
echo "For development with auto-reload:"
echo "   cd backend && npm run dev"
echo ""
