import base64, os

out = "/home/chris47634/stock-trading-demo/final-delivery/nexus-trade-showcase.html"
base = "/home/chris47634/stock-trading-demo"

def img_b64(path):
    full = os.path.join(base, path)
    if os.path.exists(full):
        with open(full, 'rb') as f:
            return base64.b64encode(f.read()).decode()
    return ""

def vid_b64(path):
    full = os.path.join(base, path)
    if os.path.exists(full) and os.path.getsize(full) > 0:
        with open(full, 'rb') as f:
            return base64.b64encode(f.read()).decode()
    return ""

hero_img = img_b64("final-delivery/final-release/screenshots/final-home-desktop.png")
sector_img = img_b64("final-delivery/final-release/screenshots/final-sector-desktop.png")
stock_img = img_b64("final-delivery/final-release/screenshots/final-stock-desktop.png")
trade_img = img_b64("final-delivery/final-release/screenshots/final-trade-desktop.png")
orders_img = img_b64("final-delivery/final-release/screenshots/final-orders-desktop.png")
portfolio_img = img_b64("final-delivery/final-release/screenshots/final-portfolio-desktop.png")
demo_img = img_b64("final-delivery/final-release/screenshots/final-demo-mode.png")
mobile_home_img = img_b64("final-delivery/final-release/screenshots/final-mobile-home.png")
mobile_trade_img = img_b64("final-delivery/final-release/screenshots/final-mobile-trade.png")
mobile_portfolio_img = img_b64("final-delivery/final-release/screenshots/final-mobile-portfolio.png")
cursor_img = img_b64("final-delivery/p7-a-hydration-visual-gate/p7-home-cursor-final.png")
magnetic_img = img_b64("final-delivery/p7-a-hydration-visual-gate/p7-sector-magnetic-final.png")
chart_img = img_b64("final-delivery/p7-a-hydration-visual-gate/p7-chart-final.png")
demo_highlight_img = img_b64("final-delivery/p7-a-hydration-visual-gate/p7-demo-highlight-final.png")

desktop_vid = vid_b64("final-delivery/final-release/final-desktop-full-demo.webm")
mobile_vid = vid_b64("final-delivery/final-release/final-mobile-full-demo.webm")

