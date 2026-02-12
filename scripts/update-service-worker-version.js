const fs = require('fs');
const path = require('path');

// Generate timestamp-based version
const buildTimestamp = new Date().toISOString().replace(/[-:.]/g, '').slice(0, 14); // Format: YYYYMMDDHHMMSS

console.log(`Generating service worker with version: v${buildTimestamp}`);

// Paths
const templatePath = path.join(process.cwd(), 'public/service-worker.template.js');
const outputPath = path.join(process.cwd(), 'public/service-worker.js');

// Read the template file
let content = fs.readFileSync(templatePath, 'utf8');

// Replace the placeholders with versioned cache names
content = content.replace('__OFFLINE_CACHE_VERSION__', `offline-cache-v${buildTimestamp}`);
content = content.replace('__DATA_CACHE_VERSION__', `data-cache-v${buildTimestamp}`);

// Write the generated service worker
fs.writeFileSync(outputPath, content, 'utf8');

console.log('Service worker generated successfully!');
