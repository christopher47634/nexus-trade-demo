const { chromium } = require('playwright');
const fs = require('fs');
const out = '/tmp/p2c-fix';
fs.mkdirSync(out, { recursive: true });

(async () => {
  const browser = await chromium.launch({
    headless: true, executablePath: '/usr/bin/chromium-browser',
    args: ['--no-sandbox', '--disable-gpu']
  });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  await p.goto('http://localhost:3458/visual-lab', { waitUntil: 'networkidle', timeout: 30000 });
  await p.waitForTimeout(5000);

  // Find and screenshot robotics card
  const robotEl = await p.locator('text=机器人').first();
  if (await robotEl.isVisible()) {
    await robotEl.scrollIntoViewIfNeeded();
    await p.waitForTimeout(1000);
    const robotCard = await robotEl.locator('xpath=ancestor::div[contains(@class,"group")]').first();
    try { await robotCard.screenshot({ path: out + '/robot-static.png' }); } catch {}
    await robotCard.hover();
    await p.waitForTimeout(1500);
    try { await robotCard.screenshot({ path: out + '/robot-hover.png' }); } catch {}
    console.log('robot done');
  }

  // Find and screenshot baijiu card
  const baijiuEl = await p.locator('text=白酒').first();
  if (await baijiuEl.isVisible()) {
    await baijiuEl.scrollIntoViewIfNeeded();
    await p.waitForTimeout(1000);
    const baijiuCard = await baijiuEl.locator('xpath=ancestor::div[contains(@class,"group")]').first();
    try { await baijiuCard.screenshot({ path: out + '/baijiu-static.png' }); } catch {}
    await baijiuCard.hover();
    await p.waitForTimeout(1500);
    try { await baijiuCard.screenshot({ path: out + '/baijiu-hover.png' }); } catch {}
    console.log('baijiu done');
  }

  await browser.close();
  console.log('done');
})();
