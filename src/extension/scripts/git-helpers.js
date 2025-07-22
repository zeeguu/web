#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const versionFile = path.join(__dirname, '../version.json');

function getCurrentVersion() {
  const versionData = JSON.parse(fs.readFileSync(versionFile, 'utf8'));
  return versionData.version;
}

function execCommand(command, options = {}) {
  try {
    return execSync(command, { 
      encoding: 'utf8',
      stdio: options.silent ? 'pipe' : 'inherit',
      ...options
    }).trim();
  } catch (error) {
    if (!options.silent) {
      console.error(`❌ Command failed: ${command}`);
      console.error(error.message);
    }
    throw error;
  }
}

function gitStatus() {
  console.log('📋 Extension files status:');
  try {
    execCommand('git status --porcelain src/extension/');
    execCommand('git status src/extension/');
  } catch (error) {
    console.log('ℹ️  No changes in extension files');
  }
}

function gitCommit(message) {
  if (!message) {
    console.error('❌ Commit message required');
    console.log('Usage: npm run ext:git commit "Your commit message"');
    process.exit(1);
  }
  
  console.log('📝 Committing extension changes...');
  
  // Add only extension files
  execCommand('git add src/extension/ package.json');
  
  // Create commit with standard format
  const commitMessage = `${message}

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>`;
  
  execCommand(`git commit -m "${commitMessage}"`);
  console.log('✅ Extension changes committed');
}

function gitTag(version) {
  if (!version) {
    version = getCurrentVersion();
  }
  
  const tagName = `extension-v${version}`;
  
  console.log(`🏷️  Creating tag: ${tagName}`);
  
  try {
    execCommand(`git tag -a ${tagName} -m "Extension release ${version}"`);
    console.log(`✅ Tag ${tagName} created`);
    console.log(`📝 Don't forget to push: git push origin ${tagName}`);
  } catch (error) {
    if (error.message.includes('already exists')) {
      console.log(`⚠️  Tag ${tagName} already exists`);
    } else {
      throw error;
    }
  }
}

function gitRelease() {
  const version = getCurrentVersion();
  const tagName = `extension-v${version}`;
  
  console.log(`🚀 Creating release for extension v${version}`);
  
  // Check if there are changes to commit
  try {
    const status = execCommand('git status --porcelain src/extension/ package.json', { silent: true });
    if (status.trim()) {
      console.log('📝 Committing extension changes...');
      execCommand('git add src/extension/ package.json');
      const commitMessage = `Extension release ${version}

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>`;
      execCommand(`git commit -m "${commitMessage}"`);
    } else {
      console.log('ℹ️  No changes to commit');
    }
  } catch (error) {
    // No changes to commit
  }
  
  // Create tag
  gitTag(version);
  
  console.log('');
  console.log('✅ Release created successfully!');
  console.log('');
  console.log('Next steps:');
  console.log(`📤 git push && git push origin ${tagName}`);
  console.log('📦 npm run ext:publish');
}

function listTags() {
  console.log('📋 Extension release tags:');
  try {
    execCommand('git tag -l "extension-v*" --sort=-version:refname');
  } catch (error) {
    console.log('ℹ️  No extension tags found');
  }
}

function main() {
  const command = process.argv[2];
  const arg = process.argv[3];
  
  switch (command) {
    case 'status':
      gitStatus();
      break;
      
    case 'commit':
      gitCommit(arg);
      break;
      
    case 'tag':
      gitTag(arg);
      break;
      
    case 'release':
      gitRelease();
      break;
      
    case 'list-tags':
      listTags();
      break;
      
    default:
      console.log('Git helpers for extension development');
      console.log('');
      console.log('Usage:');
      console.log('  npm run ext:git status              - Show extension file changes');
      console.log('  npm run ext:git commit "message"    - Commit extension changes');
      console.log('  npm run ext:git tag [version]       - Create extension tag');
      console.log('  npm run ext:git release             - Full release (commit + tag)');
      console.log('  npm run ext:git list-tags           - List extension release tags');
      break;
  }
}

main();