CSS = """
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
:root{--gold:#d4a574;--gold-light:#f0d9b5;--bg:#06060a;--bg-card:#0d0d14;--border:rgba(255,255,255,0.06);--text:#e8e0d6;--muted:#6a6058}
body{background:var(--bg);color:var(--text);font-family:'Inter',-apple-system,sans-serif;overflow-x:hidden}
::selection{background:rgba(212,165,116,0.3)}
a{color:var(--gold);text-decoration:none}

.hero{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:60px 24px;position:relative;overflow:hidden}
.hero::before{content:'';position:absolute;top:-50%;left:-50%;width:200%;height:200%;background:radial-gradient(ellipse at 50% 50%,rgba(212,165,116,0.04) 0%,transparent 60%);animation:hero-glow 8s ease-in-out infinite alternate}
@keyframes hero-glow{from{transform:translate(0,0)}to{transform:translate(2%,-2%)}}
.hero-label{font-size:12px;letter-spacing:4px;text-transform:uppercase;color:var(--gold);margin-bottom:24px;opacity:0.7}
.hero h1{font-size:clamp(48px,8vw,96px);font-weight:700;letter-spacing:-3px;line-height:0.95;background:linear-gradient(135deg,var(--gold),var(--gold-light),var(--gold));-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:20px}
.hero p{font-size:clamp(16px,2vw,20px);color:var(--muted);max-width:560px;line-height:1.7}
.hero-tags{display:flex;gap:12px;flex-wrap:wrap;justify-content:center;margin-top:32px}
.hero-tags span{background:rgba(212,165,116,0.06);border:1px solid rgba(212,165,116,0.12);border-radius:20px;padding:6px 16px;font-size:12px;color:var(--gold);letter-spacing:0.5px}
.hero-cta{margin-top:40px;display:flex;gap:16px}
.btn{padding:12px 28px;border-radius:8px;font-size:14px;font-weight:500;cursor:pointer;border:none;transition:all 0.25s}
.btn-primary{background:linear-gradient(135deg,var(--gold),#c4955a);color:#0a0a0f}
.btn-primary:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(212,165,116,0.2)}
.btn-ghost{background:transparent;border:1px solid rgba(212,165,116,0.3);color:var(--gold)}
.btn-ghost:hover{border-color:var(--gold);background:rgba(212,165,116,0.05)}

.section{max-width:1200px;margin:0 auto;padding:100px 24px}
.section-label{font-size:11px;letter-spacing:4px;text-transform:uppercase;color:var(--gold);opacity:0.6;margin-bottom:12px}
.section h2{font-size:clamp(28px,4vw,42px);font-weight:600;letter-spacing:-1px;margin-bottom:16px}
.section h2 span{color:var(--gold)}
.section .lead{font-size:16px;color:var(--muted);max-width:600px;line-height:1.7;margin-bottom:48px}

.feature-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(340px,1fr));gap:20px}
.feature{background:var(--bg-card);border:1px solid var(--border);border-radius:16px;padding:32px;transition:all 0.3s}
.feature:hover{border-color:rgba(212,165,116,0.2);transform:translateY(-3px)}
.feature .num{font-size:11px;color:var(--gold);letter-spacing:2px;margin-bottom:16px}
.feature h3{font-size:18px;font-weight:600;margin-bottom:10px}
.feature p{font-size:14px;color:var(--muted);line-height:1.6}

.screenshot-block{margin:40px 0}
.screenshot-block img{width:100%;border-radius:12px;border:1px solid var(--border);display:block}
.screenshot-block .caption{font-size:13px;color:var(--muted);margin-top:12px;text-align:center}

.showcase-row{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin:30px 0}
@media(max-width:768px){.showcase-row{grid-template-columns:1fr}}

.mobile-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin:30px 0}
@media(max-width:768px){.mobile-grid{grid-template-columns:1fr;max-width:380px;margin:30px auto}}
.mobile-frame{background:var(--bg-card);border:1px solid var(--border);border-radius:20px;padding:12px;transition:all 0.3s}
.mobile-frame:hover{border-color:rgba(212,165,116,0.2)}
.mobile-frame img{width:100%;border-radius:12px;display:block}
.mobile-frame .caption{font-size:12px;color:var(--muted);text-align:center;margin-top:10px}

.video-block{margin:40px 0}
.video-block video{width:100%;border-radius:12px;border:1px solid var(--border);display:block}
.video-block .caption{font-size:13px;color:var(--muted);margin-top:12px;text-align:center}

.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:20px;margin:40px 0}
@media(max-width:768px){.stats{grid-template-columns:repeat(2,1fr)}}
.stat{text-align:center;padding:24px;background:var(--bg-card);border:1px solid var(--border);border-radius:12px}
.stat .val{font-size:32px;font-weight:700;color:var(--gold)}
.stat .lbl{font-size:12px;color:var(--muted);margin-top:4px}

.qa-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px;margin:30px 0}
.qa-item{display:flex;align-items:center;gap:12px;padding:14px 16px;background:var(--bg-card);border:1px solid var(--border);border-radius:10px}
.qa-item .dot{width:8px;height:8px;border-radius:50%;background:#4ade80;flex-shrink:0}
.qa-item .name{font-size:13px;font-weight:500}
.qa-item .detail{font-size:12px;color:var(--muted)}

.tech-stack{display:flex;flex-wrap:wrap;gap:10px;margin:20px 0}
.tech-tag{padding:8px 16px;background:rgba(212,165,116,0.06);border:1px solid rgba(212,165,116,0.12);border-radius:8px;font-size:13px;color:var(--gold)}

.footer{text-align:center;padding:80px 24px;border-top:1px solid var(--border)}
.footer p{color:var(--muted);font-size:13px}
.footer a{color:var(--gold)}

.divider{height:1px;background:linear-gradient(90deg,transparent,var(--border),transparent);max-width:800px;margin:0 auto}
"""

