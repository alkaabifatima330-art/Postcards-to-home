import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 2 });
await page.goto('http://localhost:3000', { waitUntil: 'networkidle0', timeout: 15000 });
await new Promise(r => setTimeout(r, 800));

await page.click('#stamp-box');
await new Promise(r => setTimeout(r, 600));

const info = await page.evaluate(() => {
  const drawer = document.getElementById('stamp-drawer');
  const item0 = document.querySelector('.stamp-item');
  const r = item0.getBoundingClientRect();
  const cx = r.left + r.width/2;
  const cy = r.top + r.height/2;
  const topEl = document.elementFromPoint(cx, cy);
  return {
    drawerStyle: { left: drawer.style.left, top: drawer.style.top, height: drawer.style.height },
    drawerRect: { left: drawer.getBoundingClientRect().left, top: drawer.getBoundingClientRect().top, width: drawer.getBoundingClientRect().width, height: drawer.getBoundingClientRect().height },
    item0: { left: r.left, top: r.top, width: r.width, height: r.height, cx, cy },
    topEl: topEl ? { tag: topEl.tagName, id: topEl.id, class: topEl.className.substring(0,60) } : null,
  };
});
console.log(JSON.stringify(info, null, 2));

// Try clicking the stamp item directly at its center
if (info.item0.cx && info.item0.cy) {
  await page.mouse.click(info.item0.cx / 2, info.item0.cy / 2); // divide by deviceScaleFactor
  await new Promise(r => setTimeout(r, 400));
}

const state = await page.evaluate(() => {
  return {
    boxDisplay: document.getElementById('stamp-box').style.display,
    imgSrc: document.getElementById('stamp-box-img').src,
    imgDisplay: document.getElementById('stamp-box-img').style.display,
  };
});
console.log('After click:', JSON.stringify(state, null, 2));
await page.screenshot({ path: path.join(__dirname, 'screenshots/screenshot-4-debug.png') });
await browser.close();
