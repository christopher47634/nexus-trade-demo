const { chromium } = require('playwright');
const fs = require('fs');
const out = '/tmp/p3b-screenshots';
fs.mkdirSync(out, { recursive: true });

(async () => {
  const browser = await chromium.launch({
    headless: true, executablePath: '/usr/bin/chromium-browser',
    args: ['--no-sandbox', '--disable-gpu']
  });

  // Video 1: hover glow inertia
  const v1Ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    recordVideo: { dir: out, size: { width: 1440, height: 900 } }
  });
  const v1 = await v1Ctx.newPage();
  await v1.goto('http://localhost:3458/', { waitUntil: 'networkidle', timeout: 30000 });
  await v1.waitForTimeout(3000);
  // Slow hover across cards
  const sectors = ['光通信', '算力', '半导体', '新能源', '机器人', '低空经济', '白酒', '矿山', '军工', '医药'];
  for (const name of sectors) {
    const el = await v1.locator(`text=${name}`).first();
    if (await el.isVisible()) {
      await el.scrollIntoViewIfNeeded();
      const parent = await el.locator('xpath=ancestor::div[contains(@class,"group")]').first();
      try { await parent.hover(); } catch {}
      await v1.waitForTimeout(2000);
      // Quick move to next card
      console.log('hover ' + name);
    }
  }
  const v1Path = await v1.video().path();
  await v1Ctx.close();
  fs.copyFileSync(v1Path, out + '/hover-glow-inertia.webm');
  console.log('video 1 done');

  // Screenshots: homepage + demo mode
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  await p.goto('http://localhost:3458/', { waitUntil: 'networkidle', timeout: 30000 });
  await p.waitForTimeout(3000);
  await p.screenshot({ path: out + '/01-homepage.png' });
  console.log('01 homepage');

  // Start demo mode
  const demoBtn = await p.locator('text=Demo').first();
  if (await demoBtn.isVisible()) {
    await demoBtn.click();
    await p.waitForTimeout(1500);
    await p.screenshot({ path: out + '/02-demo-step0.png' });
    console.log('02 demo step 0');
  }

  // Video 2: demo mode flow
  const v2Ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    recordVideo: { dir: out, size: { width: 1440, height: 900 } }
  });
  const v2 = await v2Ctx.newPage();
  await v2.goto('http://localhost:3458/', { waitUntil: 'networkidle', timeout: 30000 });
  await v2.waitForTimeout(2000);
  const demoBtn2 = await v2.locator('text=Demo').first();
  if (await demoBtn2.isVisible()) {
    await demoBtn2.click();
    await v2.waitForTimeout(2000);
    // Click through demo steps
    for (let i = 0; i < 7; i++) {
      const nextBtn = await v2.locator('text=下一步').first();
      if (await nextBtn.isVisible()) {
        await nextBtn.click();
        await v2.waitForTimeout(2000);
        console.log('demo step ' + (i+1));
      }
    }
  }
  const v2Path = await v2.video().path();
  await v2Ctx.close();
  fs.copyFileSync(v2Path, out + '/presentation-demo-mode.webm');
  console.log('video 2 done');

  // Video 3: mobile press
  const v3Ctx = await browser.newContext({
    viewport: { width: 390, height: 844 }, isMobile: true,
    recordVideo: { dir: out, size: { width: 390, height: 844 } }
  });
  const v3 = await v3Ctx.newPage();
  await v3.goto('http://localhost:3458/mobile', { waitUntil: 'networkidle', timeout: 30000 });
  await v3.waitForTimeout(3000);
  // Tap on sector cards
  for (const name of ['光通信', '算力', '半导体']) {
    const el = await v3.locator(`text=${name}`).first();
    if (await el.isVisible()) {
      await el.tap();
      await v3.waitForTimeout(1500);
      console.log('tap ' + name);
    }
  }
  const v3Path = await v3.video().path();
  await v3Ctx.close();
  fs.copyFileSync(v3Path, out + '/mobile-press-feedback.webm');
  console.log('video 3 done');

  await browser.close();
  console.log('all done');
})();
