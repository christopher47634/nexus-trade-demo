const { chromium } = require('playwright');
const fs = require('fs');
const out = '/tmp/p3c-after';
fs.mkdirSync(out, { recursive: true });

(async () => {
  const browser = await chromium.launch({
    headless: true, executablePath: '/usr/bin/chromium-browser',
    args: ['--no-sandbox', '--disable-gpu']
  });

  // Screenshots
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  await p.goto('http://localhost:3458/', { waitUntil: 'networkidle', timeout: 30000 });
  await p.waitForTimeout(3000);
  await p.screenshot({ path: out + '/02-homepage-after.png', fullPage: true });
  console.log('02 homepage after');

  // Zoom into sector cards area
  const sectors = await p.locator('text=热门板块').first();
  if (await sectors.isVisible()) {
    await sectors.scrollIntoViewIfNeeded();
    await p.waitForTimeout(500);
    const box = await sectors.boundingBox();
    if (box) {
      await p.screenshot({
        path: out + '/03-sector-cards-detail.png',
        clip: { x: 0, y: box.y - 20, width: 1440, height: 500 }
      });
      console.log('03 sector detail');
    }
  }

  // Zoom into a card to see micro chip
  const optical = await p.locator('text=光通信').first();
  if (await optical.isVisible()) {
    const parent = await optical.locator('xpath=ancestor::div[contains(@class,"group")]').first();
    try {
      const box = await parent.boundingBox();
      if (box) {
        await p.screenshot({
          path: out + '/04-micro-chip-detail.png',
          clip: { x: box.x, y: box.y, width: box.width, height: box.height }
        });
        console.log('04 chip detail');
      }
    } catch {}
  }

  // Video: hover all 10 cards
  const vCtx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    recordVideo: { dir: out, size: { width: 1440, height: 900 } }
  });
  const v = await vCtx.newPage();
  await v.goto('http://localhost:3458/', { waitUntil: 'networkidle', timeout: 30000 });
  await v.waitForTimeout(3000);
  const names = ['光通信', '算力', '半导体', '新能源', '机器人', '低空经济', '白酒', '矿山', '军工', '医药'];
  for (const name of names) {
    const el = await v.locator(`text=${name}`).first();
    if (await el.isVisible()) {
      await el.scrollIntoViewIfNeeded();
      const parent = await el.locator('xpath=ancestor::div[contains(@class,"group")]').first();
      try { await parent.hover(); } catch {}
      await v.waitForTimeout(2000);
      console.log('hover ' + name);
    }
  }
  const vPath = await v.video().path();
  await vCtx.close();
  fs.copyFileSync(vPath, out + '/hover-after-polish.webm');
  console.log('video done');

  await browser.close();
  console.log('all done');
})();
