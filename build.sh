#!/bin/bash
# Build script for Hostinger deployment
# This script ensures the build runs from the correct directory

set -e

echo "🔨 Starting build process..."

# Navigate to entree-express directory
cd entree-express

echo "📦 Installing dependencies..."
npm install

echo "🏗️  Building application..."
npm run build

echo "✅ Build completed!"
echo "📁 Build output location:"
ls -la build/

# Verify build output exists
if [ ! -f "build/index.html" ]; then
  echo "❌ ERROR: build/index.html not found!"
  exit 1
fi

echo "✅ Build verification successful!"
echo "📦 Build contents:"
find build -type f | head -10

