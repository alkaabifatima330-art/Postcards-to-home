import puppeteer from 'puppeteer';
const browser = await puppeteer.launch({headless:'new'});
for (const [url, name] of [
  ['http://localhost:3000', 'nav-write'],
  ['http://localhost:3000/read.html', 'nav-read'],
  ['http://localhost:3000/explore.html', 'nav-explore'],
]) {
  const page = await browser.newPage();
  await page.setViewport({width:1280,height:200});
  await page.goto(url,{waitUntil:'networkidle0'});
  await new Promise(r=>setTimeout(r,300));
  const nav = await page.$('nav');
  if (nav) {
    const b = await nav.boundingBox();
    await page.screenshot({path:`screenshots/${name}.png`, clip:{x:0,y:0,width:1280,height:Math.min(80,b.y+b.height+10)}});
  }
  await page.close();
}
await browser.close();
console.log('done');
