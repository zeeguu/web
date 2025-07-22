#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const versionFile = path.join(__dirname, '../version.json');
const changelogFile = path.join(__dirname, '../CHANGELOG.md');

function updateChangelog(newVersion) {
  const today = new Date().toISOString().split('T')[0];
  
  if (!fs.existsSync(changelogFile)) {
    console.log('⚠️  CHANGELOG.md not found, creating basic version');
    const basicChangelog = `# Changelog

All notable changes to the Zeeguu Browser Extension will be documented in this file.

## [${newVersion}] - ${today}

### Added
- Release ${newVersion}

`;
    fs.writeFileSync(changelogFile, basicChangelog);
    return;
  }
  
  const changelog = fs.readFileSync(changelogFile, 'utf8');
  
  // Check if version already exists
  if (changelog.includes(`## [${newVersion}]`)) {
    console.log(`📝 Version ${newVersion} already exists in CHANGELOG.md`);
    return;
  }
  
  // Find where to insert new version (after # Changelog and before first ## entry)
  const lines = changelog.split('\n');
  const insertIndex = lines.findIndex(line => line.startsWith('## ['));
  
  if (insertIndex === -1) {
    // No existing versions, add at the end
    const newEntry = `

## [${newVersion}] - ${today}

### Added
- Release ${newVersion}

`;
    fs.writeFileSync(changelogFile, changelog + newEntry);
  } else {
    // Insert before the first existing version
    const newEntry = [
      '',
      `## [${newVersion}] - ${today}`,
      '',
      '### Added',
      `- Release ${newVersion}`,
      '',
    ];
    
    lines.splice(insertIndex, 0, ...newEntry);
    fs.writeFileSync(changelogFile, lines.join('\n'));
  }
  
  console.log(`📝 Added version ${newVersion} to CHANGELOG.md`);
  console.log(`📝 Please edit CHANGELOG.md to describe the changes before publishing!`);
}

function main() {
  const releaseType = process.argv[2] || 'patch';
  
  console.log(`🚀 Preparing ${releaseType} release...`);
  
  try {
    // Step 1: Update version
    console.log('📦 Bumping version...');
    execSync(`node ${path.join(__dirname, 'update-version.js')} bump ${releaseType}`, { stdio: 'inherit' });
    
    // Get the new version
    const versionData = JSON.parse(fs.readFileSync(versionFile, 'utf8'));
    const newVersion = versionData.version;
    
    // Step 2: Update changelog
    console.log('📝 Updating CHANGELOG.md...');
    updateChangelog(newVersion);
    
    // Step 3: Build extension
    console.log('🔨 Building extension...');
    execSync('npm run ext:buildZipChrome', { stdio: 'inherit' });
    
    console.log('');
    console.log('✅ Release preparation complete!');
    console.log('');
    console.log('Next steps:');
    console.log('1. 📝 Edit CHANGELOG.md to describe your changes');
    console.log('2. 🧪 Test the extension from src/extension/build/');
    console.log('3. 📋 Run: npm run ext:git release');
    console.log('4. 🚢 Run: git push && git push origin extension-v' + newVersion);
    console.log('5. 📦 Run: npm run ext:publish');
    
  } catch (error) {
    console.error('❌ Release preparation failed:', error.message);
    process.exit(1);
  }
}

main();