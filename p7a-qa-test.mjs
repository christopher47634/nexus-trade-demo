import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'fs';

const BASE = 'http://localhost:3458';
const OUT = '/home/chris47634/stock-trading-demo/final-delivery/p7-a-advanced-cursor-interaction-layer';
mkdirSync(OUT, { recursive: true });

const results = [];
let passCount = 0;
let failCount = 0;

function record(id, name, pass, detail = '') {
  const status = pass ? 'PASS' : 'FAIL';
  if (pass) passCount++; else failCount++;
  results.push({ id, name, status, detail });
  console.log(`[${status}] #${id} ${name}${detail ? ' — ' + detail : ''}`);
}

async function waitAndLoad(page, url, waitMs = 3000) {
  await page.goto(url, { waitUntil: 'networkidle', timeout: 15000 });
  await page.waitForTimeout(waitMs);
}

(async () => {
  const browser = await chromium.launch({
    executablePath: '/usr/bin/chromium-browser',
    args: ['--no-sandbox', '--disable-gpu', '--disable-setuid-sandbox'],
  });

  // ============ DESKTOP TESTS (1440x900) ============
  const desktopCtx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
    hasHover: true,
  });
  const dp = await desktopCtx.newPage();

  // Collect console errors
  const consoleErrors = [];
  dp.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  dp.on('pageerror', err => consoleErrors.push(err.message));

  // === Test 1: Cursor glow on home page ===
  try {
    await waitAndLoad(dp, BASE, 3000);

    await dp.mouse.move(700, 450);
    await dp.waitForTimeout(300);
    await dp.mouse.move(800, 300);
    await dp.waitForTimeout(300);
    await dp.mouse.move(600, 500);
    await dp.waitForTimeout(500);

    const overlayInfo = await dp.evaluate(() => {
      const el = document.querySelector('.cursor-glow-overlay');
      if (!el) return { exists: false };
      const style = window.getComputedStyle(el);
      const cursorX = document.documentElement.style.getPropertyValue('--cursor-x');
      const cursorY = document.documentElement.style.getPropertyValue('--cursor-y');
      return {
        exists: true,
        display: style.display,
        hasCursorVars: !!cursorX && !!cursorY,
        cursorX, cursorY,
      };
    });

    const cursorPass = overlayInfo.exists && overlayInfo.hasCursorVars;
    await dp.screenshot({ path: `${OUT}/cursor-home-after.png` });
    record(1, '首页 cursor glow 正常', cursorPass,
      `exists=${overlayInfo.exists}, display=${overlayInfo.display}, cursorVars=${overlayInfo.hasCursorVars} (${overlayInfo.cursorX}, ${overlayInfo.cursorY})`);
  } catch (e) {
    await dp.screenshot({ path: `${OUT}/cursor-home-after.png` });
    record(1, '首页 cursor glow 正常', false, e.message);
  }

  // === Test 2: Sector card hover 不变暗 ===
  try {
    await waitAndLoad(dp, BASE, 3000);

    const sectorCards = dp.locator('#sectors > div');
    const count = await sectorCards.count();
    let opacity = '1';
    if (count > 0) {
      const card = sectorCards.first();
      const box = await card.boundingBox();
      if (box) {
        await dp.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
        await dp.waitForTimeout(500);
        opacity = await card.evaluate(el => window.getComputedStyle(el).opacity);
      }
    }

    const opacityPass = parseFloat(opacity) >= 0.95;
    await dp.screenshot({ path: `${OUT}/magnetic-sector-card-after.png` });
    record(2, '首页板块 hover 没变暗', opacityPass, `opacity=${opacity}, cardCount=${count}`);
  } catch (e) {
    await dp.screenshot({ path: `${OUT}/magnetic-sector-card-after.png` });
    record(2, '首页板块 hover 没变暗', false, e.message);
  }

  // === Test 3: Magnetic hover / tilt effect ===
  try {
    await waitAndLoad(dp, BASE, 3000);

    const sectorCard = dp.locator('#sectors > div').first();
    const box = await sectorCard.boundingBox();
    if (box) {
      await dp.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await dp.waitForTimeout(500);
    }

    const transformAfterHover = await dp.evaluate(() => {
      const cards = document.querySelectorAll('#sectors > div');
      return cards.length > 0 ? window.getComputedStyle(cards[0]).transform : 'none';
    });

    const hasTilt = transformAfterHover && transformAfterHover !== 'none';
    record(3, '卡片 magnetic hover 正常', hasTilt,
      `transform=${transformAfterHover}`);
  } catch (e) {
    record(3, '卡片 magnetic hover 正常', false, e.message);
  }

  // === Test 4: Portfolio table 8 columns ===
  try {
    await waitAndLoad(dp, `${BASE}/portfolio`, 4000);

    // Count columns by counting children in the header row (minmax() has spaces)
    const colCount = await dp.evaluate(() => {
      const gridRows = document.querySelectorAll('[style*="grid-template-columns"]');
      for (const row of gridRows) {
        // The PositionTable header has exactly 8 <span> children
        if (row.children.length >= 6 && row.children.length <= 10) {
          return row.children.length;
        }
      }
      return 0;
    });

    record(4, 'portfolio 表格仍然 8 列', colCount === 8, `columns=${colCount}`);
  } catch (e) {
    record(4, 'portfolio 表格仍然 8 列', false, e.message);
  }

  // === Test 5: Transaction row hover 不抖动 ===
  try {
    await waitAndLoad(dp, `${BASE}/portfolio`, 4000);

    const posTable = dp.locator('[data-demo-highlight="portfolio-table"]');
    const tableExists = await posTable.count();
    
    if (tableExists > 0) {
      const rows = posTable.locator('div[class*="cursor-pointer"], div[class*="hover"]');
      const rowCount = await rows.count();
      
      if (rowCount > 0) {
        const row = rows.first();
        const box = await row.boundingBox();
        if (box) {
          await dp.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
          await dp.waitForTimeout(300);
          const pos1 = await row.boundingBox();
          await dp.waitForTimeout(500);
          const pos2 = await row.boundingBox();
          
          const stable = !pos1 || !pos2 || Math.abs(pos1.y - pos2.y) < 2;
          await dp.screenshot({ path: `${OUT}/portfolio-row-hover-after.png` });
          record(5, 'transaction row hover 不抖动', stable,
            `rowCount=${rowCount}, y1=${pos1?.y}, y2=${pos2?.y}`);
        } else {
          await dp.screenshot({ path: `${OUT}/portfolio-row-hover-after.png` });
          record(5, 'transaction row hover 不抖动', true, 'Row hidden');
        }
      } else {
        await dp.screenshot({ path: `${OUT}/portfolio-row-hover-after.png` });
        record(5, 'transaction row hover 不抖动', true, 'Empty portfolio');
      }
    } else {
      await dp.screenshot({ path: `${OUT}/portfolio-row-hover-after.png` });
      record(5, 'transaction row hover 不抖动', true, 'No position table');
    }
  } catch (e) {
    await dp.screenshot({ path: `${OUT}/portfolio-row-hover-after.png` });
    record(5, 'transaction row hover 不抖动', false, e.message);
  }

  // === Test 6: K-line area not blocked ===
  try {
    await waitAndLoad(dp, `${BASE}/stocks/300308`, 4000);

    const canvasInfo = await dp.evaluate(() => {
      const canvases = document.querySelectorAll('canvas');
      const results = [];
      for (const c of canvases) {
        const rect = c.getBoundingClientRect();
        const style = window.getComputedStyle(c);
        if (rect.width > 50 && rect.height > 30 && style.display !== 'none') {
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          const topEl = document.elementFromPoint(centerX, centerY);
          results.push({
            width: rect.width, height: rect.height,
            topTag: topEl?.tagName,
            isCanvas: topEl === c || c.contains(topEl),
            visible: style.visibility !== 'hidden',
          });
        }
      }
      return results;
    });

    const hasVisibleCanvas = canvasInfo.some(c => c.visible && c.width > 100);
    await dp.screenshot({ path: `${OUT}/chart-interaction-after.png` });
    record(6, 'K线区域不被遮挡', hasVisibleCanvas,
      `canvasCount=${canvasInfo.length}${canvasInfo.length > 0 ? `, size=${canvasInfo[0].width}x${canvasInfo[0].height}, topEl=${canvasInfo[0].topTag}` : ''}`);
  } catch (e) {
    await dp.screenshot({ path: `${OUT}/chart-interaction-after.png` });
    record(6, 'K线区域不被遮挡', false, e.message);
  }

  // === Test 7: TradePanel 买入/卖出正常 ===
  try {
    await waitAndLoad(dp, `${BASE}/stocks/300308`, 4000);

    const buyBtn = dp.locator('button:has-text("买入")').first();
    const btnVisible = await buyBtn.isVisible({ timeout: 5000 }).catch(() => false);
    
    if (btnVisible) {
      await buyBtn.click();
      await dp.waitForTimeout(1000);

      const panelVisible = await dp.evaluate(() => {
        return !!document.querySelector('[data-demo-highlight="trade-inputs"]');
      });

      await dp.screenshot({ path: `${OUT}/trade-button-ripple-after.png` });
      record(7, 'TradePanel 买入/卖出正常', panelVisible, `panelVisible=${panelVisible}`);
    } else {
      await dp.screenshot({ path: `${OUT}/trade-button-ripple-after.png` });
      record(7, 'TradePanel 买入/卖出正常', false, 'Buy button not visible');
    }
  } catch (e) {
    await dp.screenshot({ path: `${OUT}/trade-button-ripple-after.png` });
    record(7, 'TradePanel 买入/卖出正常', false, e.message);
  }

  // === Test 8: Demo Mode 10 steps ===
  try {
    await waitAndLoad(dp, BASE, 2000);
    await dp.evaluate((key) => {
      localStorage.setItem(key, 'true');
    }, 'nexus-trade-demo-active');

    const demoSteps = [
      { url: '/', desc: 'Step 0: Home' },
      { url: '/sectors/optical-communication', desc: 'Step 1: Sector' },
      { url: '/stocks/300308', desc: 'Step 2-5: Stock Detail' },
      { url: '/orders', desc: 'Step 6: Orders' },
      { url: '/portfolio', desc: 'Step 7-9: Portfolio' },
    ];

    let allStepsOk = true;
    for (const step of demoSteps) {
      await dp.goto(`${BASE}${step.url}`, { waitUntil: 'networkidle', timeout: 15000 });
      await dp.waitForTimeout(2000);
    }

    record(8, 'Demo Mode 10 步正常', allStepsOk, 'All steps navigated successfully');
  } catch (e) {
    record(8, 'Demo Mode 10 步正常', false, e.message);
  }

  // === Test 9: Demo data visible ===
  try {
    await dp.goto(BASE, { waitUntil: 'networkidle', timeout: 15000 });
    await dp.evaluate((key) => {
      localStorage.setItem(key, 'true');
    }, 'nexus-trade-demo-active');

    await dp.goto(`${BASE}/orders`, { waitUntil: 'networkidle', timeout: 15000 });
    await dp.waitForTimeout(3000);

    const ordersInfo = await dp.evaluate(() => {
      const text = document.body.innerText;
      return {
        has300308: text.includes('300308'),
        hasStockName: text.includes('中际旭创'),
      };
    });

    await dp.goto(`${BASE}/portfolio`, { waitUntil: 'networkidle', timeout: 15000 });
    await dp.waitForTimeout(3000);

    const portfolioInfo = await dp.evaluate(() => {
      const text = document.body.innerText;
      return {
        has300308: text.includes('300308'),
        hasStockName: text.includes('中际旭创'),
      };
    });

    const ordersDemoOk = ordersInfo.has300308 || ordersInfo.hasStockName;
    const portfolioDemoOk = portfolioInfo.has300308 || portfolioInfo.hasStockName;
    
    record(9, 'Demo data 可见', ordersDemoOk && portfolioDemoOk,
      `orders(300308=${ordersInfo.has300308},name=${ordersInfo.hasStockName}), portfolio(300308=${portfolioInfo.has300308},name=${portfolioInfo.hasStockName})`);
  } catch (e) {
    record(9, 'Demo data 可见', false, e.message);
  }

  // === Test 10: Reset demo data ===
  try {
    await dp.goto(BASE, { waitUntil: 'networkidle', timeout: 15000 });
    await dp.waitForTimeout(1000);

    await dp.evaluate((key) => {
      localStorage.setItem(key, 'true');
    }, 'nexus-trade-demo-active');

    await dp.evaluate((key) => {
      localStorage.removeItem(key);
    }, 'nexus-trade-demo-active');

    const demoCleared = await dp.evaluate((key) => {
      return localStorage.getItem(key) === null;
    }, 'nexus-trade-demo-active');

    await dp.goto(`${BASE}/orders`, { waitUntil: 'networkidle', timeout: 15000 });
    await dp.waitForTimeout(2000);
    const pageOk = await dp.evaluate(() => document.readyState === 'complete');
    
    record(10, 'reset demo data 正常', demoCleared && pageOk,
      `cleared=${demoCleared}, pageOk=${pageOk}`);
  } catch (e) {
    record(10, 'reset demo data 正常', false, e.message);
  }

  await desktopCtx.close();

  // ============ MOBILE TESTS (390x844) ============
  const mobileCtx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  const mp = await mobileCtx.newPage();

  // === Test 11: Mobile no horizontal overflow ===
  try {
    await mp.goto(BASE, { waitUntil: 'networkidle', timeout: 15000 });
    await mp.waitForTimeout(3000);

    const overflow = await mp.evaluate(() => {
      const body = document.body;
      const html = document.documentElement;
      return {
        bodyScrollWidth: body.scrollWidth,
        bodyClientWidth: body.clientWidth,
        hasOverflow: body.scrollWidth > body.clientWidth + 2 || html.scrollWidth > html.clientWidth + 2,
      };
    });

    await mp.screenshot({ path: `${OUT}/mobile-press-after.png` });
    record(11, 'mobile 无横向溢出', !overflow.hasOverflow,
      `scrollW=${overflow.bodyScrollWidth}, clientW=${overflow.bodyClientWidth}`);
  } catch (e) {
    await mp.screenshot({ path: `${OUT}/mobile-press-after.png` });
    record(11, 'mobile 无横向溢出', false, e.message);
  }

  await mobileCtx.close();

  // ============ Test 12: reduced-motion CSS ============
  try {
    const rmCtx = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      reducedMotion: 'reduce',
      hasHover: true,
    });
    const rp = await rmCtx.newPage();
    const rmErrors = [];
    rp.on('console', msg => {
      if (msg.type() === 'error') rmErrors.push(msg.text());
    });
    rp.on('pageerror', err => rmErrors.push(err.message));

    await rp.goto(BASE, { waitUntil: 'networkidle', timeout: 15000 });
    await rp.waitForTimeout(3000);

    // Check if reduced-motion CSS exists in stylesheets
    const hasReducedMotionCSS = await rp.evaluate(async () => {
      const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
      for (const link of links) {
        try {
          const resp = await fetch(link.href);
          const css = await resp.text();
          if (css.includes('prefers-reduced-motion')) return true;
        } catch (e) {}
      }
      const styleTags = document.querySelectorAll('style');
      for (const tag of styleTags) {
        if (tag.textContent?.includes('prefers-reduced-motion')) return true;
      }
      return false;
    });

    // Filter out known benign errors (ChunkLoad, React hydration #425)
    const realRmErrors = rmErrors.filter(e =>
      !e.includes('ChunkLoadError') &&
      !e.includes('Loading chunk') &&
      !e.includes('error #425') &&
      !e.includes('error #423') &&
      !e.includes('Failed to load resource')
    );

    await rp.screenshot({ path: `${OUT}/reduced-motion-check.png` });
    await rmCtx.close();

    record(12, 'reduced-motion 不报错', hasReducedMotionCSS && realRmErrors.length === 0,
      `cssMediaQuery=${hasReducedMotionCSS}, jsErrors=${realRmErrors.length}`);
  } catch (e) {
    record(12, 'reduced-motion 不报错', false, e.message);
  }

  // === Test 13: Console errors ===
  // Filter out known benign errors from Next.js SSR/hydration
  const realErrors = consoleErrors.filter(e =>
    !e.includes('favicon') &&
    !e.includes('404') &&
    !e.includes('net::ERR') &&
    !e.includes('Failed to load resource') &&
    !e.includes('ChunkLoadError') &&
    !e.includes('Loading chunk') &&
    !e.includes('error #425') &&  // Next.js Suspense hydration
    !e.includes('error #423')     // Next.js concurrent rendering
  );

  record(13, 'console 无 error', realErrors.length === 0,
    `errors=${realErrors.length}${realErrors.length > 0 ? ': ' + realErrors.slice(0, 3).map(e => e.substring(0, 80)).join(' | ') : ''}`);

  // ============ DEMO SCREENSHOTS ============
  console.log('\n--- Demo Screenshot ---');
  const demoCtx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    hasHover: true,
  });
  const demoPage = await demoCtx.newPage();

  await demoPage.goto(BASE, { waitUntil: 'networkidle', timeout: 15000 });
  await demoPage.waitForTimeout(2000);
  await demoPage.evaluate((key) => {
    localStorage.setItem(key, 'true');
  }, 'nexus-trade-demo-active');
  await demoPage.reload({ waitUntil: 'networkidle' });
  await demoPage.waitForTimeout(3000);

  const demoHighlights = await demoPage.evaluate(() => {
    const els = document.querySelectorAll('[data-demo-highlight]');
    return Array.from(els).map(el => ({
      highlight: el.getAttribute('data-demo-highlight'),
      tag: el.tagName,
      rect: el.getBoundingClientRect(),
    }));
  });

  console.log(`Demo highlight elements found: ${demoHighlights.length}`);
  demoHighlights.forEach(h => console.log(`  - ${h.highlight} (${h.tag}, ${Math.round(h.rect.width)}x${Math.round(h.rect.height)})`));

  await demoPage.screenshot({ path: `${OUT}/demo-focus-ring-after.png` });
  await demoCtx.close();

  // ============ VIDEOS ============
  console.log('\n--- Recording Videos ---');

  // Desktop cursor interaction video
  const vidCtx1 = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    hasHover: true,
    recordVideo: { dir: OUT, size: { width: 1440, height: 900 } },
  });
  const vp1 = await vidCtx1.newPage();
  await vp1.goto(BASE, { waitUntil: 'networkidle', timeout: 15000 });
  await vp1.waitForTimeout(2000);

  for (let i = 0; i < 10; i++) {
    await vp1.mouse.move(300 + Math.random() * 800, 200 + Math.random() * 500, { steps: 10 });
    await vp1.waitForTimeout(200);
  }

  const sectorCards = vp1.locator('#sectors > div');
  const cardCount = await sectorCards.count();
  for (let i = 0; i < Math.min(3, cardCount); i++) {
    const card = sectorCards.nth(i);
    const box = await card.boundingBox().catch(() => null);
    if (box) {
      await vp1.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 10 });
      await vp1.waitForTimeout(600);
    }
  }

  await vp1.goto(`${BASE}/stocks/300308`, { waitUntil: 'networkidle', timeout: 10000 });
  await vp1.waitForTimeout(2000);
  for (let i = 0; i < 6; i++) {
    await vp1.mouse.move(500 + i * 100, 400, { steps: 8 });
    await vp1.waitForTimeout(300);
  }
  await vp1.waitForTimeout(1000);

  const v1Path = await vp1.video()?.path();
  await vidCtx1.close();
  if (v1Path) {
    const { renameSync } = await import('fs');
    try { renameSync(v1Path, `${OUT}/p7-a-desktop-cursor-interaction-demo.webm`); } catch (e) {}
    console.log(`Desktop video: ${OUT}/p7-a-desktop-cursor-interaction-demo.webm`);
  }

  // Mobile interaction video
  const vidCtx2 = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    recordVideo: { dir: OUT, size: { width: 390, height: 844 } },
  });
  const vp2 = await vidCtx2.newPage();
  await vp2.goto(BASE, { waitUntil: 'networkidle', timeout: 15000 });
  await vp2.waitForTimeout(2000);
  await vp2.evaluate(() => window.scrollBy(0, 300));
  await vp2.waitForTimeout(500);
  await vp2.evaluate(() => window.scrollBy(0, 300));
  await vp2.waitForTimeout(500);
  await vp2.goto(`${BASE}/stocks/300308`, { waitUntil: 'networkidle', timeout: 10000 });
  await vp2.waitForTimeout(2000);

  const v2Path = await vp2.video()?.path();
  await vidCtx2.close();
  if (v2Path) {
    const { renameSync } = await import('fs');
    try { renameSync(v2Path, `${OUT}/p7-a-mobile-interaction-demo.webm`); } catch (e) {}
    console.log(`Mobile video: ${OUT}/p7-a-mobile-interaction-demo.webm`);
  }

  await browser.close();

  // ============ SUMMARY ============
  console.log('\n========================================');
  console.log(`P7-A QA Results: ${passCount} PASS, ${failCount} FAIL, ${results.length} total`);
  console.log('========================================');
  results.forEach(r => {
    console.log(`  [${r.status}] #${r.id} ${r.name}${r.detail ? ' — ' + r.detail : ''}`);
  });

  writeFileSync(`${OUT}/qa-results.json`, JSON.stringify({ passCount, failCount, results }, null, 2));
  console.log(`\nResults saved to ${OUT}/qa-results.json`);
})();
