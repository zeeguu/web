#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const versionFile = path.join(__dirname, '../version.json');
const chromeManifest = path.join(__dirname, '../manifest.chrome.json');
const firefoxManifest = path.join(__dirname, '../manifest.firefox.json');
const chromeDevManifest = path.join(__dirname, '../manifest.chrome.dev.json');
const firefoxDevManifest = path.join(__dirname, '../manifest.firefox.dev.json');

function updateVersion(type = 'patch') {
  // Read current version
  const versionData = JSON.parse(fs.readFileSync(versionFile, 'utf8'));
  const [major, minor, patch] = versionData.version.split('.').map(Number);
  
  // Calculate new version based on type
  let newVersion;
  switch (type) {
    case 'major':
      newVersion = `${major + 1}.0.0`;
      break;
    case 'minor':
      newVersion = `${major}.${minor + 1}.0`;
      break;
    case 'patch':
    default:
      newVersion = `${major}.${minor}.${patch + 1}`;
      break;
  }
  
  console.log(`📦 Updating version from ${versionData.version} to ${newVersion}`);
  
  // Update version.json
  versionData.version = newVersion;
  fs.writeFileSync(versionFile, JSON.stringify(versionData, null, 2) + '\n');
  
  // Update Chrome manifest
  if (fs.existsSync(chromeManifest)) {
    const chromeData = JSON.parse(fs.readFileSync(chromeManifest, 'utf8'));
    chromeData.version = newVersion;
    chromeData.name = versionData.name;
    chromeData.description = versionData.description;
    fs.writeFileSync(chromeManifest, JSON.stringify(chromeData, null, 2) + '\n');
    console.log('✅ Updated manifest.chrome.json');
  }
  
  // Update Firefox manifest
  if (fs.existsSync(firefoxManifest)) {
    const firefoxData = JSON.parse(fs.readFileSync(firefoxManifest, 'utf8'));
    firefoxData.version = newVersion;
    firefoxData.name = versionData.name;
    firefoxData.description = versionData.description;
    fs.writeFileSync(firefoxManifest, JSON.stringify(firefoxData, null, 2) + '\n');
    console.log('✅ Updated manifest.firefox.json');
  }

  // Update Chrome dev manifest
  if (fs.existsSync(chromeDevManifest)) {
    const chromeDevData = JSON.parse(fs.readFileSync(chromeDevManifest, 'utf8'));
    chromeDevData.version = newVersion;
    chromeDevData.name = versionData.name;
    chromeDevData.description = versionData.description;
    fs.writeFileSync(chromeDevManifest, JSON.stringify(chromeDevData, null, 2) + '\n');
    console.log('✅ Updated manifest.chrome.dev.json');
  }

  // Update Firefox dev manifest
  if (fs.existsSync(firefoxDevManifest)) {
    const firefoxDevData = JSON.parse(fs.readFileSync(firefoxDevManifest, 'utf8'));
    firefoxDevData.version = newVersion;
    firefoxDevData.name = versionData.name;
    firefoxDevData.description = versionData.description;
    fs.writeFileSync(firefoxDevManifest, JSON.stringify(firefoxDevData, null, 2) + '\n');
    console.log('✅ Updated manifest.firefox.dev.json');
  }
  
  console.log(`🎉 Successfully updated to version ${newVersion}`);
  console.log('📝 Don\'t forget to update CHANGELOG.md with your changes!');
  
  return newVersion;
}

function getCurrentVersion() {
  const versionData = JSON.parse(fs.readFileSync(versionFile, 'utf8'));
  return versionData.version;
}

function syncManifests() {
  const versionData = JSON.parse(fs.readFileSync(versionFile, 'utf8'));
  
  console.log(`🔄 Syncing manifests to version ${versionData.version}`);
  
  // Update Chrome manifest
  if (fs.existsSync(chromeManifest)) {
    const chromeData = JSON.parse(fs.readFileSync(chromeManifest, 'utf8'));
    chromeData.version = versionData.version;
    chromeData.name = versionData.name;
    chromeData.description = versionData.description;
    fs.writeFileSync(chromeManifest, JSON.stringify(chromeData, null, 2) + '\n');
    console.log('✅ Synced manifest.chrome.json');
  }
  
  // Update Firefox manifest
  if (fs.existsSync(firefoxManifest)) {
    const firefoxData = JSON.parse(fs.readFileSync(firefoxManifest, 'utf8'));
    firefoxData.version = versionData.version;
    firefoxData.name = versionData.name;
    firefoxData.description = versionData.description;
    fs.writeFileSync(firefoxManifest, JSON.stringify(firefoxData, null, 2) + '\n');
    console.log('✅ Synced manifest.firefox.json');
  }

  // Update Chrome dev manifest
  if (fs.existsSync(chromeDevManifest)) {
    const chromeDevData = JSON.parse(fs.readFileSync(chromeDevManifest, 'utf8'));
    chromeDevData.version = versionData.version;
    chromeDevData.name = versionData.name;
    chromeDevData.description = versionData.description;
    fs.writeFileSync(chromeDevManifest, JSON.stringify(chromeDevData, null, 2) + '\n');
    console.log('✅ Synced manifest.chrome.dev.json');
  }

  // Update Firefox dev manifest
  if (fs.existsSync(firefoxDevManifest)) {
    const firefoxDevData = JSON.parse(fs.readFileSync(firefoxDevManifest, 'utf8'));
    firefoxDevData.version = versionData.version;
    firefoxDevData.name = versionData.name;
    firefoxDevData.description = versionData.description;
    fs.writeFileSync(firefoxDevManifest, JSON.stringify(firefoxDevData, null, 2) + '\n');
    console.log('✅ Synced manifest.firefox.dev.json');
  }
}

// CLI handling
const command = process.argv[2];
const versionType = process.argv[3] || 'patch';

switch (command) {
  case 'bump':
    updateVersion(versionType);
    break;
  case 'sync':
    syncManifests();
    break;
  case 'current':
    console.log(getCurrentVersion());
    break;
  default:
    console.log('Usage:');
    console.log('  npm run ext:version bump [patch|minor|major]  - Bump version');
    console.log('  npm run ext:version sync                      - Sync manifests');
    console.log('  npm run ext:version current                   - Show current version');
    break;
}