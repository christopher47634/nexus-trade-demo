const { chromium } = require('playwright');
const fs = require('fs');
const out = '/tmp/p2c-polish';
fs.mkdirSync(out, { recursive: true });

(async () => {
  const browser = await chromium.launch({
    headless: true, executablePath: '/usr/bin/chromium-browser',
    args: ['--no-sandbox', '--disable-gpu']
  });

  // Screenshot context
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  await p.goto('http://localhost:3458/visual-lab', { waitUntil: 'networkidle', timeout: 30000 });
  await p.waitForTimeout(5000);

  // Full page
  await p.screenshot({ path: out + '/01-identity-wall.png' });
  console.log('01 full page');

  // Individual cards
  const sectorNames = ['光通信', '算力', '半导体', '新能源', '机器人', '低空经济', '白酒', '矿山', '军工', '医药'];
  for (let i = 0; i < sectorNames.length; i++) {
    const el = await p.locator(`text=${sectorNames[i]}`).first();
    if (await el.isVisible()) {
      await el.scrollIntoViewIfNeeded();
      await p.waitForTimeout(1500);
      const parent = await el.locator('xpath=ancestor::div[contains(@class,"group")]').first();
      try { await parent.screenshot({ path: out + `/card-${String(i+1).padStart(2,'0')}.png` }); }
      catch { await el.screenshot({ path: out + `/card-${String(i+1).padStart(2,'0')}.png` }); }
      console.log(`card ${i+1} ${sectorNames[i]}`);
    }
  }
  await ctx.close();

  // Video context
  const ctx2 = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    recordVideo: { dir: out, size: { width: 1440, height: 900 } }
  });
  const p2 = await ctx2.newPage();
  await p2.goto('http://localhost:3458/visual-lab', { waitUntil: 'networkidle', timeout: 30000 });
  await p2.waitForTimeout(3000);

  // Hover sequence: 矿山 → 机器人 → 算力 → 半导体 → 新能源
  const targets = ['矿山', '机器人', '算力', '半导体', '新能源'];
  for (const name of targets) {
    const el = await p2.locator(`text=${name}`).first();
    if (await el.isVisible()) {
      await el.scrollIntoViewIfNeeded();
      await p2.waitForTimeout(500);
      const parent = await el.locator('xpath=ancestor::div[contains(@class,"group")]').first();
      try { await parent.hover(); } catch { await el.hover(); }
      await p2.waitForTimeout(4000);
      console.log('hovered ' + name);
    }
  }

  // Save video
  const videoPath = await p2.video().path();
  await ctx2.close();
  fs.copyFileSync(videoPath, out + '/motion-visibility-demo.webm');
  console.log('video saved');

  await browser.close();
  console.log('done');
})();
