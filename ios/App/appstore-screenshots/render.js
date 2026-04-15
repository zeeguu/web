const puppeteer = require('puppeteer');
const path = require('path');

const devices = [
  { name: 'iphone', width: 1290, height: 2796 },
  { name: 'ipad', width: 2048, height: 2732 },
  { name: 'android-phone', width: 1080, height: 1920 },
  { name: 'android-tablet', width: 1200, height: 1920 },
];

// Marketing screenshots mapped to final ordering positions:
//  01: "Follow topics you love"
//  02: "Read at your own level"
//  05: "Practice words you looked up"
//  08: "Listen to audio lessons daily"
//  10: "Start now!"
// (Live app screenshots fill 03, 04, 06, 07, 09 via render-live.js)
const screenshots = [
  { file: 'screenshot1.html', position: '01' },
  { file: 'screenshot2.html', position: '03' },
  { file: 'screenshot4.html', position: '05' },
  { file: 'screenshot5.html', position: '08' },
  { file: 'screenshot6.html', position: '10' },
];

async function renderScreenshots() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  for (const device of devices) {
    await page.setViewport({
      width: device.width,
      height: device.height,
      deviceScaleFactor: 1
    });

    for (const entry of screenshots) {
      const filePath = path.join(__dirname, entry.file);

      // Inject device-specific dimensions and scale
      await page.goto(`file://${filePath}`);
      await page.evaluate((w, h) => {
        // Base design is for iPhone (1290x2796)
        const baseWidth = 1290;
        const baseHeight = 2796;

        // Scale to fit both dimensions
        const scaleW = w / baseWidth;
        const scaleH = h / baseHeight;
        const scale = Math.min(scaleW, scaleH);

        // Center the content
        const scaledWidth = baseWidth * scale;
        const scaledHeight = baseHeight * scale;
        const offsetX = (w - scaledWidth) / 2;
        const offsetY = (h - scaledHeight) / 2;

        document.body.style.width = baseWidth + 'px';
        document.body.style.height = baseHeight + 'px';
        document.body.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
        document.body.style.transformOrigin = 'top left';
      }, device.width, device.height);

      const outputName = `screenshot${entry.position}-${device.name}.png`;
      await page.screenshot({
        path: path.join(__dirname, 'output', outputName),
        fullPage: false
      });

      console.log(`Created: ${outputName}`);
    }
  }

  await browser.close();
  console.log('Done!');
}

renderScreenshots();
