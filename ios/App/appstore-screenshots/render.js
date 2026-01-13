const puppeteer = require('puppeteer');
const path = require('path');

const devices = [
  { name: 'iphone', width: 1290, height: 2796 },
  { name: 'ipad', width: 2048, height: 2732 },
  { name: 'android-phone', width: 1080, height: 1920 },
  { name: 'android-tablet', width: 1200, height: 1920 },
];

const screenshots = [
  'screenshot1.html',
  'screenshot2.html',
  'screenshot3.html',
  'screenshot4.html',
  'screenshot5.html',
  'screenshot6.html',
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

    for (const file of screenshots) {
      const filePath = path.join(__dirname, file);

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

      const outputName = file.replace('.html', `-${device.name}.png`);
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
