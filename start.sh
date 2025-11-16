#!/bin/bash

echo "🚀 Starting CyTutor Application..."
echo ""

# Check if .env exists
if [ ! -f backend/.env ]; then
    echo "⚠️  .env file not found. Creating from .env.example..."
    cp backend/.env.example backend/.env
    echo "✅ Please edit backend/.env with your configuration"
    echo ""
fi

# Check if node_modules exists
if [ ! -d backend/node_modules ]; then
    echo "📦 Installing dependencies..."
    cd backend
    npm install
    cd ..
    echo ""
fi

# Create uploads directory if it doesn't exist
if [ ! -d UI/uploads/avatars ]; then
    echo "📁 Creating uploads directory..."
    mkdir -p UI/uploads/avatars
    echo ""
fi

# Start the server
echo "🌐 Starting server on http://localhost:5000"
echo "📱 Frontend will be available at http://localhost:5000"
echo "🔌 API endpoints: http://localhost:5000/api"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""
cd backend
npm start
