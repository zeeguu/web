#!/usr/bin/env node

const open = require('open');

// Configuration - Read from environment variables
const CLIENT_ID = process.env.CHROME_CLIENT_ID;
const CLIENT_SECRET = process.env.CHROME_CLIENT_SECRET;

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('❌ Missing required environment variables:');
  console.error('   CHROME_CLIENT_ID and CHROME_CLIENT_SECRET must be set');
  console.error('');
  console.error('Setup instructions:');
  console.error('1. Go to https://console.cloud.google.com/');
  console.error('2. Create OAuth2 credentials (Desktop application)');
  console.error('3. Set environment variables:');
  console.error('   export CHROME_CLIENT_ID="your-client-id"');
  console.error('   export CHROME_CLIENT_SECRET="your-client-secret"');
  process.exit(1);
}

async function getRefreshToken() {
  const scope = 'https://www.googleapis.com/auth/chromewebstore';
  const redirectUri = 'http://localhost:8080';
  
  // Step 1: Create authorization URL
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${CLIENT_ID}&` +
    `redirect_uri=${encodeURIComponent(redirectUri)}&` +
    `scope=${encodeURIComponent(scope)}&` +
    `response_type=code&` +
    `access_type=offline&` +
    `prompt=consent`;
  
  console.log('🔑 Getting Chrome Web Store refresh token...');
  console.log('');
  console.log('Opening browser for OAuth authorization...');
  console.log('');
  console.log('Manual steps:');
  console.log('1. Browser will open to Google OAuth page');
  console.log('2. Sign in and authorize the application');
  console.log('3. Copy the "code" parameter from the redirect URL');
  console.log('4. Run this command with the code:');
  console.log('');
  console.log('curl -X POST https://oauth2.googleapis.com/token \\');
  console.log(`  -d "client_id=${CLIENT_ID}" \\`);
  console.log(`  -d "client_secret=${CLIENT_SECRET}" \\`);
  console.log('  -d "redirect_uri=http://localhost:8080" \\');
  console.log('  -d "grant_type=authorization_code" \\');
  console.log('  -d "code=YOUR_CODE_HERE"');
  console.log('');
  console.log('5. Look for "refresh_token" in the response');
  console.log('6. Set: export CHROME_REFRESH_TOKEN="your-refresh-token"');
  
  try {
    await open(authUrl);
  } catch (error) {
    console.log('');
    console.log('❌ Could not open browser automatically');
    console.log('📋 Please open this URL manually:');
    console.log(authUrl);
  }
}

getRefreshToken();