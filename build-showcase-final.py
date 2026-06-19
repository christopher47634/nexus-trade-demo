import base64, os

out = "/home/chris47634/stock-trading-demo/final-delivery/nexus-trade-showcase.html"
base = "/home/chris47634/stock-trading-demo/final-delivery/showcase-screenshots"

def b64(filename):
    path = os.path.join(base, filename)
    if not os.path.exists(path):
        return ""
    with open(path, "rb") as f:
        return base64.b64encode(f.read()).decode()

imgs = {
    "desktop-home": b64("desktop-home.png"),
    "desktop-sector": b64("desktop-sector.png"),
    "desktop-trade": b64("desktop-trade.png"),
    "desktop-portfolio": b64("desktop-portfolio.png"),
    "desktop-settings": b64("desktop-settings.png"),
    "mobile-home": b64("mobile-home.png"),
    "mobile-trade": b64("mobile-trade.png"),
    "mobile-portfolio": b64("mobile-portfolio.png"),
    "mobile-orders": b64("mobile-orders.png"),
    "mobile-settings": b64("mobile-settings.png"),
}

html = f"""<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Nexus Trade — 模拟交易平台</title>
<style>
  * {{ margin: 0; padding: 0; box-sizing: border-box; }}
  body {{
    background: #08080f;
    color: #e8e0d6;
    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif;
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
  }}
  .container {{ max-width: 1200px; margin: 0 auto; padding: 0 24px; }}

  /* Hero */
  .hero {{
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    position: relative;
    overflow: hidden;
  }}
  .hero::before {{
    content: '';
    position: absolute;
    top: -200px; left: 50%; transform: translateX(-50%);
    width: 600px; height: 600px;
    background: radial-gradient(circle, rgba(212,165,116,0.08) 0%, transparent 70%);
    pointer-events: none;
  }}
  .hero-badge {{
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 6px 16px;
    border-radius: 20px;
    background: rgba(212,165,116,0.08);
    border: 1px solid rgba(212,165,116,0.15);
    font-size: 12px;
    color: #d4a574;
    margin-bottom: 24px;
  }}
  .hero h1 {{
    font-size: clamp(36px, 6vw, 64px);
    font-weight: 700;
    letter-spacing: -0.02em;
    background: linear-gradient(135deg, #e8e0d6 0%, #d4a574 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 16px;
  }}
  .hero p {{
    font-size: 18px;
    color: rgba(232,224,214,0.5);
    max-width: 520px;
    margin-bottom: 32px;
  }}
  .hero-cta {{
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 12px 28px;
    border-radius: 12px;
    background: linear-gradient(135deg, rgba(212,165,116,0.2) 0%, rgba(212,165,116,0.08) 100%);
    border: 1px solid rgba(212,165,116,0.3);
    color: #d4a574;
    font-size: 15px;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.3s;
    backdrop-filter: blur(12px);
  }}
  .hero-cta:hover {{ background: rgba(212,165,116,0.25); transform: translateY(-2px); }}

  /* Sections */
  section {{ padding: 80px 0; }}
  .section-label {{
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: #d4a574;
    margin-bottom: 8px;
  }}
  .section-title {{
    font-size: clamp(24px, 4vw, 36px);
    font-weight: 600;
    margin-bottom: 12px;
  }}
  .section-desc {{
    font-size: 15px;
    color: rgba(232,224,214,0.45);
    max-width: 560px;
    margin-bottom: 40px;
  }}

  /* Screenshot Cards */
  .screen-card {{
    background: linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 16px;
    overflow: hidden;
    margin-bottom: 32px;
    backdrop-filter: blur(20px);
  }}
  .screen-card img {{
    width: 100%;
    display: block;
  }}
  .screen-card .caption {{
    padding: 16px 20px;
    font-size: 13px;
    color: rgba(232,224,214,0.5);
    border-top: 1px solid rgba(255,255,255,0.04);
  }}

  /* Features Grid */
  .features {{
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
    margin-bottom: 48px;
  }}
  .feature-card {{
    background: linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 16px;
    padding: 24px;
    backdrop-filter: blur(20px);
  }}
  .feature-icon {{
    width: 40px; height: 40px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    margin-bottom: 14px;
    background: rgba(212,165,116,0.1);
    border: 1px solid rgba(212,165,116,0.15);
  }}
  .feature-card h3 {{ font-size: 15px; font-weight: 600; margin-bottom: 6px; }}
  .feature-card p {{ font-size: 13px; color: rgba(232,224,214,0.4); line-height: 1.5; }}

  /* Mobile Grid */
  .mobile-grid {{
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
    margin-bottom: 48px;
  }}
  .mobile-frame {{
    background: #111118;
    border-radius: 24px;
    padding: 8px;
    border: 1px solid rgba(255,255,255,0.06);
  }}
  .mobile-frame img {{
    width: 100%;
    border-radius: 18px;
    display: block;
  }}

  /* Tech Stack */
  .tech-row {{
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 48px;
  }}
  .tech-tag {{
    padding: 6px 14px;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 500;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    color: rgba(232,224,214,0.6);
  }}

  /* Divider */
  .divider {{
    height: 1px;
    background: linear-gradient(90deg, transparent 0%, rgba(212,165,116,0.15) 50%, transparent 100%);
    margin: 0;
  }}

  /* Footer */
  footer {{
    text-align: center;
    padding: 40px 0 60px;
    font-size: 12px;
    color: rgba(232,224,214,0.25);
  }}
</style>
</head>
<body>

<!-- Hero -->
<div class="hero">
  <div class="hero-badge">◆ Nexus Trade</div>
  <h1>模拟交易平台</h1>
  <p>一个完整的股票模拟交易产品 Demo，覆盖行情、K线、下单、持仓、委托全流程，Desktop + Mobile 双端原生适配。</p>
  <a href="https://stock-trading-demo.vercel.app" class="hero-cta" target="_blank">
    查看在线 Demo →
  </a>
</div>

<div class="divider"></div>

<!-- Features -->
<section>
  <div class="container">
    <div class="section-label">功能特性</div>
    <div class="section-title">完整的交易体验</div>
    <div class="section-desc">从行情浏览到下单成交，每个环节都经过精心打磨。</div>

    <div class="features">
      <div class="feature-card">
        <div class="feature-icon">📊</div>
        <h3>实时行情</h3>
        <p>大盘指数、板块热度、个股详情，数据实时刷新。</p>
      </div>
      <div class="feature-card">
        <div class="feature-icon">📈</div>
        <h3>K线图表</h3>
        <p>日K/周K/月K，MA均线，成交量柱状图，Canvas 四层渲染。</p>
      </div>
      <div class="feature-card">
        <div class="feature-icon">💹</div>
        <h3>模拟交易</h3>
        <p>限价委托、买卖五档、资金冻结、成交撮合，完整交易链路。</p>
      </div>
      <div class="feature-card">
        <div class="feature-icon">📋</div>
        <h3>持仓管理</h3>
        <p>持仓明细、盈亏计算、资产趋势图、资金流水记录。</p>
      </div>
      <div class="feature-card">
        <div class="feature-icon">🎯</div>
        <h3>Demo 引导</h3>
        <p>10 步交互式 Demo Guide，自动演示完整交易流程。</p>
      </div>
      <div class="feature-card">
        <div class="feature-icon">✨</div>
        <h3>高级交互</h3>
        <p>Cursor Glow、Magnetic Cards、Glass Morphism、微动效系统。</p>
      </div>
    </div>
  </div>
</section>

<div class="divider"></div>

<!-- Desktop Screens -->
<section>
  <div class="container">
    <div class="section-label">Desktop</div>
    <div class="section-title">桌面端完整界面</div>
    <div class="section-desc">1440×900 视口下的完整交易界面，左侧导航 + 主内容区。</div>

    <div class="screen-card">
      <img src="data:image/png;base64,{imgs['desktop-home']}" alt="Desktop Home">
      <div class="caption">首页 · 大盘指数 + 热门板块 + 排行榜</div>
    </div>

    <div class="screen-card">
      <img src="data:image/png;base64,{imgs['desktop-sector']}" alt="Desktop Sector">
      <div class="caption">板块详情 · 股票列表 + 排序筛选</div>
    </div>

    <div class="screen-card">
      <img src="data:image/png;base64,{imgs['desktop-trade']}" alt="Desktop Trade">
      <div class="caption">个股详情 · K线图 + 盘口 + 技术指标 + 资金流向</div>
    </div>

    <div class="screen-card">
      <img src="data:image/png;base64,{imgs['desktop-portfolio']}" alt="Desktop Portfolio">
      <div class="caption">持仓页 · 账户概览 + 持仓明细 + 资产趋势</div>
    </div>

    <div class="screen-card">
      <img src="data:image/png;base64,{imgs['desktop-settings']}" alt="Desktop Settings">
      <div class="caption">设置页 · 交易偏好 + 显示设置 + 安全设置</div>
    </div>
  </div>
</section>

<div class="divider"></div>

<!-- Mobile Screens -->
<section>
  <div class="container">
    <div class="section-label">Mobile</div>
    <div class="section-title">移动端原生适配</div>
    <div class="section-desc">390×844 视口下的移动端布局，独立排版而非桌面端压缩。底部导航、卡片式持仓、纵向交易页。</div>

    <div class="mobile-grid">
      <div class="mobile-frame">
        <img src="data:image/png;base64,{imgs['mobile-home']}" alt="Mobile Home">
      </div>
      <div class="mobile-frame">
        <img src="data:image/png;base64,{imgs['mobile-trade']}" alt="Mobile Trade">
      </div>
      <div class="mobile-frame">
        <img src="data:image/png;base64,{imgs['mobile-portfolio']}" alt="Mobile Portfolio">
      </div>
      <div class="mobile-frame">
        <img src="data:image/png;base64,{imgs['mobile-orders']}" alt="Mobile Orders">
      </div>
      <div class="mobile-frame">
        <img src="data:image/png;base64,{imgs['mobile-settings']}" alt="Mobile Settings">
      </div>
    </div>
  </div>
</section>

<div class="divider"></div>

<!-- Tech Stack -->
<section>
  <div class="container">
    <div class="section-label">技术栈</div>
    <div class="section-title">Built with</div>

    <div class="tech-row">
      <span class="tech-tag">Next.js 14</span>
      <span class="tech-tag">React 18</span>
      <span class="tech-tag">TypeScript</span>
      <span class="tech-tag">Tailwind CSS</span>
      <span class="tech-tag">Framer Motion</span>
      <span class="tech-tag">Canvas 2D</span>
      <span class="tech-tag">Vercel</span>
    </div>
  </div>
</section>

<footer>
  <div class="container">
    Nexus Trade · 模拟交易平台 · 所有数据均为虚拟数据 · 不涉及真实资金和证券
  </div>
</footer>

</body>
</html>"""

with open(out, "w", encoding="utf-8") as f:
    f.write(html)

size_mb = os.path.getsize(out) / 1024 / 1024
print(f"Written: {out} ({size_mb:.1f} MB)")
