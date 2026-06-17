const { chromium } = require('playwright');
const fs = require('fs');
const out = '/tmp/p2b2-screenshots';
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

  // 1. Homepage - hot sectors area
  await go('http://localhost:3458/', '01 homepage');
  await p.screenshot({ path: out + '/01-homepage-sectors.png' });

  // 2. Hover on optical card
  const opticalCard = await p.locator('[data-demo-highlight="optical-communication"]').first();
  if (await opticalCard.isVisible()) {
    await opticalCard.hover();
    await p.waitForTimeout(1000);
    await p.screenshot({ path: out + '/02-optical-hover.png' });
    console.log('02 optical hover');
  }

  // 3. Hover on compute card
  const cards = await p.$$('.group');
  let computeCard = null;
  for (const card of cards) {
    const text = await card.textContent();
    if (text && text.includes('算力')) { computeCard = card; break; }
  }
  if (computeCard) {
    await computeCard.hover();
    await p.waitForTimeout(1000);
    await p.screenshot({ path: out + '/03-compute-hover.png' });
    console.log('03 compute hover');
  }

  // 4. Click optical card - should show shared layout transition
  if (await opticalCard.isVisible()) {
    await opticalCard.click();
    await p.waitForTimeout(2000);
    await p.screenshot({ path: out + '/04-sector-detail-transition.png' });
    console.log('04 sector detail (after transition)');
  }

  // 5. Back to homepage
  await go('http://localhost:3458/', '05 back home');

  // 6. FPS observation
  await p.waitForTimeout(2000);
  await p.screenshot({ path: out + '/06-homepage-final.png' });
  console.log('06 homepage final');

  // 7. Verify Demo Mode still works
  const demoBtn = await p.$('button:has(svg.lucide-sparkles)');
  if (demoBtn) { await demoBtn.click(); await p.waitForTimeout(1000); }
  await p.screenshot({ path: out + '/07-demo-modal.png' });
  console.log('07 demo modal');

  await browser.close();
  console.log('\n=== P2-B2 screenshots done ===');
})();
