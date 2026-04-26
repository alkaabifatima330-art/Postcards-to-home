import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 1.5 });
await page.goto('http://localhost:3000', { waitUntil: 'networkidle0', timeout: 15000 });
await new Promise(r => setTimeout(r, 800));

// Open stamp drawer
await page.click('#stamp-box');
await new Promise(r => setTimeout(r, 500));
await page.screenshot({ path: path.join(__dirname, 'screenshots/screenshot-2-drawer-open.png') });

// Click first stamp
const items = await page.$$('.stamp-item');
if (items.length) await items[0].click();
await new Promise(r => setTimeout(r, 500));
await page.screenshot({ path: path.join(__dirname, 'screenshots/screenshot-3-stamp-chosen.png') });

await browser.close();
console.log('done');