html = f'''<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>NexusTrade - Stock Trading Demo</title>
<style>{CSS}</style>
</head>
<body>

<div class="hero">
<div class="hero-label">Interactive Product Showcase</div>
<h1>NexusTrade</h1>
<p>A complete stock trading terminal with real-time charts, simulated trading, portfolio management, and a guided demo mode that tells the full product story.</p>
<div class="hero-tags">
<span>Next.js 14</span><span>TypeScript</span><span>Zustand</span><span>TradingView Charts</span><span>Demo Mode</span><span>Mobile First</span>
</div>
<div class="hero-cta">
<a href="https://stock-trading-demo.vercel.app" class="btn btn-primary">View Live Demo</a>
<a href="#screenshots" class="btn btn-ghost">Explore Screens</a>
</div>
</div>

<div class="divider"></div>

<div class="section">
<div class="stats">
<div class="stat"><div class="val">10+</div><div class="lbl">Interactive Pages</div></div>
<div class="stat"><div class="val">10</div><div class="lbl">Demo Steps</div></div>
<div class="stat"><div class="val">8-Column</div><div class="lbl">Portfolio Grid</div></div>
<div class="stat"><div class="val">15/15</div><div class="lbl">QA Passed</div></div>
</div>
</div>

<div class="section">
<div class="section-label">Features</div>
<h2>Full-Stack Trading <span>Experience</span></h2>
<p class="lead">From market overview to trade execution, every surface of this terminal is built to feel like a real product.</p>
<div class="feature-grid">
<div class="feature"><div class="num">01</div><h3>Market Overview</h3><p>Real-time index tracking, sector heatmaps, capital flow visualization, and market breadth indicators across the A-share market.</p></div>
<div class="feature"><div class="num">02</div><h3>Sector Analysis</h3><p>10 sectors with constituent stocks, ranked by performance. Canvas-rendered glow effects respond to cursor position.</p></div>
<div class="feature"><div class="num">03</div><h3>Stock Detail</h3><p>Candlestick charts via TradingView Lightweight Charts, Level 2 order book, technical indicators (MA5/10/20), and volume analysis.</p></div>
<div class="feature"><div class="num">04</div><h3>Simulated Trading</h3><p>Full buy/sell flow with quantity input, price validation, insufficient funds rejection, and order confirmation dialog.</p></div>
<div class="feature"><div class="num">05</div><h3>Portfolio Management</h3><p>8-column position table, account summary with cash/market value/position ratio, transaction history with horizontal scroll.</p></div>
<div class="feature"><div class="num">06</div><h3>Demo Mode</h3><p>10-step guided product walkthrough that generates real demo data, shows it across pages, and cleans up on exit.</p></div>
</div>
</div>

<div class="divider"></div>

<div class="section" id="screenshots">
<div class="section-label">Desktop</div>
<h2>1440 x 900 <span>Full Terminal</span></h2>

<div class="screenshot-block">
<img src="data:image/png;base64,{hero_img}" alt="Homepage">
<div class="caption">Homepage - Market overview with 10 sector cards, index tracking, capital flow</div>
</div>

<div class="showcase-row">
<div class="screenshot-block">
<img src="data:image/png;base64,{sector_img}" alt="Sector Detail">
<div class="caption">Sector Detail - Constituent stocks ranked by performance</div>
</div>
<div class="screenshot-block">
<img src="data:image/png;base64,{stock_img}" alt="Stock Detail">
<div class="caption">Stock Detail - K-line chart, order book, technical indicators</div>
</div>
</div>

<div class="showcase-row">
<div class="screenshot-block">
<img src="data:image/png;base64,{trade_img}" alt="TradePanel">
<div class="caption">TradePanel - Buy/sell with validation and confirmation</div>
</div>
<div class="screenshot-block">
<img src="data:image/png;base64,{orders_img}" alt="Orders">
<div class="caption">Orders - Transaction records with demo data integration</div>
</div>
</div>

<div class="screenshot-block">
<img src="data:image/png;base64,{portfolio_img}" alt="Portfolio">
<div class="caption">Portfolio - 8-column position table, account summary, transaction history</div>
</div>
</div>

<div class="divider"></div>

<div class="section">
<div class="section-label">Demo Mode</div>
<h2>Product Story <span>in 10 Steps</span></h2>
<p class="lead">A guided walkthrough that generates real trading data, shows it across pages, and resets on exit.</p>
<div class="screenshot-block">
<img src="data:image/png;base64,{demo_img}" alt="Demo Mode">
<div class="caption">Demo Mode - Step-by-step product walkthrough with focus highlights</div>
</div>
<div class="screenshot-block">
<img src="data:image/png;base64,{demo_highlight_img}" alt="Demo Highlight">
<div class="caption">Demo Focus Ring - Gold pulse outline guides attention without blocking data</div>
</div>
</div>

<div class="divider"></div>

<div class="section">
<div class="section-label">Interaction</div>
<h2>Advanced Cursor <span>and Motion</span></h2>
<p class="lead">Subtle cursor glow, magnetic card tilt, click ripples, and row accent animations. Reduced-motion fallback for accessibility.</p>
<div class="showcase-row">
<div class="screenshot-block">
<img src="data:image/png;base64,{cursor_img}" alt="Cursor Glow">
<div class="caption">Cursor Glow - 220px radial gradient follows mouse with inertia lag</div>
</div>
<div class="screenshot-block">
<img src="data:image/png;base64,{magnetic_img}" alt="Magnetic Cards">
<div class="caption">Magnetic Cards - Perspective tilt up to 1.5 degrees, glow follows cursor</div>
</div>
</div>
<div class="screenshot-block">
<img src="data:image/png;base64,{chart_img}" alt="Chart Interaction">
<div class="caption">K-Line Area - Canvas chart untouched, interaction layer on top</div>
</div>
</div>

<div class="divider"></div>

<div class="section">
<div class="section-label">Mobile</div>
<h2>390 x 844 <span>Responsive</span></h2>
<p class="lead">Touch-optimized layout with press feedback, no horizontal overflow, and simplified navigation.</p>
<div class="mobile-grid">
<div class="mobile-frame">
<img src="data:image/png;base64,{mobile_home_img}" alt="Mobile Home">
<div class="caption">Mobile Home</div>
</div>
<div class="mobile-frame">
<img src="data:image/png;base64,{mobile_trade_img}" alt="Mobile Trade">
<div class="caption">Mobile Trade</div>
</div>
<div class="mobile-frame">
<img src="data:image/png;base64,{mobile_portfolio_img}" alt="Mobile Portfolio">
<div class="caption">Mobile Portfolio</div>
</div>
</div>
</div>

<div class="divider"></div>

<div class="section">
<div class="section-label">Demo Videos</div>
<h2>Full Flow <span>Walkthrough</span></h2>
<div class="showcase-row">
<div class="video-block">
<video controls preload="metadata" src="data:video/webm;base64,{desktop_vid}"></video>
<div class="caption">Desktop Full Demo (1440x900)</div>
</div>
<div class="video-block">
<video controls preload="metadata" src="data:video/webm;base64,{mobile_vid}"></video>
<div class="caption">Mobile Full Demo (390x844)</div>
</div>
</div>
</div>

<div class="divider"></div>

<div class="section">
<div class="section-label">Quality</div>
<h2>15/15 <span>QA Passed</span></h2>
<div class="qa-grid">
<div class="qa-item"><div class="dot"></div><div><div class="name">Homepage</div><div class="detail">Market overview, sector cards, index tracking</div></div></div>
<div class="qa-item"><div class="dot"></div><div><div class="name">Sector Detail</div><div class="detail">Constituent stocks, capital flow</div></div></div>
<div class="qa-item"><div class="dot"></div><div><div class="name">Stock Detail + K-Line</div><div class="detail">TradingView charts, order book</div></div></div>
<div class="qa-item"><div class="dot"></div><div><div class="name">TradePanel</div><div class="detail">Buy/sell flow, validation, rejection</div></div></div>
<div class="qa-item"><div class="dot"></div><div><div class="name">Orders</div><div class="detail">Transaction records, demo data</div></div></div>
<div class="qa-item"><div class="dot"></div><div><div class="name">Portfolio 8-Column</div><div class="detail">Position table, account summary</div></div></div>
<div class="qa-item"><div class="dot"></div><div><div class="name">Demo Mode 10-Step</div><div class="detail">Full product story, data visibility</div></div></div>
<div class="qa-item"><div class="dot"></div><div><div class="name">Cursor Glow</div><div class="detail">Radial gradient, inertia lag</div></div></div>
<div class="qa-item"><div class="dot"></div><div><div class="name">Magnetic Cards</div><div class="detail">Perspective tilt, glow follow</div></div></div>
<div class="qa-item"><div class="dot"></div><div><div class="name">Click Ripple</div><div class="detail">TradePanel button feedback</div></div></div>
<div class="qa-item"><div class="dot"></div><div><div class="name">Mobile 390x844</div><div class="detail">No overflow, press feedback</div></div></div>
<div class="qa-item"><div class="dot"></div><div><div class="name">Reduced Motion</div><div class="detail">Accessibility fallback</div></div></div>
<div class="qa-item"><div class="dot"></div><div><div class="name">Console Errors</div><div class="detail">0 errors on production</div></div></div>
<div class="qa-item"><div class="dot"></div><div><div class="name">Build/Lint</div><div class="detail">0 warnings, 0 errors</div></div></div>
<div class="qa-item"><div class="dot"></div><div><div class="name">Production Deploy</div><div class="detail">Vercel auto-deploy verified</div></div></div>
</div>
</div>

<div class="divider"></div>

<div class="section">
<div class="section-label">Stack</div>
<h2>Built With</h2>
<div class="tech-stack">
<span class="tech-tag">Next.js 14.2.35</span>
<span class="tech-tag">TypeScript</span>
<span class="tech-tag">Zustand</span>
<span class="tech-tag">Tailwind CSS</span>
<span class="tech-tag">Framer Motion</span>
<span class="tech-tag">TradingView Lightweight Charts</span>
<span class="tech-tag">Lucide React</span>
<span class="tech-tag">Canvas API</span>
<span class="tech-tag">localStorage</span>
<span class="tech-tag">Vercel</span>
</div>
</div>

<div class="footer">
<p style="font-size:18px;color:var(--gold);margin-bottom:8px">NexusTrade</p>
<p><a href="https://stock-trading-demo.vercel.app">stock-trading-demo.vercel.app</a></p>
<p style="margin-top:16px;font-size:12px;opacity:0.5">v7-a Final Release</p>
</div>

</body>
</html>'''

os.makedirs(os.path.dirname(out), exist_ok=True)
with open(out, 'w') as f:
    f.write(html)

size_mb = os.path.getsize(out) / 1024 / 1024
print(f"Written: {out} ({size_mb:.1f} MB)")
