const { chromium } = require('playwright');
const fs = require('fs');
const out = '/tmp/p2d-screenshots';
fs.mkdirSync(out, { recursive: true });

(async () => {
  const browser = await chromium.launch({
    headless: true, executablePath: '/usr/bin/chromium-browser',
    args: ['--no-sandbox', '--disable-gpu']
  });

  // Desktop screenshots
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  await p.goto('http://localhost:3458/', { waitUntil: 'networkidle', timeout: 30000 });
  await p.waitForTimeout(4000);
  await p.screenshot({ path: out + '/01-desktop-home.png' });
  console.log('01 desktop home');

  // Sector detail pages
  for (const [id, name] of [['optical-communication', '光通信'], ['computing-power', '算力'], ['mining', '矿山']]) {
    await p.goto(`http://localhost:3458/sectors/${id}`, { waitUntil: 'networkidle', timeout: 30000 });
    await p.waitForTimeout(3000);
    await p.screenshot({ path: out + `/02-sector-${name}.png` });
    console.log(`02 sector ${name}`);
  }

  // Stock detail
  await p.goto('http://localhost:3458/stocks/300308', { waitUntil: 'networkidle', timeout: 30000 });
  await p.waitForTimeout(3000);
  await p.screenshot({ path: out + '/03-stock-detail.png' });
  console.log('03 stock detail');
  await ctx.close();

  // Mobile screenshots
  const mCtx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true });
  const mp = await mCtx.newPage();
  await mp.goto('http://localhost:3458/mobile', { waitUntil: 'networkidle', timeout: 30000 });
  await mp.waitForTimeout(4000);
  await mp.screenshot({ path: out + '/04-mobile-home.png' });
  console.log('04 mobile home');

  await mp.goto('http://localhost:3458/mobile/sectors/optical-communication', { waitUntil: 'networkidle', timeout: 30000 });
  await mp.waitForTimeout(3000);
  await mp.screenshot({ path: out + '/05-mobile-sector.png' });
  console.log('05 mobile sector');

  await mp.goto('http://localhost:3458/mobile/trade/300308', { waitUntil: 'networkidle', timeout: 30000 });
  await mp.waitForTimeout(3000);
  await mp.screenshot({ path: out + '/06-mobile-trade.png' });
  console.log('06 mobile trade');
  await mCtx.close();

  // Video: hover 10 cards + navigate
  const vCtx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    recordVideo: { dir: out, size: { width: 1440, height: 900 } }
  });
  const vp = await vCtx.newPage();
  await vp.goto('http://localhost:3458/', { waitUntil: 'networkidle', timeout: 30000 });
  await vp.waitForTimeout(3000);

  const sectors = ['光通信', '算力', '半导体', '新能源', '机器人', '低空经济', '白酒', '矿山', '军工', '医药'];
  for (const name of sectors) {
    const el = await vp.locator(`text=${name}`).first();
    if (await el.isVisible()) {
      await el.scrollIntoViewIfNeeded();
      await vp.waitForTimeout(300);
      const parent = await el.locator('xpath=ancestor::div[contains(@class,"group")]').first();
      try { await parent.hover(); } catch { await el.hover(); }
      await vp.waitForTimeout(2500);
      console.log('hover ' + name);
    }
  }

  // Click optical → sector detail
  const opt = await vp.locator('[data-demo-highlight="optical-communication"]').first();
  if (await opt.isVisible()) {
    await opt.click();
    await vp.waitForTimeout(4000);
    console.log('navigated to optical detail');
  }

  // Click stock
  const stock = await vp.locator('text=中际旭创').first();
  if (await stock.isVisible()) {
    await stock.click();
    await vp.waitForTimeout(4000);
    console.log('navigated to stock detail');
  }

  // Open trade panel
  const buyBtn = await vp.locator('text=买入').first();
  if (await buyBtn.isVisible()) {
    await buyBtn.click();
    await vp.waitForTimeout(3000);
    console.log('trade panel opened');
  }

  const videoPath = await vp.video().path();
  await vCtx.close();
  fs.copyFileSync(videoPath, out + '/p2d-demo.webm');
  console.log('video saved');

  await browser.close();
  console.log('done');
})();
