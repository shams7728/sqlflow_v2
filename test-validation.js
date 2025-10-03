#!/usr/bin/env node

const fetch = require('node-fetch');

const API_BASE = 'http://localhost:5000/api';
const headers = { 'x-user-id': 'guest', 'Content-Type': 'application/json' };

async function runValidationTests() {
  console.log('🧪 Starting Comprehensive Validation Tests...\n');
  
  const tests = [
    {
      name: 'Health Check',
      test: () => fetch(`${API_BASE}/health`).then(r => r.json())
    },
    {
      name: 'Get User Progress',
      test: () => fetch(`${API_BASE}/progress/user`, { headers }).then(r => r.json())
    },
    {
      name: 'Get User Stats',
      test: () => fetch(`${API_BASE}/progress/stats`, { headers }).then(r => r.json())
    },
    {
      name: 'Get Achievements',
      test: () => fetch(`${API_BASE}/achievements/user`, { headers }).then(r => r.json())
    },
    {
      name: 'Create New Progress',
      test: () => fetch(`${API_BASE}/progress/update`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          lessonId: `validation-test-${Date.now()}`,
          status: 'completed',
          score: 95,
          timeSpent: 300
        })
      }).then(r => r.json())
    }
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      console.log(`⏳ Running: ${test.name}`);
      const result = await test.test();
      
      if (result.success !== false && !result.error) {
        console.log(`✅ PASS: ${test.name}`);
        if (result.data) {
          console.log(`   Data: ${JSON.stringify(result.data).substring(0, 100)}...`);
        }
        passed++;
      } else {
        console.log(`❌ FAIL: ${test.name} - ${result.error || 'Unknown error'}`);
        failed++;
      }
    } catch (error) {
      console.log(`❌ FAIL: ${test.name} - ${error.message}`);
      failed++;
    }
    console.log('');
  }

  console.log('📊 Test Results:');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success Rate: ${Math.round((passed / (passed + failed)) * 100)}%`);
  
  if (failed === 0) {
    console.log('\n🎉 All tests passed! The progress system is fully functional.');
  } else {
    console.log('\n⚠️  Some tests failed. Check the backend server and database connection.');
  }
}

runValidationTests().catch(console.error);