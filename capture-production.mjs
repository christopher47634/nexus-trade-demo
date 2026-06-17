import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, 'final-delivery/p2-d-final-qa');

const BASE = 'https://stock-trading-demo.vercel.app';

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function takeScreenshots() {
  console.log('=== Taking 12 production screenshots ===');
  const browser = await chromium.launch({ headless: true });

  // Desktop screenshots (1-9)
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();

  // 1. Homepage full page
  console.log('1/12 01-desktop-home.png');
  await page.goto(BASE, { waitUntil: 'networkidle', timeout: 60000 });
  await sleep(5000);
  await page.screenshot({ path: path.join(OUT, '01-desktop-home.png'), fullPage: true });

  // 2. HotSectorGrid area (scroll to it)
  console.log('2/12 02-sectors-area.png');
  // Try to find and scroll to sector cards
  const sectorEl = await page.$('[class*="sector"], [class*="Sector"], [class*="hot"], [class*="Hot"], [class*="grid"], [class*="Grid"]');
  if (sectorEl) {
    await sectorEl.scrollIntoViewIfNeeded();
    await sleep(2000);
  } else {
    // Scroll down to find sector cards
    await page.evaluate(() => window.scrollBy(0, 600));
    await sleep(2000);
  }
  await page.screenshot({ path: path.join(OUT, '02-sectors-area.png'), fullPage: false });

  // Helper to hover a sector card by text
  async function hoverSector(text, filename, num) {
    console.log(`${num}/12 ${filename}`);
    try {
      // Try multiple selectors
      const el = await page.locator(`text=${text}`).first();
      await el.scrollIntoViewIfNeeded();
      await sleep(500);
      await el.hover();
      await sleep(2000);
      await page.screenshot({ path: path.join(OUT, filename), fullPage: false });
    } catch (e) {
      console.log(`  Warning hovering "${text}": ${e.message}`);
      await page.screenshot({ path: path.join(OUT, filename), fullPage: false });
    }
  }

  // 3-7. Hover sector cards
  await hoverSector('光通信', '03-hover-optical.png', 3);
  await hoverSector('算力', '04-hover-compute.png', 4);
  await hoverSector('矿山', '05-hover-mining.png', 5);
  await hoverSector('机器人', '06-hover-robot.png', 6);
  await hoverSector('白酒', '07-hover-baijiu.png', 7);

  // 8. Sector hero - optical
  console.log('8/12 08-sector-hero-optical.png');
  await page.goto(BASE + '/sectors/optical-communication', { waitUntil: 'networkidle', timeout: 60000 });
  await sleep(5000);
  await page.screenshot({ path: path.join(OUT, '08-sector-hero-optical.png'), fullPage: false });

  // 9. Sector hero - mining
  console.log('9/12 09-sector-hero-mining.png');
  await page.goto(BASE + '/sectors/mining', { waitUntil: 'networkidle', timeout: 60000 });
  await sleep(5000);
  await page.screenshot({ path: path.join(OUT, '09-sector-hero-mining.png'), fullPage: false });

  await ctx.close();

  // 10-12. Mobile screenshots
  const mobileCtx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1'
  });
  const mPage = await mobileCtx.newPage();

  // 10. Mobile home
  console.log('10/12 10-mobile-home.png');
  await mPage.goto(BASE + '/mobile', { waitUntil: 'networkidle', timeout: 60000 });
  await sleep(5000);
  await mPage.screenshot({ path: path.join(OUT, '10-mobile-home.png'), fullPage: true });

  // 11. Mobile sector
  console.log('11/12 11-mobile-sector.png');
  await mPage.goto(BASE + '/mobile/sectors/optical-communication', { waitUntil: 'networkidle', timeout: 60000 });
  await sleep(5000);
  await mPage.screenshot({ path: path.join(OUT, '11-mobile-sector.png'), fullPage: true });

  // 12. Mobile trade
  console.log('12/12 12-mobile-trade.png');
  await mPage.goto(BASE + '/mobile/trade/300308', { waitUntil: 'networkidle', timeout: 60000 });
  await sleep(5000);
  await mPage.screenshot({ path: path.join(OUT, '12-mobile-trade.png'), fullPage: true });

  await mobileCtx.close();
  await browser.close();
  console.log('=== All 12 screenshots done ===');
}

