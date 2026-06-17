const { chromium } = require('playwright');
const path = require('path');

const DIR = path.join(__dirname, 'final-delivery/p4-a-qa-gate/screenshots');
const URL = 'http://localhost:3458';
const delay = ms => new Promise(r => setTimeout(r, ms));

async function run() {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'zh-CN' });
  const page = await ctx.newPage();
  const R = {};

  try {
    // ============ TRADING FLOW ============
    
    // 1. Homepage
    console.log('1. Homepage');
    await page.goto(URL, { waitUntil: 'networkidle', timeout: 30000 });
    await delay(3000);
    await page.screenshot({ path: path.join(DIR, '01-homepage-desktop.png') });

    // 2. Click 光通信 sector (#2)
    console.log('2. Click 光通信 sector');
    const sectors = await page.$$('[id="sectors"] > div');
    await sectors[1].click();
    await delay(2500);
    await page.screenshot({ path: path.join(DIR, '03-sector-detail.png') });

    // 3. Verify sector detail
    const sc = await page.textContent('body');
    R.sector = {
      isOptical: sc.includes('光通信'),
      hasRisk: sc.includes('风险'),
      hasAnalysis: sc.includes('分析') || sc.includes('趋势'),
      hasChart: sc.includes('板块趋势'),
    };
    console.log('   Sector:', R.sector);

    // 4. Click 中际旭创
    console.log('4. Click 中际旭创');
    await page.click('text=中际旭创');
    await delay(2500);
    await page.screenshot({ path: path.join(DIR, '04-stock-detail.png') });

    // 5. Verify stock detail
    const stc = await page.textContent('body');
    R.stock = {
      hasName: stc.includes('中际旭创') || stc.includes('300308'),
      hasMA5: stc.includes('MA5'),
      hasMA10: stc.includes('MA10'),
      hasMA20: stc.includes('MA20'),
      hasAnalysis: stc.includes('分析') || stc.includes('研判'),
      hasBuyBtn: stc.includes('买入'),
      hasSellBtn: stc.includes('卖出'),
    };
    console.log('   Stock:', R.stock);

    // Check for risk warning
    const hasHighRisk = stc.includes('高风险') || stc.includes('风险提示') || stc.includes('ST');
    R.stock.hasRiskWarning = hasHighRisk;
    console.log(`   Risk warning (high risk stock): ${hasHighRisk}`);

    // 6. Click 买入 to open trade dialog
    console.log('6. Open trade dialog');
    await page.click('button:has-text("买入")');
    await delay(1500);
    await page.screenshot({ path: path.join(DIR, '05-trade-panel.png') });

    // Verify trade dialog content
    const dc = await page.textContent('body');
    R.tradeDialog = {
      hasStockName: dc.includes('中际旭创') || dc.includes('300308'),
      hasSimTag: dc.includes('模拟交易'),
      hasLimitOrder: dc.includes('限价委托'),
      hasMarketOrder: dc.includes('市价委托'),
      hasPriceInput: dc.includes('委托价格') || dc.includes('限价'),
      hasQtyInput: dc.includes('委托数量') || dc.includes('手'),
      hasCommission: dc.includes('佣金'),
      hasDisclaimer: dc.includes('模拟交易') && dc.includes('不构成投资建议'),
      hasAvailFunds: dc.includes('可用资金'),
      hasMaxBuy: dc.includes('最大可买'),
    };
    console.log('   Trade dialog:', R.tradeDialog);

    // Find and set quantity to 2 lots (200 shares)
    const qtyInputs = await page.$$('input');
    console.log(`   Found ${qtyInputs.length} input fields`);
    
    // The quantity input should be the second one (first is price)
    for (const input of qtyInputs) {
      const val = await input.inputValue();
      const type = await input.getAttribute('type');
      console.log(`   Input: type=${type}, value=${val}`);
    }

    // Set quantity to 2 (lots = 200 shares)
    if (qtyInputs.length >= 2) {
      await qtyInputs[1].click({ clickCount: 3 });
      await qtyInputs[1].fill('2');
      await delay(300);
      console.log('   Set quantity to 2 lots');
    }

    // Take updated trade panel screenshot
    await page.screenshot({ path: path.join(DIR, '05-trade-panel.png') });

    // 7. Click 确认买入
    console.log('7. Click 确认买入');
    const confirmBtn = await page.$('button:has-text("确认买入")');
    if (confirmBtn) {
      await confirmBtn.click();
      await delay(2000);
      console.log('   Order submitted!');
    } else {
      console.log('   确认买入 not found, trying alternatives...');
      const allBtns = await page.$$('button');
      for (const btn of allBtns) {
        const text = await btn.textContent();
        console.log(`   Button: "${text.trim()}"`);
      }
    }

    // 8. Navigate to orders
    console.log('8. Navigate to /orders');
    await page.goto(`${URL}/orders`, { waitUntil: 'networkidle', timeout: 30000 });
    await delay(2000);
    await page.screenshot({ path: path.join(DIR, '07-orders-page.png') });

    const oc = await page.textContent('body');
    R.orders = {
      hasOrders: !oc.includes('暂无委托订单') && !oc.includes('共0笔'),
      hasWTFormat: oc.includes('WT'),
      hasCommission: oc.includes('佣金') || oc.includes('手续费'),
      hasStatus: oc.includes('已委托') || oc.includes('待成交') || oc.includes('已成交'),
    };
    console.log('   Orders:', R.orders);

    // Check for order details if orders exist
    if (R.orders.hasOrders) {
      // Look for specific order elements
      const orderIdMatch = oc.match(/WT\d+/);
      R.orders.orderId = orderIdMatch ? orderIdMatch[0] : 'not found';
      console.log(`   Order ID: ${R.orders.orderId}`);
    }

    // 9. Risk warning screenshot - go back to stock and check for high-risk stocks
    console.log('9. Risk warning check');
    await page.goto(URL, { waitUntil: 'networkidle', timeout: 30000 });
    await delay(2000);
    // Click on a sector that might have high-risk stocks
    const secs = await page.$$('[id="sectors"] > div');
    // Try 军工 (#10) or 白酒 (#7) for high-risk stocks
    await secs[6].click(); // 白酒
    await delay(2000);
    const baijiuContent = await page.textContent('body');
    console.log(`   白酒 sector stocks available: ${baijiuContent.includes('贵州茅台')}`);
    
    // Check if there's a risk warning on any stock
    const hasHighRiskStock = baijiuContent.includes('高风险') || baijiuContent.includes('ST');
    console.log(`   High risk stock in 白酒: ${hasHighRiskStock}`);
    
    // Take risk warning screenshot from current page
    await page.screenshot({ path: path.join(DIR, '08-risk-warning.png'), fullPage: true });

    // ============ MOBILE LAYOUT ============
    console.log('\n=== Mobile Layout ===');
    const mCtx = await browser.newContext({ viewport: { width: 375, height: 812 }, locale: 'zh-CN' });
    const mp = await mCtx.newPage();
    await mp.goto(URL, { waitUntil: 'networkidle', timeout: 30000 });
    await delay(3000);
    
    const overflow = await mp.evaluate(() => {
      const body = document.body;
      return {
        docWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
        hasOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
        bodyOverflow: body.scrollWidth > body.clientWidth,
      };
    });
    R.mobile = overflow;
    console.log(`   Mobile overflow: ${overflow.hasOverflow} (doc:${overflow.docWidth} vs client:${overflow.clientWidth})`);
    
    await mp.screenshot({ path: path.join(DIR, '02-homepage-mobile.png') });
    await mCtx.close();

  } catch (err) {
    console.error('ERROR:', err.message);
  }

  await browser.close();
  console.log('\n=== RESULTS ===');
  console.log(JSON.stringify(R, null, 2));
}

run().catch(console.error);
