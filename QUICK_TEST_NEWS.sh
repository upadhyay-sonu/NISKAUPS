#!/bin/bash

# Quick Test Script for News API Fix
# Run this to diagnose news API issues

echo "📰 NEWS API QUICK TEST"
echo "======================================"
echo ""

# Check if server is running
echo "🔍 Checking if server is running..."
if curl -s http://localhost:5000/api/health > /dev/null; then
    echo "✅ Server is running on port 5000"
else
    echo "❌ Server is not running"
    echo "   Start it with: npm run dev"
    exit 1
fi

echo ""
echo "📡 Testing news endpoints..."
echo ""

# Test /news/top
echo "1️⃣  GET /api/news/top"
curl -s http://localhost:5000/api/news/top | jq '.articles | length' 2>/dev/null && echo "   ✅ Articles received" || echo "   ❌ Error"

# Test /news/books
echo ""
echo "2️⃣  GET /api/news/books"
curl -s http://localhost:5000/api/news/books | jq '.articles | length' 2>/dev/null && echo "   ✅ Articles received" || echo "   ❌ Error"

# Test /news/trending
echo ""
echo "3️⃣  GET /api/news/trending"
curl -s http://localhost:5000/api/news/trending | jq '.articles | length' 2>/dev/null && echo "   ✅ Articles received" || echo "   ❌ Error"

echo ""
echo "======================================"
echo "✅ If all 3 show ✅, the API is working!"
echo "❌ If any show ❌, run: node TEST_NEWS_API.js"
