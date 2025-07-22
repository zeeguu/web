#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Configuration - Store these as environment variables
const JWT_ISSUER = process.env.FIREFOX_JWT_ISSUER;
const JWT_SECRET = process.env.FIREFOX_JWT_SECRET;
const ADDON_ID = process.env.FIREFOX_ADDON_ID; // Your addon ID (GUID from manifest)
const ADDON_SLUG = process.env.FIREFOX_ADDON_SLUG; // Alternative: addon slug

if (!JWT_ISSUER || !JWT_SECRET || (!ADDON_ID && !ADDON_SLUG)) {
  console.error('Missing required environment variables:');
  console.error('FIREFOX_JWT_ISSUER, FIREFOX_JWT_SECRET, and either FIREFOX_ADDON_ID or FIREFOX_ADDON_SLUG');
  process.exit(1);
}

// Simple JWT creation (for AMO API)
function createJWT() {
  const crypto = require('crypto');
  
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };
  
  const payload = {
    iss: JWT_ISSUER,
    jti: Math.random().toString(),
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 60 * 5 // 5 minutes
  };
  
  const base64Header = Buffer.from(JSON.stringify(header)).toString('base64url');
  const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  
  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${base64Header}.${base64Payload}`)
    .digest('base64url');
  
  return `${base64Header}.${base64Payload}.${signature}`;
}

async function uploadToFirefox(jwt, zipPath) {
  const identifier = ADDON_SLUG || ADDON_ID;
  
  console.log(`🔍 Checking addon: ${identifier}`);
  
  // Try different endpoint formats
  const endpoints = [
    `https://addons.mozilla.org/api/v5/addons/addon/${identifier}/`,
    `https://addons.mozilla.org/api/v5/addons/${identifier}/`
  ];
  
  let addonFound = false;
  let addonData = null;
  
  for (const endpoint of endpoints) {
    try {
      console.log(`📡 Trying: ${endpoint}`);
      const checkResponse = await fetch(endpoint, {
        headers: {
          Authorization: `JWT ${jwt}`,
        },
      });
      
      if (checkResponse.ok) {
        addonData = await checkResponse.json();
        console.log(`✅ Found addon: ${addonData.name[Object.keys(addonData.name)[0]]}`);
        addonFound = true;
        break;
      } else {
        console.log(`❌ ${endpoint} returned ${checkResponse.status}`);
      }
    } catch (error) {
      console.log(`❌ ${endpoint} failed: ${error.message}`);
    }
  }
  
  if (!addonFound) {
    throw new Error('Addon not found with any endpoint. Please verify FIREFOX_ADDON_ID or FIREFOX_ADDON_SLUG');
  }
  
  console.log('🔄 Updating existing addon with new version');
  return await updateExistingAddon(jwt, zipPath, identifier);
}

async function uploadFile(jwt, zipPath, maxRetries = 3) {
  const uploadEndpoint = 'https://addons.mozilla.org/api/v5/addons/upload/';
  
  console.log(`📤 Step 1: Uploading file to get UUID`);
  console.log(`📁 File size: ${fs.statSync(zipPath).size} bytes`);
  
  // Create multipart form data manually
  const zipBuffer = fs.readFileSync(zipPath);
  const boundary = '----formdata-' + Math.random().toString(36);
  
  const formData = [
    `--${boundary}`,
    'Content-Disposition: form-data; name="upload"; filename="extension.zip"',
    'Content-Type: application/zip',
    '',
    zipBuffer.toString('binary'),
    `--${boundary}`,
    'Content-Disposition: form-data; name="channel"',
    '',
    'listed',
    `--${boundary}--`,
    ''
  ].join('\r\n');
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`📡 Upload attempt ${attempt}/${maxRetries}`);
      
      const response = await fetch(uploadEndpoint, {
        method: 'POST',
        headers: {
          Authorization: `JWT ${jwt}`,
          'Content-Type': `multipart/form-data; boundary=${boundary}`,
          'Content-Length': Buffer.byteLength(formData, 'binary').toString(),
        },
        body: Buffer.from(formData, 'binary'),
      });

      const responseText = await response.text();
      console.log(`📡 Upload response status: ${response.status}`);
      console.log(`📡 Response headers:`, Object.fromEntries(response.headers.entries()));
      
      if (response.ok) {
        const uploadData = JSON.parse(responseText);
        console.log(`✅ File uploaded successfully, UUID: ${uploadData.uuid}`);
        return uploadData.uuid;
      }
      
      // Handle specific error cases
      if (response.status === 503) {
        console.log(`⚠️  Server unavailable (503), retrying in ${attempt * 2} seconds...`);
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, attempt * 2000));
          continue;
        }
      }
      
      console.log(`📡 Upload response: ${responseText || 'Empty response'}`);
      throw new Error(`File upload failed (${response.status}): ${responseText || 'Empty response'}`);
      
    } catch (error) {
      console.log(`❌ Attempt ${attempt} failed: ${error.message}`);
      if (attempt === maxRetries) {
        throw error;
      }
      console.log(`⏳ Waiting ${attempt * 2} seconds before retry...`);
      await new Promise(resolve => setTimeout(resolve, attempt * 2000));
    }
  }
}

