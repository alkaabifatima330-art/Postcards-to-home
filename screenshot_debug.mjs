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

// Check drawer state
const drawerState = await page.evaluate(() => {
  const drawer = document.getElementById('stamp-drawer');
  const backdrop = document.getElementById('stamp-drawer-backdrop');
  const item0 = document.querySelector('.stamp-item');
  const item0rect = item0 ? item0.getBoundingClientRect() : null;
  // Get element at center of first stamp item
  const cx = item0rect ? item0rect.left + item0rect.width/2 : 0;
  const cy = item0rect ? item0rect.top + item0rect.height/2 : 0;
  const topEl = document.elementFromPoint(cx, cy);
  return {
    drawerOpen: drawer.classList.contains('open'),
    drawerZIndex: window.getComputedStyle(drawer).zIndex,
    backdropOpen: backdrop.classList.contains('open'),
    backdropZIndex: window.getComputedStyle(backdrop).zIndex,
    backdropPointerEvents: window.getComputedStyle(backdrop).pointerEvents,
    item0rect,
    topElClass: topEl ? topEl.className : 'none',
    topElTag: topEl ? topEl.tagName : 'none',
    topElId: topEl ? topEl.id : '',
  };
});
console.log('Drawer state:', JSON.stringify(drawerState, null, 2));

await browser.close();
