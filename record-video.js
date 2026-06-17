const { chromium } = require('playwright');
const fs = require('fs');
const out = '/tmp/p2b2-polish';
fs.mkdirSync(out, { recursive: true });

(async () => {
  const browser = await chromium.launch({
    headless: true, executablePath: '/usr/bin/chromium-browser',
    args: ['--no-sandbox', '--disable-gpu']
  });

  // Video recording context
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    recordVideo: { dir: out, size: { width: 1440, height: 900 } }
  });
  const p = await ctx.newPage();
  
  await p.goto('http://localhost:3458/', { waitUntil: 'networkidle', timeout: 30000 });
  await p.waitForTimeout(3000);
  console.log('home loaded');

  // Hover optical
  const opt = await p.locator('[data-demo-highlight="optical-communication"]').first();
  if (await opt.isVisible()) {
    await opt.hover();
    await p.waitForTimeout(4000);
    console.log('hovered optical');
  }

  // Hover compute
  const cards = await p.$$('.group');
  let comp = null;
  for (const card of cards) { const t = await card.textContent(); if (t && t.includes('算力')) { comp = card; break; } }
  if (comp) {
    await comp.hover();
    await p.waitForTimeout(4000);
    console.log('hovered compute');
  }

  // Click optical
  if (await opt.isVisible()) {
    await opt.click();
    await p.waitForTimeout(5000);
    console.log('navigated to detail');
  }

  // Save video
  const videoPath = await p.video.path();
  await ctx.close();
  const finalVideo = out + '/demo-hover-transition.webm';
  fs.copyFileSync(videoPath, finalVideo);
  console.log('video: ' + finalVideo + ' (' + (fs.statSync(finalVideo).size / 1024).toFixed(0) + 'KB)');

  await browser.close();
  console.log('done');
})();
