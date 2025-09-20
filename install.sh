#!/bin/bash

echo "🚀 Installing Facebook Content Downloader..."
echo

echo "📦 Installing root dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install root dependencies"
    exit 1
fi

echo
echo "📦 Installing server dependencies..."
cd server
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install server dependencies"
    exit 1
fi

echo
echo "📦 Installing client dependencies..."
cd ../client
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install client dependencies"
    exit 1
fi

echo
echo "📝 Creating .env file..."
cd ../server
if [ ! -f .env ]; then
    cp env.example .env
    echo "✅ .env file created"
else
    echo "✅ .env file already exists"
fi

echo
echo "✅ Installation completed successfully!"
echo
echo "🎯 To start the application, run:"
echo "   npm run dev"
echo
echo "🌐 Then open http://localhost:3000 in your browser"
echo
