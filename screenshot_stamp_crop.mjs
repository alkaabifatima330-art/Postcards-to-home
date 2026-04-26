import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 2 });
await page.goto('http://localhost:3000', { waitUntil: 'networkidle0', timeout: 15000 });
await new Promise(r => setTimeout(r, 800));

// Open stamp drawer
await page.click('#stamp-box');
await new Promise(r => setTimeout(r, 600));

// Click first stamp item
const items = await page.$$('.stamp-item');
console.log('stamp items found:', items.length);
if (items.length) {
  await items[0].click();
  await new Promise(r => setTimeout(r, 600));
}

// Check state of stamp elements
const state = await page.evaluate(() => {
  const box = document.getElementById('stamp-box');
  const img = document.getElementById('stamp-box-img');
  return {
    boxDisplay: window.getComputedStyle(box).display,
    imgDisplay: window.getComputedStyle(img).display,
    imgSrc: img.src,
    boxStyleDisplay: box.style.display,
    imgStyleDisplay: img.style.display,
  };
});
console.log('State:', JSON.stringify(state, null, 2));

// Screenshot the stamp area
const stampArea = await page.$('.stamp-area');
if (stampArea) {
  await stampArea.screenshot({ path: path.join(__dirname, 'screenshots/stamp-area-crop.png') });
}

await browser.close();
