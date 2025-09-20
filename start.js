/**
 * Startup script for Facebook Content Downloader
 * This script helps users get started quickly
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Facebook Content Downloader...\n');

// Check if dependencies are installed
function checkDependencies() {
  const serverNodeModules = fs.existsSync('server/node_modules');
  const clientNodeModules = fs.existsSync('client/node_modules');
  
  if (!serverNodeModules || !clientNodeModules) {
    console.log('📦 Installing dependencies...\n');
    
    if (!serverNodeModules) {
      console.log('Installing server dependencies...');
      const serverInstall = spawn('npm', ['install'], { cwd: 'server', stdio: 'inherit' });
      serverInstall.on('close', (code) => {
        if (code === 0) {
          console.log('✅ Server dependencies installed');
        } else {
          console.log('❌ Failed to install server dependencies');
        }
      });
    }
    
    if (!clientNodeModules) {
      console.log('Installing client dependencies...');
      const clientInstall = spawn('npm', ['install'], { cwd: 'client', stdio: 'inherit' });
      clientInstall.on('close', (code) => {
        if (code === 0) {
          console.log('✅ Client dependencies installed');
        } else {
          console.log('❌ Failed to install client dependencies');
        }
      });
    }
  }
}

// Create .env file if it doesn't exist
function createEnvFile() {
  const envPath = 'server/.env';
  const envExamplePath = 'server/env.example';
  
  if (!fs.existsSync(envPath) && fs.existsSync(envExamplePath)) {
    console.log('📝 Creating .env file...');
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ .env file created');
  }
}

// Start the development servers
function startServers() {
  console.log('\n🎯 Starting development servers...\n');
  
  // Start backend server
  console.log('Starting backend server on port 5000...');
  const server = spawn('npm', ['run', 'dev'], { cwd: 'server', stdio: 'inherit' });
  
  // Start frontend server
  console.log('Starting frontend server on port 3000...');
  const client = spawn('npm', ['start'], { cwd: 'client', stdio: 'inherit' });
  
  // Handle process termination
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down servers...');
    server.kill();
    client.kill();
    process.exit(0);
  });
  
  console.log('\n✅ Servers started successfully!');
  console.log('🌐 Frontend: http://localhost:3000');
  console.log('🔧 Backend API: http://localhost:5000/api');
  console.log('\nPress Ctrl+C to stop the servers');
}

// Main execution
async function main() {
  try {
    checkDependencies();
    createEnvFile();
    
    // Wait a bit for dependencies to install
    setTimeout(() => {
      startServers();
    }, 3000);
    
  } catch (error) {
    console.error('❌ Error starting the application:', error.message);
    process.exit(1);
  }
}

main();