async function recordVideos() {
  console.log('=== Recording 3 demo videos ===');

  // Video 1: desktop-production-home
  console.log('Video 1/3: desktop-production-home');
  {
    const browser = await chromium.launch({ headless: true });
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    const videoDir = path.join(OUT, 'video1-raw');
    await ctx.route('**/*', route => route.continue());
    // We'll record via page video
    // Actually let's use a simpler approach - record using page.video API
    // But that needs a persistent context. Let me restructure.
    await page.close();
    await ctx.close();
    await browser.close();
  }

  // Use persistent context for video recording
  const sectors = ['光通信', '算力', '半导体', '新能源', '机器人', '低空经济', '白酒', '矿山', '军工', '医药'];

  // Video 1
  {
    console.log('Recording Video 1: desktop-production-home.webm');
    const browser = await chromium.launch({ headless: true });
    const ctx = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      recordVideo: { dir: path.join(OUT, 'tmp-video1'), size: { width: 1440, height: 900 } }
    });
    const page = await ctx.newPage();
    await page.goto(BASE, { waitUntil: 'networkidle', timeout: 60000 });
    await sleep(3000);

    for (const sector of sectors) {
      try {
        const el = page.locator(`text=${sector}`).first();
        await el.scrollIntoViewIfNeeded();
        await sleep(500);
        await el.hover();
        await sleep(2500);
      } catch (e) {
        console.log(`  Video1 hover "${sector}": ${e.message}`);
        await sleep(1000);
      }
    }
    await sleep(1000);
    await page.close();
    await ctx.close();
    await browser.close();
  }

  // Video 2: desktop-production-flow
  console.log('Recording Video 2: desktop-production-flow.webm');
  {
    const browser = await chromium.launch({ headless: true });
    const ctx = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      recordVideo: { dir: path.join(OUT, 'tmp-video2'), size: { width: 1440, height: 900 } }
    });
    const page = await ctx.newPage();
    await page.goto(BASE, { waitUntil: 'networkidle', timeout: 60000 });
    await sleep(3000);

    // Click 光通信
    try {
      await page.locator('text=光通信').first().click();
      await sleep(3000);
    } catch (e) { console.log(`  V2 click 光通信: ${e.message}`); }

    // Click 中际旭创
    try {
      await page.locator('text=中际旭创').first().click();
      await sleep(3000);
    } catch (e) { console.log(`  V2 click 中际旭创: ${e.message}`); }

    // Click 买入
    try {
      await page.locator('text=买入').first().click();
      await sleep(2000);
    } catch (e) { console.log(`  V2 click 买入: ${e.message}`); }

    // Enter amount and price
    try {
      const inputs = await page.$$('input');
      if (inputs.length >= 2) {
        await inputs[0].fill('100');
        await inputs[1].fill('68.50');
      } else {
        // Try by placeholder
        await page.fill('input[placeholder*="数量"], input[type="number"]', '100');
        await page.fill('input[placeholder*="价格"]', '68.50');
      }
      await sleep(500);
      await page.locator('text=确认买入').first().click();
      await sleep(3000);
    } catch (e) { console.log(`  V2 fill form: ${e.message}`); }

    await page.close();
    await ctx.close();
    await browser.close();
  }

  // Video 3: mobile-production-flow
  console.log('Recording Video 3: mobile-production-flow.webm');
  {
    const browser = await chromium.launch({ headless: true });
    const ctx = await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
      recordVideo: { dir: path.join(OUT, 'tmp-video3'), size: { width: 390, height: 844 } }
    });
    const page = await ctx.newPage();
    await page.goto(BASE + '/mobile', { waitUntil: 'networkidle', timeout: 60000 });
    await sleep(3000);

    // Click 光通信
    try {
      await page.locator('text=光通信').first().click();
      await sleep(3000);
    } catch (e) { console.log(`  V3 click 光通信: ${e.message}`); }

    // Click 中际旭创
    try {
      await page.locator('text=中际旭创').first().click();
      await sleep(3000);
    } catch (e) { console.log(`  V3 click 中际旭创: ${e.message}`); }

    // Click 买入
    try {
      await page.locator('text=买入').first().click();
      await sleep(2000);
    } catch (e) { console.log(`  V3 click 买入: ${e.message}`); }

    // Enter amount and price
    try {
      const inputs = await page.$$('input');
      if (inputs.length >= 2) {
        await inputs[0].fill('100');
        await inputs[1].fill('68.50');
      } else {
        await page.fill('input[placeholder*="数量"], input[type="number"]', '100');
        await page.fill('input[placeholder*="价格"]', '68.50');
      }
      await sleep(500);
      await page.locator('text=确认买入').first().click();
      await sleep(3000);
    } catch (e) { console.log(`  V3 fill form: ${e.message}`); }

    await page.close();
    await ctx.close();
    await browser.close();
  }

  console.log('=== All 3 videos recorded ===');
}

async function convertVideos() {
  console.log('=== Converting webm to mp4 ===');
  const { execSync } = await import('child_process');

  for (let i = 1; i <= 3; i++) {
    const tmpDir = path.join(OUT, `tmp-video${i}`);
    // Find the webm file
    try {
      const files = execSync(`ls ${tmpDir}/*.webm 2>/dev/null`).toString().trim();
      if (files) {
        const webmFile = files.split('\n')[0];
        const names = ['desktop-production-home', 'desktop-production-flow', 'mobile-production-flow'];
        const mp4Out = path.join(OUT, `${names[i-1]}.mp4`);
        console.log(`Converting: ${webmFile} -> ${mp4Out}`);
        execSync(`ffmpeg -y -i "${webmFile}" -c:v libx264 -pix_fmt yuv420p "${mp4Out}"`, { stdio: 'inherit' });
      } else {
        console.log(`No webm found in ${tmpDir}`);
      }
    } catch (e) {
      console.log(`Video ${i} conversion issue: ${e.message}`);
    }
  }
  console.log('=== Video conversion done ===');
}

async function main() {
  await takeScreenshots();
  await recordVideos();
  await convertVideos();

  // Clean up tmp dirs
  const { execSync } = await import('child_process');
  for (let i = 1; i <= 3; i++) {
    try { execSync(`rm -rf ${path.join(OUT, `tmp-video${i}`)}`); } catch {}
  }

  // List final files
  console.log('\n=== Final output files ===');
  const files = execSync(`ls -la ${OUT}/`).toString();
  console.log(files);
}

main().catch(e => { console.error(e); process.exit(1); });
