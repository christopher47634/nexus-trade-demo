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
    console.log('   Screenshot saved');

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
    console.log('   Sector:', JSON.stringify(R.sector));

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
      hasRiskWarning: stc.includes('高风险') || stc.includes('风险提示'),
    };
    console.log('   Stock:', JSON.stringify(R.stock));

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
      hasPriceInput: dc.includes('委托价格'),
      hasQtyInput: dc.includes('委托数量'),
      hasCommission: dc.includes('佣金'),
      hasDisclaimer: dc.includes('模拟交易') && dc.includes('不构成投资建议'),
      hasAvailFunds: dc.includes('可用资金'),
      hasMaxBuy: dc.includes('最大可买'),
    };
    console.log('   Trade dialog:', JSON.stringify(R.tradeDialog));

    // Set quantity to 1 lot (100 shares) - default is already 1
    // Verify quantity is 1
    const qtyInput = await page.$('input[type="number"]');
    if (qtyInput) {
      const val = await qtyInput.inputValue();
      console.log(`   Quantity input value: ${val} lots`);
    }

    // 7. Click 确认买入 (goes to confirm step)
    console.log('7. Click 确认买入');
    await page.click('button:has-text("确认买入")');
    await delay(1000);

    // Take confirmation dialog screenshot
    await page.screenshot({ path: path.join(DIR, '06-trade-confirm.png') });

    // Verify confirmation dialog
    const cc = await page.textContent('body');
    R.confirmDialog = {
      hasStockName: cc.includes('中际旭创') || cc.includes('300308'),
      hasDirection: cc.includes('买入'),
      hasPriceQty: cc.includes('元') && cc.includes('股'),
      hasCommission: cc.includes('佣金'),
      hasNetAmount: cc.includes('实际扣款') || cc.includes('预计扣款'),
      hasConfirmBtn: cc.includes('确认委托'),
      hasCancelBtn: cc.includes('取消'),
    };
    console.log('   Confirm dialog:', JSON.stringify(R.confirmDialog));

    // 8. Click 确认委托 (actually submits the order)
    console.log('8. Click 确认委托');
    await page.click('button:has-text("确认委托")');
    await delay(4000); // Wait for order to go through submitted -> matching -> filled

    // Take filled order screenshot
    await page.screenshot({ path: path.join(DIR, '06-trade-confirm.png') });

    // Verify order filled
    const fc = await page.textContent('body');
    R.orderFilled = {
      hasOrderId: fc.includes('WT'),
      hasSubmitted: fc.includes('已提交') || fc.includes('订单已提交'),
      hasMatching: fc.includes('撮合'),
      hasFilled: fc.includes('成交') || fc.includes('模拟成交'),
    };
    console.log('   Order status:', JSON.stringify(R.orderFilled));

    // 9. Navigate to /orders
    console.log('9. Navigate to /orders');
    await page.goto(`${URL}/orders`, { waitUntil: 'networkidle', timeout: 30000 });
    await delay(2000);
    await page.screenshot({ path: path.join(DIR, '07-orders-page.png') });

    const oc = await page.textContent('body');
    R.orders = {
      hasOrders: !oc.includes('暂无委托订单'),
      hasWTFormat: oc.includes('WT'),
      hasCommission: oc.includes('佣金') || oc.includes('手续费'),
      hasStatus: oc.includes('已委托') || oc.includes('待成交') || oc.includes('已成交') || oc.includes('成交'),
    };
    console.log('   Orders:', JSON.stringify(R.orders));

    // Extract order details if visible
    const wtMatch = oc.match(/WT\d{8}\d{6}/);
    if (wtMatch) {
      R.orders.orderId = wtMatch[0];
      console.log(`   Order ID: ${wtMatch[0]}`);
    }

    // 10. Risk warning screenshot
    console.log('10. Risk warning check');
    // Check if there are high-risk stocks with warnings
    // 中际旭创 doesn't have riskWarning, so check for stocks that do
    await page.goto(URL, { waitUntil: 'networkidle', timeout: 30000 });
    await delay(2000);
    
    // Check mock data for risk warnings
    const riskStocks = await page.evaluate(() => {
      // Look for any visible risk warnings on the page
      const warnings = document.querySelectorAll('[class*="warning"], [class*="risk"]');
      return warnings.length;
    });
    console.log(`   Risk warning elements on homepage: ${riskStocks}`);

    // Navigate to a stock that has riskWarning
    const secs2 = await page.$$('[id="sectors"] > div');
    await secs2[1].click(); // 光通信
    await delay(2000);
    
    // Click on a high-risk stock (if available)
    const highRiskStock = await page.$('text=长光华芯');
    if (highRiskStock) {
      await highRiskStock.click();
      await delay(2000);
      
      // Open trade dialog to see risk warning
      const buyBtn = await page.$('button:has-text("买入")');
      if (buyBtn) {
        await buyBtn.click();
        await delay(1500);
        await page.screenshot({ path: path.join(DIR, '08-risk-warning.png') });
        console.log('   Risk warning screenshot taken (high-risk stock)');
      }
    } else {
      // Take screenshot of current page as risk warning reference
      await page.screenshot({ path: path.join(DIR, '08-risk-warning.png'), fullPage: true });
      console.log('   Risk warning screenshot taken (sector detail)');
    }

    // ============ MOBILE LAYOUT ============
    console.log('\n=== Mobile Layout ===');
    const mCtx = await browser.newContext({ viewport: { width: 375, height: 812 }, locale: 'zh-CN' });
    const mp = await mCtx.newPage();
    await mp.goto(URL, { waitUntil: 'networkidle', timeout: 30000 });
    await delay(3000);
    
    const overflow = await mp.evaluate(() => {
      return {
        docWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
        hasOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      };
    });
    R.mobile = overflow;
    console.log(`   Overflow: ${overflow.hasOverflow} (doc:${overflow.docWidth} vs client:${overflow.clientWidth})`);
    
    await mp.screenshot({ path: path.join(DIR, '02-homepage-mobile.png') });
    await mCtx.close();

  } catch (err) {
    console.error('ERROR:', err.message);
  }

  await browser.close();
  console.log('\n=== FINAL RESULTS ===');
  console.log(JSON.stringify(R, null, 2));
}

run().catch(console.error);
