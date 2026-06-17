# 部署指南

## 本地运行
npm install
npm run build
npx next start -p 3458

## Vercel 部署
1. Push to GitHub
2. Import project on vercel.com
3. Framework: Next.js (auto-detected)
4. Build command: npm run build (default)
5. Output: .next (default)
6. No environment variables needed
7. Deploy

## 说明
- 所有数据为 Mock 数据
- 订单存储在浏览器 localStorage (key: nexus-trade-orders)
- 不需要数据库
- 不需要 API key
- 无服务端依赖
