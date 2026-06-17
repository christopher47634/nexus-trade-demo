const { chromium } = require('playwright');
const path = require('path');

const DIR = path.join(__dirname, 'final-delivery/p4-a-qa-gate/screenshots');
const URL = 'http://localhost:3458';
const delay = ms => new Promise(r => setTimeout(r, ms));

async function run() {
  const browser = await chromium.launch({ headless: true });
  // Use a single context for entire flow so localStorage persists
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'zh-CN' });
  const page = await ctx.newPage();
  const R = {};

  try {
    // ===== 1. HOMEPAGE =====
    console.log('1. Homepage');
    await page.goto(URL, { waitUntil: 'networkidle', timeout: 30000 });
    await delay(3000);
    await page.screenshot({ path: path.join(DIR, '01-homepage-desktop.png') });

    // ===== 2. SECTOR DETAIL =====
    console.log('2. Sector detail (光通信)');
    const sectors = await page.$$('[id="sectors"] > div');
    await sectors[1].click();
    await delay(2500);
    await page.screenshot({ path: path.join(DIR, '03-sector-detail.png') });

    const sc = await page.textContent('body');
    R.sector = {
      isOptical: sc.includes('光通信'),
      hasRisk: sc.includes('风险'),
      hasAnalysis: sc.includes('分析') || sc.includes('趋势'),
      hasChart: sc.includes('板块趋势'),
    };
    console.log('   Sector:', JSON.stringify(R.sector));

    // ===== 3. STOCK DETAIL =====
    console.log('3. Stock detail (中际旭创)');
    await page.click('text=中际旭创');
    await delay(2500);
    await page.screenshot({ path: path.join(DIR, '04-stock-detail.png') });

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

    // ===== 4. TRADE DIALOG =====
    console.log('4. Trade dialog');
    await page.click('button:has-text("买入")');
    await delay(1500);
    await page.screenshot({ path: path.join(DIR, '05-trade-panel.png') });

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

    // ===== 5. CONFIRM DIALOG =====
    console.log('5. Confirm dialog');
    await page.click('button:has-text("确认买入")');
    await delay(1000);
    await page.screenshot({ path: path.join(DIR, '06-trade-confirm.png') });

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
    console.log('   Confirm:', JSON.stringify(R.confirmDialog));

    // ===== 6. SUBMIT ORDER =====
    console.log('6. Submit order');
    await page.click('button:has-text("确认委托")');
    await delay(4000); // Wait for submitted -> matching -> filled
    
    const fc = await page.textContent('body');
    R.orderStatus = {
      hasOrderId: fc.includes('WT'),
      hasSubmitted: fc.includes('已提交') || fc.includes('订单已提交'),
      hasFilled: fc.includes('成交') || fc.includes('模拟成交'),
    };
    console.log('   Order status:', JSON.stringify(R.orderStatus));

    // ===== 7. ORDERS PAGE =====
    console.log('7. Orders page');
    await page.goto(`${URL}/orders`, { waitUntil: 'networkidle', timeout: 30000 });
    await delay(2000);
    
    // Check if order is visible
    let oc = await page.textContent('body');
    R.orders = {
      hasOrders: !oc.includes('暂无委托订单'),
      hasWTFormat: oc.includes('WT'),
      hasStatus: oc.includes('已成交') || oc.includes('已委托') || oc.includes('待成交'),
    };
    console.log('   Orders (before expand):', JSON.stringify(R.orders));
    
    // Try to click on order row to expand and see commission
    const clickableRows = await page.$$('[class*="cursor-pointer"]');
    for (const row of clickableRows) {
      const text = await row.textContent();
      if (text.includes('WT') || text.includes('中际旭创')) {
        await row.click();
        await delay(800);
        break;
      }
    }
    
    oc = await page.textContent('body');
    R.orders.hasCommission = oc.includes('佣金');
    
    // Extract order ID
    const wtMatch = oc.match(/WT\d{8}\d{6}/);
    if (wtMatch) R.orders.orderId = wtMatch[0];
    
    await page.screenshot({ path: path.join(DIR, '07-orders-page.png') });
    console.log('   Orders (final):', JSON.stringify(R.orders));

    // ===== 8. RISK WARNING =====
    console.log('8. Risk warning');
    // Check if any stock has riskWarning by looking at the trade dialog for a high-risk stock
    await page.goto(URL, { waitUntil: 'networkidle', timeout: 30000 });
    await delay(2000);
    
    // Go to a sector with potential high-risk stocks
    const secs = await page.$$('[id="sectors"] > div');
    await secs[2].click(); // 低空经济
    await delay(2000);
    
    // Look for stocks with risk warnings
    const lowAltContent = await page.textContent('body');
    const hasHighRiskStock = lowAltContent.includes('高风险') || lowAltContent.includes('ST');
    
    // Try clicking a stock and opening trade dialog to see risk warning
    const stockLinks = await page.$$('text=/纵横股份|中信海直|万丰奥威/');
    if (stockLinks.length > 0) {
      await stockLinks[0].click();
      await delay(2000);
      await page.click('button:has-text("买入")');
      await delay(1500);
      await page.screenshot({ path: path.join(DIR, '08-risk-warning.png') });
      
      const riskContent = await page.textContent('body');
      R.riskWarning = {
        hasWarningBanner: riskContent.includes('风险提示') || riskContent.includes('风险警告') || riskContent.includes('谨慎'),
        hasWarningIcon: riskContent.includes('AlertTriangle') || riskContent.includes('⚠'),
      };
    } else {
      await page.screenshot({ path: path.join(DIR, '08-risk-warning.png'), fullPage: true });
      R.riskWarning = { hasWarningBanner: false, note: 'No high-risk stocks found to test warning banner' };
    }
    console.log('   Risk warning:', JSON.stringify(R.riskWarning));

    // ===== MOBILE =====
    console.log('\n9. Mobile layout');
    const mCtx = await browser.newContext({ viewport: { width: 375, height: 812 }, locale: 'zh-CN' });
    const mp = await mCtx.newPage();
    await mp.goto(URL, { waitUntil: 'networkidle', timeout: 30000 });
    await delay(3000);
    
    const overflow = await mp.evaluate(() => ({
      docWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      hasOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
    }));
    R.mobile = overflow;
    await mp.screenshot({ path: path.join(DIR, '02-homepage-mobile.png') });
    console.log('   Mobile:', JSON.stringify(overflow));
    await mCtx.close();

  } catch (err) {
    console.error('ERROR:', err.message);
  }

  await browser.close();
  console.log('\n=== FINAL RESULTS ===');
  console.log(JSON.stringify(R, null, 2));
}

run().catch(console.error);
