const { chromium } = require('playwright');
const fs = require('fs');
const out = '/tmp/p2c-identity';
fs.mkdirSync(out, { recursive: true });

(async () => {
  const browser = await chromium.launch({
    headless: true, executablePath: '/usr/bin/chromium-browser',
    args: ['--no-sandbox', '--disable-gpu']
  });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();

  await p.goto('http://localhost:3458/visual-lab', { waitUntil: 'networkidle', timeout: 30000 });
  await p.waitForTimeout(4000);
  console.log('loaded');

  // Full page
  await p.screenshot({ path: out + '/01-identity-wall-top.png' });
  console.log('01 top');

  // Scroll to see all cards
  await p.evaluate(() => window.scrollTo(0, 600));
  await p.waitForTimeout(1000);
  await p.screenshot({ path: out + '/02-identity-wall-middle.png' });
  console.log('02 middle');

  await p.evaluate(() => window.scrollTo(0, 1200));
  await p.waitForTimeout(1000);
  await p.screenshot({ path: out + '/03-identity-wall-bottom.png' });
  console.log('03 bottom');

  // Hover on first card
  await p.evaluate(() => window.scrollTo(0, 0));
  await p.waitForTimeout(500);
  const firstCard = await p.locator('.group').first();
  if (await firstCard.isVisible()) {
    await firstCard.hover();
    await p.waitForTimeout(1500);
    await firstCard.screenshot({ path: out + '/04-hover-optical.png' });
    console.log('04 hover optical');
  }

  // Individual cards (scroll to each)
  const sectorNames = ['光通信', '算力', '半导体', '新能源', '机器人', '低空经济', '白酒', '矿山', '军工', '医药'];
  for (let i = 0; i < sectorNames.length; i++) {
    const card = await p.locator(`text=${sectorNames[i]}`).first();
    if (await card.isVisible()) {
      await card.scrollIntoViewIfNeeded();
      await p.waitForTimeout(1000);
      const parent = await card.locator('xpath=ancestor::div[contains(@class,"group")]').first();
      try {
        await parent.screenshot({ path: out + `/card-${String(i+1).padStart(2,'0')}-${sectorNames[i]}.png` });
        console.log(`card ${i+1} ${sectorNames[i]}`);
      } catch {
        await card.screenshot({ path: out + `/card-${String(i+1).padStart(2,'0')}-${sectorNames[i]}.png` });
        console.log(`card ${i+1} ${sectorNames[i]} (fallback)`);
      }
    }
  }

  await browser.close();
  console.log('\n=== P2-C identity wall done ===');
})();
