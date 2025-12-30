const puppeteer = require('puppeteer');
const path = require('path');

const devices = [
  { name: 'iphone', width: 1290, height: 2796 },
  { name: 'ipad', width: 2048, height: 2732 },
];

const screenshots = [
  'screenshot1.html',
  'screenshot2.html',
  'screenshot3.html',
  'screenshot4.html',
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

      // Inject device-specific dimensions
      await page.goto(`file://${filePath}`);
      await page.evaluate((w, h) => {
        document.body.style.width = w + 'px';
        document.body.style.height = h + 'px';
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
