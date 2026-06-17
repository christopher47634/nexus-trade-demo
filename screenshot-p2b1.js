const { chromium } = require('playwright');
const fs = require('fs');
const out = '/tmp/p2b1-screenshots';
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
    try { await p.goto(url, { waitUntil: 'networkidle', timeout: 30000 }); await p.waitForTimeout(3000); }
    catch (e) { console.log('  WARN: ' + e.message.substring(0, 60)); }
  }

  // 1. Full page CSS mode
  await go('http://localhost:3458/visual-lab', '01 visual-lab full page');
  await p.screenshot({ path: out + '/01-visual-lab-full.png' });

  // 2-4. Individual CSS cards (scroll to each)
  const cards = await p.$$('[data-sector]');
  for (let i = 0; i < cards.length && i < 3; i++) {
    await cards[i].scrollIntoViewIfNeeded();
    await p.waitForTimeout(500);
    await cards[i].screenshot({ path: out + `/0${i+2}-card-css-${['optical','compute','semi'][i]}.png` });
    console.log(`0${i+2} card CSS ${['optical','compute','semi'][i]}`);
  }

  // 5. Switch to Canvas mode
  const canvasToggle = await p.$('button:has-text("Canvas")');
  if (canvasToggle) { await canvasToggle.click(); await p.waitForTimeout(2000); }
  await p.screenshot({ path: out + '/05-visual-lab-canvas.png' });
  console.log('05 canvas mode');

  // 6-8. Individual Canvas cards
  const cards2 = await p.$$('[data-sector]');
  for (let i = 0; i < cards2.length && i < 3; i++) {
    await cards2[i].scrollIntoViewIfNeeded();
    await p.waitForTimeout(1000);
    await cards2[i].screenshot({ path: out + `/0${i+6}-card-canvas-${['optical','compute','semi'][i]}.png` });
    console.log(`0${i+6} card canvas ${['optical','compute','semi'][i]}`);
  }

  // 9. Hover state
  const firstCard = cards2[0];
  if (firstCard) {
    await firstCard.hover();
    await p.waitForTimeout(1000);
    await firstCard.screenshot({ path: out + '/09-hover-state.png' });
    console.log('09 hover state');
  }

  // 10. Animations off
  const animToggle = await p.$('button:has-text("动画")');
  if (animToggle) { await animToggle.click(); await p.waitForTimeout(1000); }
  await p.screenshot({ path: out + '/10-animations-off.png' });
  console.log('10 animations off');

  // FPS visible
  const fps = await p.$('[class*="fps"], [class*="Fps"], :text("FPS")');
  if (fps) {
    const box = await fps.boundingBox();
    if (box) {
      const clip = { x: Math.max(0, box.x - 20), y: Math.max(0, box.y - 10), width: box.width + 40, height: box.height + 20 };
      await p.screenshot({ path: out + '/11-fps-meter.png', clip });
      console.log('11 fps meter');
    }
  }

  // Verify main page still works
  await go('http://localhost:3458/', 'verify main page');
  await p.screenshot({ path: out + '/12-main-page-unchanged.png' });
  console.log('12 main page unchanged');

  await browser.close();
  console.log('\n=== P2-B1 screenshots done ===');
})();
