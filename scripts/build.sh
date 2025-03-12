#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting build process for Green AI Chat..."

# Check Node.js version
echo "📋 Checking Node.js version..."
node -v

# Check npm version
echo "📋 Checking npm version..."
npm -v

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Run linting
echo "🔍 Running linter..."
npm run lint

# Build the application
echo "🏗️ Building the application..."
npm run build

# Output success message
echo "✅ Build completed successfully! The output is in the 'dist' directory." 