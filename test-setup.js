/**
 * Simple test script to verify the Facebook Content Downloader setup
 * Run this script to test if all dependencies are installed correctly
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Facebook Content Downloader Setup...\n');

// Test 1: Check if package.json files exist
console.log('1. Checking package.json files...');
const packageFiles = [
  'package.json',
  'server/package.json',
  'client/package.json'
];

packageFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`   ✅ ${file} exists`);
  } else {
    console.log(`   ❌ ${file} missing`);
  }
});

// Test 2: Check if node_modules exist
console.log('\n2. Checking dependencies...');
const nodeModulesPaths = [
  'node_modules',
  'server/node_modules',
  'client/node_modules'
];

nodeModulesPaths.forEach(dir => {
  if (fs.existsSync(dir)) {
    console.log(`   ✅ ${dir} exists`);
  } else {
    console.log(`   ❌ ${dir} missing - run 'npm install' in ${dir.split('/')[0] || 'root'}`);
  }
});

// Test 3: Check if main files exist
console.log('\n3. Checking main application files...');
const mainFiles = [
  'server/index.js',
  'client/src/App.js',
  'client/src/index.js',
  'client/public/index.html'
];

mainFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`   ✅ ${file} exists`);
  } else {
    console.log(`   ❌ ${file} missing`);
  }
});

// Test 4: Check if .env file exists
console.log('\n4. Checking environment configuration...');
if (fs.existsSync('server/.env')) {
  console.log('   ✅ server/.env exists');
} else {
  console.log('   ⚠️  server/.env missing - copy server/env.example to server/.env');
}

// Test 5: Check Node.js version
console.log('\n5. Checking Node.js version...');
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
if (majorVersion >= 14) {
  console.log(`   ✅ Node.js ${nodeVersion} (compatible)`);
} else {
  console.log(`   ❌ Node.js ${nodeVersion} (requires v14 or higher)`);
}

console.log('\n🎉 Setup test completed!');
console.log('\n📋 Next steps:');
console.log('   1. Install dependencies: npm install');
console.log('   2. Install server dependencies: cd server && npm install');
console.log('   3. Install client dependencies: cd client && npm install');
console.log('   4. Create .env file: cp server/env.example server/.env');
console.log('   5. Start the application: npm run dev');
console.log('\n🌐 Access the app at: http://localhost:3000');
console.log('🔧 API available at: http://localhost:5000/api');
