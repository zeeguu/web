#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Configuration - Store these as environment variables
const CLIENT_ID = process.env.CHROME_CLIENT_ID;
const CLIENT_SECRET = process.env.CHROME_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.CHROME_REFRESH_TOKEN;
const APP_ID = process.env.CHROME_APP_ID; // Your extension ID

if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN || !APP_ID) {
  console.error('Missing required environment variables:');
  console.error('CHROME_CLIENT_ID, CHROME_CLIENT_SECRET, CHROME_REFRESH_TOKEN, CHROME_APP_ID');
  process.exit(1);
}

async function getAccessToken() {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      refresh_token: REFRESH_TOKEN,
      grant_type: 'refresh_token',
    }),
  });

  const data = await response.json();
  if (!data.access_token) {
    throw new Error('Failed to get access token: ' + JSON.stringify(data));
  }
  return data.access_token;
}

async function uploadExtension(accessToken, zipPath) {
  const zipBuffer = fs.readFileSync(zipPath);

  const response = await fetch(
    `https://www.googleapis.com/upload/chromewebstore/v1.1/items/${APP_ID}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'x-goog-api-version': '2',
        'Content-Type': 'application/zip',
      },
      body: zipBuffer,
    }
  );

  const data = await response.json();
  if (data.uploadState !== 'SUCCESS') {
    throw new Error('Upload failed: ' + JSON.stringify(data));
  }
  console.log('✅ Extension uploaded successfully');
  return data;
}

async function publishExtension(accessToken) {
  const response = await fetch(
    `https://www.googleapis.com/chromewebstore/v1.1/items/${APP_ID}/publish`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'x-goog-api-version': '2',
      },
    }
  );

  const data = await response.json();
  if (data.status && data.status[0] !== 'OK') {
    throw new Error('Publish failed: ' + JSON.stringify(data));
  }
  console.log('✅ Extension published successfully');
  return data;
}

async function main() {
  try {
    const zipPath = path.join(__dirname, '../build.zip');
    
    if (!fs.existsSync(zipPath)) {
      console.error('❌ build.zip not found. Run npm run ext:buildZipChrome first');
      process.exit(1);
    }

    console.log('🔑 Getting access token...');
    const accessToken = await getAccessToken();

    console.log('📦 Uploading extension...');
    await uploadExtension(accessToken, zipPath);

    console.log('🚀 Publishing extension...');
    await publishExtension(accessToken);

    console.log('✅ Extension published to Chrome Web Store!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();