async function checkUploadValidation(jwt, uploadUuid, maxWait = 60000) {
  const validationEndpoint = `https://addons.mozilla.org/api/v5/addons/upload/${uploadUuid}/`;
  
  console.log(`🔍 Step 2: Checking upload validation for UUID ${uploadUuid}`);
  
  const startTime = Date.now();
  let attempts = 0;
  
  while (Date.now() - startTime < maxWait) {
    attempts++;
    console.log(`📡 Validation check attempt ${attempts}`);
    
    const response = await fetch(validationEndpoint, {
      headers: {
        Authorization: `JWT ${jwt}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Validation check failed: ${response.status}`);
    }
    
    const validationData = await response.json();
    
    console.log(`📋 Upload validation status:`);
    console.log(`   - Valid: ${validationData.valid}`);
    console.log(`   - Processed: ${validationData.processed}`);
    
    // If processing is complete, show results
    if (validationData.processed) {
      if (validationData.validation) {
        console.log(`   - Messages: ${validationData.validation.messages?.length || 0}`);
        console.log(`   - Errors: ${validationData.validation.errors?.length || 0}`);
        console.log(`   - Warnings: ${validationData.validation.warnings?.length || 0}`);
        
        if (validationData.validation.errors?.length > 0) {
          console.log(`❌ Validation errors:`);
          validationData.validation.errors.forEach((error, i) => {
            console.log(`   ${i + 1}. ${error.message || error.description}`);
            if (error.file) console.log(`      File: ${error.file}`);
            if (error.line) console.log(`      Line: ${error.line}`);
          });
        }
        
        if (validationData.validation.warnings?.length > 0) {
          console.log(`⚠️  Validation warnings:`);
          validationData.validation.warnings.forEach((warning, i) => {
            console.log(`   ${i + 1}. ${warning.message || warning.description}`);
            if (warning.file) console.log(`      File: ${warning.file}`);
          });
        }
        
        if (validationData.validation.messages?.length > 0) {
          console.log(`ℹ️  Validation messages:`);
          validationData.validation.messages.forEach((message, i) => {
            console.log(`   ${i + 1}. ${message.message || message.description}`);
          });
        }
      }
      
      return validationData;
    }
    
    // Still processing, wait and retry
    console.log(`⏳ Validation still processing, waiting 3 seconds...`);
    await new Promise(resolve => setTimeout(resolve, 3000));
  }
  
  throw new Error(`Validation check timed out after ${maxWait / 1000} seconds`);
}

async function updateExistingAddon(jwt, zipPath, identifier) {
  try {
    // Step 1: Upload file to get UUID
    const uploadUuid = await uploadFile(jwt, zipPath);
    
    // Step 2: Check validation status
    const validationData = await checkUploadValidation(jwt, uploadUuid);
    
    if (!validationData.valid) {
      throw new Error('Upload validation failed. Check the errors above.');
    }
    
    // Step 3: Create version using the UUID
    const versionEndpoint = `https://addons.mozilla.org/api/v5/addons/addon/${identifier}/versions/`;
    
    console.log(`📤 Step 3: Creating version with UUID ${uploadUuid}`);
    
    const versionResponse = await fetch(versionEndpoint, {
      method: 'POST',
      headers: {
        Authorization: `JWT ${jwt}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        upload: uploadUuid
      }),
    });

    const responseText = await versionResponse.text();
    console.log(`📡 Version response status: ${versionResponse.status}`);
    
    if (!versionResponse.ok) {
      console.log(`📡 Version response: ${responseText}`);
      throw new Error(`Version creation failed: ${responseText}`);
    }
    
    const versionData = JSON.parse(responseText);
    
    console.log('✅ Extension version updated on Firefox Add-ons');
    console.log(`📋 Version: ${versionData.version}`);
    console.log(`🔗 Review URL: https://addons.mozilla.org/developers/addon/${identifier}/versions/${versionData.id}/`);
    
    return versionData;
  } catch (error) {
    console.log(`❌ Upload error: ${error.message}`);
    throw error;
  }
}

async function main() {
  try {
    const zipPath = path.join(__dirname, '../build.zip');
    
    if (!fs.existsSync(zipPath)) {
      console.error('❌ build.zip not found. Run npm run ext:buildZipFirefox first');
      process.exit(1);
    }

    console.log('🔑 Creating JWT token...');
    const jwt = createJWT();

    console.log('📦 Uploading extension to Firefox Add-ons...');
    await uploadToFirefox(jwt, zipPath);

    console.log('✅ Extension submitted to Firefox Add-ons!');
    console.log('📝 Note: The extension will need manual review before publication');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();