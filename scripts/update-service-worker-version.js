const fs = require('fs');
const path = require('path');

// Generate timestamp-based version
const buildTimestamp = new Date().toISOString().replace(/[-:.]/g, '').slice(0, 14); // Format: YYYYMMDDHHMMSS
const version = `v${buildTimestamp}`;

console.log(`Updating service worker with version: ${version}`);

// Path to the service worker - works from project root
const serviceWorkerPath = path.join(process.cwd(), 'public/service-worker.js');

// Read the service worker file
let content = fs.readFileSync(serviceWorkerPath, 'utf8');

// Replace the version strings
content = content.replace(
  /const OFFLINE_CACHE = "offline-cache-v[^"]+";/,
  `const OFFLINE_CACHE = "offline-cache-${version}";`
);

content = content.replace(
  /const DATA_CACHE = "offline-cache-v[^"]+";/,
  `const DATA_CACHE = "data-cache-${version}";`
);

// Write the updated content back
fs.writeFileSync(serviceWorkerPath, content, 'utf8');

console.log('Service worker version updated successfully!');