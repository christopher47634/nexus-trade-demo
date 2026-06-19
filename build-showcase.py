import base64, os

out = "/home/chris47634/stock-trading-demo/final-delivery/nexus-trade-showcase.html"

sections = [
    ("Final Production", [
        ("final-home-desktop.png", "首页 Desktop 1440x900"),
        ("final-sector-desktop.png", "板块详情"),
        ("final-stock-desktop.png", "个股详情 / K线"),
        ("final-trade-desktop.png", "TradePanel 交易面板"),
        ("final-orders-desktop.png", "订单页"),
        ("final-portfolio-desktop.png", "持仓页"),
        ("final-demo-mode.png", "Demo Mode 交易闭环"),
        ("final-mobile-home.png", "移动端首页"),
        ("final-mobile-trade.png", "移动端交易"),
        ("final-mobile-portfolio.png", "移动端持仓"),
    ], "final-delivery/final-release/screenshots"),
    ("P7-A Cursor and Interaction", [
        ("p7-home-cursor-final.png", "Cursor Glow 跟随效果"),
        ("p7-sector-magnetic-final.png", "Magnetic Card 磁吸卡片"),
        ("p7-portfolio-table-final.png", "Portfolio 8 列表格"),
        ("p7-chart-final.png", "K线区域交互"),
        ("p7-demo-highlight-final.png", "Demo Focus Ring"),
        ("p7-mobile-final.png", "移动端无溢出"),
    ], "final-delivery/p7-a-hydration-visual-gate"),
    ("P7-A Detail Screenshots", [
        ("cursor-home-after.png", "Cursor Overlay 效果"),
        ("magnetic-sector-card-after.png", "Sector Card Magnetic Hover"),
        ("portfolio-row-hover-after.png", "Portfolio Row Hover"),
        ("chart-interaction-after.png", "Chart Canvas 不遮挡"),
        ("trade-button-ripple-after.png", "ClickRipple 按钮涟漪"),
        ("demo-focus-ring-after.png", "Demo Highlight Ring"),
        ("mobile-press-after.png", "Mobile Press Feedback"),
    ], "final-delivery/p7-a-advanced-cursor-interaction-layer"),
]

vid_files = [
    "final-delivery/final-release/final-desktop-full-demo.webm",
    "final-delivery/final-release/final-mobile-full-demo.webm",
    "final-delivery/p7-a-advanced-cursor-interaction-layer/p7-a-desktop-cursor-interaction-demo.webm",
    "final-delivery/p7-a-advanced-cursor-interaction-layer/p7-a-mobile-interaction-demo.webm",
]

qa_items = [
    ("Homepage", "PASS", "首页正常加载, 板块视觉完整"),
    ("Sector Detail", "PASS", "板块详情页, 成分股列表"),
    ("Stock Detail + K-Line", "PASS", "个股详情, TradingView Lightweight Charts"),
    ("TradePanel Buy/Sell", "PASS", "买入/卖出联动, 拒绝逻辑"),
    ("Orders Page", "PASS", "订单记录, demo order 可见"),
    ("Portfolio 8-Column", "PASS", "持仓表格 8 列横向布局"),
    ("Transaction List", "PASS", "资金流水, demo transaction 可见"),
    ("Demo Mode 10-Step", "PASS", "完整交易闭环, data 可见, reset 正常"),
    ("Cursor Glow", "PASS", "220px radial gradient, soft-light blend"),
    ("Magnetic Cards", "PASS", "perspective tilt 1.5deg, glow follows mouse"),
    ("Click Ripple", "PASS", "TradePanel button ripple effect"),
    ("Mobile 390x844", "PASS", "无横向溢出, press feedback"),
    ("Reduced Motion", "PASS", "prefers-reduced-motion 降级"),
    ("Console Errors", "PASS", "0 errors on both main and P7-A"),
    ("Build/Lint", "PASS", "0 warnings, 0 errors"),
]

