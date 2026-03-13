#!/usr/bin/env node

/**
 * Test script to verify News Backend responses
 * Run: node TEST_NEWS_BACKEND.js
 */

require('dotenv').config();
const axios = require('axios');

const API_URL = 'http://localhost:5000/api/news';

async function testEndpoint(endpoint) {
  try {
    console.log(`\n📡 Testing: GET ${endpoint}`);
    const response = await axios.get(`${API_URL}${endpoint}`, {
      timeout: 15000,
    });

    const articles = response.data?.articles || [];
    console.log(`✅ Status: ${response.status}`);
    console.log(`✅ Articles received: ${articles.length}`);

    if (articles.length > 0) {
      console.log('\n📰 First article:');
      const first = articles[0];
      console.log(`  Title: ${first.title?.substring(0, 60)}...`);
      console.log(`  Source: ${first.source}`);
      console.log(`  Provider: ${first.provider}`);
      console.log(`  Has image: ${!!first.image}`);
    }

    return { success: true, count: articles.length };
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
    if (error.response) {
      console.log(`   Status: ${error.response.status}`);
      console.log(`   Data: ${JSON.stringify(error.response.data)}`);
    }
    return { success: false, count: 0 };
  }
}

async function run() {
  console.log('🔍 BACKEND NEWS API TEST');
  console.log('================================');
  console.log(`Testing: ${API_URL}`);

  // Check if server is running
  try {
    await axios.get('http://localhost:5000/api/health', { timeout: 5000 });
    console.log('✅ Server is running\n');
  } catch (error) {
    console.log('❌ Server is not running at http://localhost:5000');
    console.log('   Start the server with: npm run dev');
    process.exit(1);
  }

  const endpoints = ['/top', '/books', '/trending'];

  const results = await Promise.all(
    endpoints.map((endpoint) => testEndpoint(endpoint))
  );

  console.log('\n================================');
  console.log('📊 SUMMARY:');
  const working = results.filter((r) => r.success).length;
  const totalArticles = results.reduce((sum, r) => sum + r.count, 0);

  console.log(`✅ Working endpoints: ${working}/${endpoints.length}`);
  console.log(`📝 Total articles retrieved: ${totalArticles}`);

  if (totalArticles === 0) {
    console.log(
      '\n⚠️  ISSUE: Backend endpoints are working but returning no articles.'
    );
    console.log('   This usually means:');
    console.log('   1. API keys in .env are missing or invalid');
    console.log('   2. All 4 news APIs are failing');
    console.log('   3. The filtering logic is too strict');
  } else {
    console.log('\n✅ Backend is working correctly!');
  }

  process.exit(totalArticles > 0 ? 0 : 1);
}

run().catch(console.error);
