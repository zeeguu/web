// Copies a framed store set (made by frame.js in ios/App/appstore-screenshots)
// to where the Play Store takes it from.
//
//   node copy-screenshots.js      Italian set → metadata/android/en-US; the
//                                 production lane uploads it with the next release.
//   node copy-screenshots.js da   Danish set → custom-listings/denmark; the
//                                 Play API cannot reach custom store listings,
//                                 so these are uploaded by hand in Play Console.
//                                 Run FIXTURE_LANG=da node feature.js first for
//                                 the feature graphic.
const fs = require('fs');
const path = require('path');

const CUSTOM_LISTING_FOR_LANG = { da: 'denmark' };

const lang = process.argv[2] || 'it';
const shotsDir = path.join(__dirname, '../../ios/App/appstore-screenshots/output');
const storeDir = path.join(shotsDir, lang === 'it' ? 'store' : `store-${lang}`);
let androidImages;
if (lang === 'it') {
  androidImages = path.join(__dirname, 'metadata/android/en-US/images');
} else if (CUSTOM_LISTING_FOR_LANG[lang]) {
  androidImages = path.join(__dirname, 'custom-listings', CUSTOM_LISTING_FOR_LANG[lang]);
} else {
  console.error(`No Play listing for "${lang}". Add it to CUSTOM_LISTING_FOR_LANG.`);
  process.exit(1);
}

const copies = [
  { src: 'android-phone', dest: 'phoneScreenshots' },
  { src: 'android-tablet', dest: 'sevenInchScreenshots' },
  { src: 'android-tablet', dest: 'tenInchScreenshots' },
];

copies.forEach(({ src, dest }) => {
  const destDir = path.join(androidImages, dest);
  fs.mkdirSync(destDir, { recursive: true });

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

// The feature graphic (feature.js) belongs with a custom listing.
const featureGraphic = path.join(storeDir, 'feature-graphic.png');
if (lang !== 'it' && fs.existsSync(featureGraphic)) {
  fs.copyFileSync(featureGraphic, path.join(androidImages, 'featureGraphic.png'));
  console.log('Copied: featureGraphic.png');
}

console.log('Done!');
