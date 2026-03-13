#!/usr/bin/env node

/**
 * Test script to verify News API connectivity and debug issues
 * Run: node TEST_NEWS_API.js
 */

require('dotenv').config();
const axios = require('axios');

const CONFIG = {
  newsapi: {
    name: 'NewsAPI',
    url: 'https://newsapi.org/v2/everything',
    key: process.env.NEWSAPI_KEY,
  },
  gnews: {
    name: 'GNews',
    url: 'https://gnews.io/api/v4/search',
    key: process.env.GNEWS_KEY,
  },
  guardian: {
    name: 'Guardian',
    url: 'https://open-platform.theguardian.com/search',
    key: process.env.GUARDIAN_KEY,
  },
  nytimes: {
    name: 'NYTimes',
    url: 'https://api.nytimes.com/svc/search/v2/articlesearch.json',
    key: process.env.NYTIMES_KEY,
  },
};

async function testNewsAPI() {
  try {
    const apiKey = CONFIG.newsapi.key;
    if (!apiKey) {
      console.log('❌ NewsAPI key not configured');
      return { success: false, articles: 0 };
    }

    console.log('\n📰 Testing NewsAPI...');
    const response = await axios.get(CONFIG.newsapi.url, {
      params: {
        q: 'books',
        sortBy: 'publishedAt',
        language: 'en',
        pageSize: 5,
        apiKey: apiKey,
      },
      timeout: 8000,
    });

    const count = response.data.articles?.length || 0;
    console.log(`✅ NewsAPI: Got ${count} articles`);
    return { success: true, articles: count };
  } catch (error) {
    console.log('❌ NewsAPI Error:', error.message);
    return { success: false, articles: 0 };
  }
}

async function testGNews() {
  try {
    const apiKey = CONFIG.gnews.key;
    if (!apiKey) {
      console.log('❌ GNews key not configured');
      return { success: false, articles: 0 };
    }

    console.log('\n📰 Testing GNews...');
    const response = await axios.get(CONFIG.gnews.url, {
      params: {
        q: 'books',
        lang: 'en',
        max: 5,
        apikey: apiKey,
      },
      timeout: 8000,
    });

    const count = response.data.articles?.length || 0;
    console.log(`✅ GNews: Got ${count} articles`);
    return { success: true, articles: count };
  } catch (error) {
    console.log('❌ GNews Error:', error.message);
    return { success: false, articles: 0 };
  }
}

async function testGuardian() {
  try {
    const apiKey = CONFIG.guardian.key;
    if (!apiKey) {
      console.log('❌ Guardian key not configured');
      return { success: false, articles: 0 };
    }

    console.log('\n📰 Testing Guardian...');
    const response = await axios.get(CONFIG.guardian.url, {
      params: {
        q: 'books',
        'api-key': apiKey,
        'page-size': 5,
      },
      timeout: 8000,
    });

    const count = response.data.response?.results?.length || 0;
    console.log(`✅ Guardian: Got ${count} articles`);
    return { success: true, articles: count };
  } catch (error) {
    console.log('❌ Guardian Error:', error.message);
    return { success: false, articles: 0 };
  }
}

async function testNYTimes() {
  try {
    const apiKey = CONFIG.nytimes.key;
    if (!apiKey) {
      console.log('❌ NYTimes key not configured');
      return { success: false, articles: 0 };
    }

    console.log('\n📰 Testing NYTimes...');
    const response = await axios.get(CONFIG.nytimes.url, {
      params: {
        q: 'books',
        'api-key': apiKey,
        sort: 'newest',
      },
      timeout: 8000,
    });

    const count = response.data.response?.docs?.length || 0;
    console.log(`✅ NYTimes: Got ${count} articles`);
    return { success: true, articles: count };
  } catch (error) {
    console.log('❌ NYTimes Error:', error.message);
    return { success: false, articles: 0 };
  }
}

async function run() {
  console.log('🔍 NEWS API DIAGNOSTIC TEST');
  console.log('================================\n');

  console.log('📋 Configuration Status:');
  Object.entries(CONFIG).forEach(([key, config]) => {
    const status = config.key ? '✅' : '❌';
    console.log(`${status} ${config.name}: ${config.key ? 'CONFIGURED' : 'MISSING'}`);
  });

  const results = await Promise.all([
    testNewsAPI(),
    testGNews(),
    testGuardian(),
    testNYTimes(),
  ]);

  console.log('\n================================');
  console.log('📊 SUMMARY:');
  const working = results.filter((r) => r.success).length;
  const totalArticles = results.reduce((sum, r) => sum + r.articles, 0);

  console.log(`✅ Working APIs: ${working}/4`);
  console.log(`📝 Total articles retrieved: ${totalArticles}`);

  if (working === 0) {
    console.log(
      '\n⚠️  ISSUE: No APIs are working. Please check your environment variables in .env'
    );
    console.log('Required variables:');
    console.log('  - NEWSAPI_KEY (from newsapi.org)');
    console.log('  - GNEWS_KEY (from gnews.io)');
    console.log('  - GUARDIAN_KEY (from theguardian.com)');
    console.log('  - NYTIMES_KEY (from nytimes.com)');
  } else if (totalArticles > 0) {
    console.log('\n✅ News APIs are working correctly!');
  }

  process.exit(working > 0 ? 0 : 1);
}

run().catch(console.error);
