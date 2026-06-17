const { chromium } = require('playwright');
const fs = require('fs');
const out = '/tmp/p2b2-polish';
fs.mkdirSync(out, { recursive: true });

(async () => {
  const browser = await chromium.launch({
    headless: true, executablePath: '/usr/bin/chromium-browser',
    args: ['--no-sandbox', '--disable-gpu']
  });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  async function go(url, label) {
    console.log(label);
    try { await p.goto(url, { waitUntil: 'networkidle', timeout: 30000 }); await p.waitForTimeout(4000); }
    catch (e) { console.log('  WARN: ' + e.message.substring(0, 60)); }
  }

  await go('http://localhost:3458/', '01 homepage');

  // 1. Full homepage
  await p.screenshot({ path: out + '/01-homepage.png' });

  // 2. Hot sectors area
  const sectorArea = await p.locator('text=热门板块').first();
  if (await sectorArea.isVisible()) {
    const box = await sectorArea.boundingBox();
    if (box) {
      await p.screenshot({ path: out + '/02-sectors-area.png', clip: { x: 0, y: Math.max(0, box.y - 20), width: 1440, height: 500 } });
      console.log('02 sectors area');
    }
  }

  // 3. Optical static
  const opticalCard = await p.locator('[data-demo-highlight="optical-communication"]').first();
  if (await opticalCard.isVisible()) {
    await opticalCard.scrollIntoViewIfNeeded();
    await p.waitForTimeout(500);
    await opticalCard.screenshot({ path: out + '/03-optical-static.png' });
    console.log('03 optical static');
  }

  // 4. Optical hover
  if (await opticalCard.isVisible()) {
    await opticalCard.hover();
    await p.waitForTimeout(1500);
    await opticalCard.screenshot({ path: out + '/04-optical-hover.png' });
    console.log('04 optical hover');
  }

  // 5. Compute static
  const cards = await p.$$('.group');
  let computeCard = null;
  for (const card of cards) {
    const text = await card.textContent();
    if (text && text.includes('算力')) { computeCard = card; break; }
  }
  if (computeCard) {
    await computeCard.scrollIntoViewIfNeeded();
    await p.waitForTimeout(500);
    await computeCard.screenshot({ path: out + '/05-compute-static.png' });
    console.log('05 compute static');
  }

  // 6. Compute hover
  if (computeCard) {
    await computeCard.hover();
    await p.waitForTimeout(1500);
    await computeCard.screenshot({ path: out + '/06-compute-hover.png' });
    console.log('06 compute hover');
  }

  // 7. Video: hover optical → hover compute → click optical → detail page
  console.log('recording video...');
  await p.goto('http://localhost:3458/', { waitUntil: 'networkidle', timeout: 30000 });
  await p.waitForTimeout(3000);
  
  // Start recording
  const recorder = await p.video;
  // Actually use page.video properly
  await ctx.close();
  
  // New context with video recording
  const ctx2 = await browser.newContext({ viewport: { width: 1440, height: 900 }, recordVideo: { dir: out, size: { width: 1440, height: 900 } } });
  const p2 = await ctx2.newPage();
  await p2.goto('http://localhost:3458/', { waitUntil: 'networkidle', timeout: 30000 });
  await p2.waitForTimeout(3000);

  // Hover optical
  const opt = await p2.locator('[data-demo-highlight="optical-communication"]').first();
  if (await opt.isVisible()) {
    await opt.hover();
    await p2.waitForTimeout(3000);
  }

  // Hover compute
  const cards2 = await p2.$$('.group');
  let comp = null;
  for (const card of cards2) { const t = await card.textContent(); if (t && t.includes('算力')) { comp = card; break; } }
  if (comp) {
    await comp.hover();
    await p2.waitForTimeout(3000);
  }

  // Click optical → detail page
  if (await opt.isVisible()) {
    await opt.click();
    await p2.waitForTimeout(4000);
  }

  // Stop recording
  const videoPath = await p2.video.path();
  await ctx2.close();
  
  // Rename video
  const finalVideo = out + '/demo-hover-transition.webm';
  fs.copyFileSync(videoPath, finalVideo);
  console.log('video saved: ' + finalVideo);

  await browser.close();
  console.log('\n=== P2-B2-Polish done ===');
})();