html = []
html.append("""<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>NexusTrade Stock Trading Demo Showcase</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#0a0a0f;color:#e0d5c8;font-family:-apple-system,'SF Pro Display','Helvetica Neue',sans-serif;line-height:1.6}
.hero{text-align:center;padding:80px 20px 40px;background:linear-gradient(180deg,#12121a,#0a0a0f)}
.hero h1{font-size:42px;font-weight:700;letter-spacing:-1px;background:linear-gradient(135deg,#d4a574,#f0d9b5);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.hero p{color:#8a7e72;font-size:16px;margin-top:12px}
.hero .meta{display:flex;gap:24px;justify-content:center;margin-top:20px;flex-wrap:wrap}
.hero .meta span{background:rgba(212,165,116,0.08);border:1px solid rgba(212,165,116,0.15);border-radius:6px;padding:4px 12px;font-size:13px;color:#d4a574}
.section{max-width:1200px;margin:0 auto;padding:40px 20px}
.section h2{font-size:24px;font-weight:600;color:#d4a574;margin-bottom:8px;border-left:3px solid #d4a574;padding-left:12px}
.section .desc{color:#6a6058;font-size:14px;margin-bottom:24px;padding-left:15px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(360px,1fr));gap:20px}
.card{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:12px;overflow:hidden;transition:border-color 0.3s}
.card:hover{border-color:rgba(212,165,116,0.25)}
.card img{width:100%;display:block}
.card .label{padding:10px 14px;font-size:13px;color:#a09688}
.video-section{max-width:1200px;margin:0 auto;padding:40px 20px}
.video-section h2{font-size:24px;font-weight:600;color:#d4a574;margin-bottom:20px;border-left:3px solid #d4a574;padding-left:12px}
.video-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(480px,1fr));gap:20px}
.video-card{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:12px;overflow:hidden}
.video-card video{width:100%;display:block}
.video-card .label{padding:10px 14px;font-size:13px;color:#a09688}
.qa-table{width:100%;border-collapse:collapse;margin-top:16px}
.qa-table th,.qa-table td{padding:10px 14px;text-align:left;border-bottom:1px solid rgba(255,255,255,0.06);font-size:14px}
.qa-table th{color:#d4a574;font-weight:600}
.qa-table .pass{color:#4ade80}
.footer{text-align:center;padding:60px 20px;color:#4a4238;font-size:13px}
.footer a{color:#d4a574;text-decoration:none}
@media(max-width:768px){.grid{grid-template-columns:1fr}.video-grid{grid-template-columns:1fr}.hero h1{font-size:28px}}
</style>
</head>
<body>
<div class="hero">
<h1>NexusTrade</h1>
<p>Stock Trading Demo - Interactive Product Showcase</p>
<div class="meta">
<span>Next.js 14.2.35</span><span>Zustand</span><span>TradingView Charts</span><span>Demo Mode 10-Step</span><span>Mobile Responsive</span><span>v7-a</span>
</div>
</div>
""")

# QA table
html.append('<div class="section"><h2>QA Summary</h2><div class="desc">15/15 PASS - Production Ready</div><table class="qa-table"><tr><th>Item</th><th>Status</th><th>Detail</th></tr>')
for item, status, detail in qa_items:
    html.append(f'<tr><td>{item}</td><td class="pass">{status}</td><td>{detail}</td></tr>')
html.append('</table></div>')

# Image sections
for title, images, base_dir in sections:
    html.append(f'<div class="section"><h2>{title}</h2><div class="grid">')
    for fname, label in images:
        fpath = os.path.join(base_dir, fname)
        if os.path.exists(fpath):
            with open(fpath, 'rb') as f:
                b64 = base64.b64encode(f.read()).decode()
            html.append(f'<div class="card"><img src="data:image/png;base64,{b64}" alt="{label}"><div class="label">{label}</div></div>')
    html.append('</div></div>')

# Videos
html.append('<div class="video-section"><h2>Demo Videos</h2><div class="video-grid">')
for vf in vid_files:
    if os.path.exists(vf) and os.path.getsize(vf) > 0:
        with open(vf, 'rb') as f:
            b64 = base64.b64encode(f.read()).decode()
        label = os.path.basename(vf).replace('.webm','').replace('-',' ').replace('_',' ').title()
        html.append(f'<div class="video-card"><video controls preload="metadata" src="data:video/webm;base64,{b64}"></video><div class="label">{label}</div></div>')
html.append('</div></div>')

html.append("""
<div class="footer">
<p>NexusTrade Stock Trading Demo</p>
<p><a href="https://stock-trading-demo.vercel.app">stock-trading-demo.vercel.app</a></p>
<p style="margin-top:8px">Build: v7-a - Final Release</p>
</div>
</body></html>""")

os.makedirs(os.path.dirname(out), exist_ok=True)
with open(out, 'w') as f:
    f.write('\n'.join(html))

size_mb = os.path.getsize(out) / 1024 / 1024
print(f"Written: {out} ({size_mb:.1f} MB)")
