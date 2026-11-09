// Copies the framed store set (ios/App/appstore-screenshots/output/store,
// made by frame.js) into the Play Store metadata. The production lane
// uploads these screenshots with the next release.
const fs = require('fs');
const path = require('path');

const storeDir = path.join(__dirname, '../../ios/App/appstore-screenshots/output/store');
const androidImages = path.join(__dirname, 'metadata/android/en-US/images');

const copies = [
  { src: 'android-phone', dest: 'phoneScreenshots' },
  { src: 'android-tablet', dest: 'sevenInchScreenshots' },
  { src: 'android-tablet', dest: 'tenInchScreenshots' },
];

copies.forEach(({ src, dest }) => {
  const destDir = path.join(androidImages, dest);

  // Remove the previous set, so a shorter new set leaves no stale extras.
  for (const f of fs.readdirSync(destDir)) {
    if (/^\d+\.png$/.test(f)) fs.unlinkSync(path.join(destDir, f));
  }

  const files = fs.readdirSync(storeDir)
    .filter((f) => new RegExp(`^screenshot-${src}-\\d+\\.png$`).test(f))
    .sort();
  if (!files.length) {
    console.error(`No ${src} screenshots in ${storeDir}. Run frame.js first.`);
    process.exit(1);
  }
  files.forEach((f, i) => {
    fs.copyFileSync(path.join(storeDir, f), path.join(destDir, `${i + 1}.png`));
    console.log(`Copied: ${dest}/${i + 1}.png`);
  });
});

console.log('Done!');
