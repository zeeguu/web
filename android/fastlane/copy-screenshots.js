const fs = require('fs');
const path = require('path');

const iosOutput = path.join(__dirname, '../../ios/App/appstore-screenshots/output');
const androidImages = path.join(__dirname, 'metadata/android/en-US/images');

const copies = [
  { src: 'android-phone', dest: 'phoneScreenshots', prefix: '' },
  { src: 'android-tablet', dest: 'sevenInchScreenshots', prefix: '7in-' },
  { src: 'android-tablet', dest: 'tenInchScreenshots', prefix: '10in-' },
];

copies.forEach(({ src, dest, prefix }) => {
  const destDir = path.join(androidImages, dest);

  // Copy screenshots 1-6
  for (let i = 1; i <= 6; i++) {
    const srcFile = path.join(iosOutput, `screenshot${i}-${src}.png`);
    const destFile = path.join(destDir, `${prefix}${i}.png`);

    if (fs.existsSync(srcFile)) {
      fs.copyFileSync(srcFile, destFile);
      console.log(`Copied: ${dest}/${prefix}${i}.png`);
    } else {
      console.log(`Missing: ${srcFile}`);
    }
  }
});

console.log('Done!');
