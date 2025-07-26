#!/bin/bash

echo "🚀 Setting up Mesothelioma Claims Backend..."

# Check if MySQL is running
if ! command -v mysql &> /dev/null; then
    echo "❌ MySQL is not installed or not in PATH"
    exit 1
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found, copying from .env.example"
    cp .env.example .env
    echo "📝 Please edit .env file with your database credentials"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Test database connection
echo "🔌 Testing database connection..."
node test-connection.js

if [ $? -eq 0 ]; then
    echo "✅ Database connection successful"
    
    # Setup database
    echo "🗄️  Setting up database..."
    node manual-setup.js
    
    if [ $? -eq 0 ]; then
        echo "🎉 Setup completed successfully!"
        echo "🚀 You can now start the server with: npm start"
    else
        echo "❌ Database setup failed"
        exit 1
    fi
else
    echo "❌ Database connection failed"
    echo "Please check your .env file and MySQL server"
    exit 1
fi
