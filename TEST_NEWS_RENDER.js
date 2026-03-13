// Test script to verify news API returns correct structure
const http = require('http');

function testNewsAPI(endpoint) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:5000/api/news/${endpoint}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          console.log(`\n✓ ${endpoint.toUpperCase()} Response:`);
          console.log(`  Status: ${res.statusCode}`);
          console.log(`  Type: ${Array.isArray(parsed) ? 'Array' : 'Object'}`);
          if (Array.isArray(parsed)) {
            console.log(`  Length: ${parsed.length}`);
            if (parsed.length > 0) {
              console.log(`  First item keys: ${Object.keys(parsed[0]).join(', ')}`);
              console.log(`  First item:`, JSON.stringify(parsed[0], null, 2).slice(0, 200) + '...');
            }
          } else {
            console.log(`  Keys: ${Object.keys(parsed).join(', ')}`);
          }
          resolve();
        } catch (e) {
          console.error(`✗ ${endpoint} - Parse error:`, e.message);
          reject(e);
        }
      });
    }).on('error', err => {
      console.error(`✗ ${endpoint} - Connection error:`, err.message);
      reject(err);
    });
  });
}

async function runTests() {
  console.log('Testing News API Endpoints...\n');
  try {
    await testNewsAPI('headlines');
    await testNewsAPI('books');
    await testNewsAPI('trending');
    console.log('\n✓ All tests completed');
  } catch (err) {
    console.error('Test failed:', err.message);
  }
}

runTests();
