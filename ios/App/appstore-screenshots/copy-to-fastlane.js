const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, 'output');
const fastlaneDir = path.join(__dirname, '..', 'fastlane', 'screenshots', 'en-US');

// Find all iPhone screenshots in output folder
const files = fs.readdirSync(outputDir);
const iphoneScreenshots = files
  .filter(f => f.match(/^screenshot\d+-iphone\.png$/))
  .sort((a, b) => {
    const numA = parseInt(a.match(/\d+/)[0]);
    const numB = parseInt(b.match(/\d+/)[0]);
    return numA - numB;
  });

console.log(`Found ${iphoneScreenshots.length} screenshots to copy...`);

// Clear existing fastlane screenshots
const existingFiles = fs.readdirSync(fastlaneDir);
for (const file of existingFiles) {
  if (file.match(/^\d+_APP_(IPHONE|IPAD)/)) {
    fs.unlinkSync(path.join(fastlaneDir, file));
  }
}

// Copy each screenshot
for (const iphoneFile of iphoneScreenshots) {
  const num = parseInt(iphoneFile.match(/\d+/)[0]);
  const idx = num - 1;

  const iphoneSrc = path.join(outputDir, iphoneFile);
  const iphoneDst = path.join(fastlaneDir, `${idx}_APP_IPHONE_65_${idx}.png`);
  fs.copyFileSync(iphoneSrc, iphoneDst);
  console.log(`Copied: ${iphoneFile} -> ${idx}_APP_IPHONE_65_${idx}.png`);

  const ipadFile = iphoneFile.replace('-iphone', '-ipad');
  const ipadSrc = path.join(outputDir, ipadFile);
  const ipadDst = path.join(fastlaneDir, `${idx}_APP_IPAD_PRO_3GEN_129_${idx}.png`);
  if (fs.existsSync(ipadSrc)) {
    fs.copyFileSync(ipadSrc, ipadDst);
    console.log(`Copied: ${ipadFile} -> ${idx}_APP_IPAD_PRO_3GEN_129_${idx}.png`);
  }
}

console.log('Done!');
