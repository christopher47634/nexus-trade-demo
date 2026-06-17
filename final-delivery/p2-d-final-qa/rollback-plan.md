# Rollback Plan — P2-D to P1-G

## Scenario
P2-D 视觉不满意或线上有问题，需要恢复到 P1-G 稳定版。

## 方案一：Vercel 重新部署 main 分支（推荐）

```bash
cd ~/stock-trading-demo
git checkout main
vercel --token <TOKEN> --yes --prod
```

main 分支仍保留 p1-g-online 完整代码，未被 p2-visual-lab 覆盖。
部署后 Production 立即回到 P1-G 版本。

## 方案二：Feature Flag 关闭 Canvas

在 Vercel 项目设置中：
- Environment Variables → 添加 `NEXT_PUBLIC_ENABLE_CANVAS_VISUALS` = `false`
- 重新部署

效果：所有 Canvas 视觉关闭，回退到 P1 静态渐变/纹理背景。
不影响其他功能，秒级生效。

## 方案三：Vercel Deployment 回滚

1. 打开 Vercel Dashboard → stock-trading-demo → Deployments
2. 找到 p1-g-online 对应的部署（约 3 小时前）
3. 点击 ⋯ → Promote to Production

## 回滚验证

回滚后验证：
- `https://stock-trading-demo.vercel.app/` 返回 200
- 首页无 Canvas 背景（纯静态渐变）
- /visual-lab 不存在或 404
- Demo Mode 正常
- 交易链路正常

## 当前状态

| 项目 | 状态 |
|------|------|
| Production | p2-visual-lab 分支内容 |
| main 分支 | P1-G 稳定版（未被覆盖） |
| p2-visual-lab 分支 | P2-D 最新代码 |
| Feature Flag | NEXT_PUBLIC_ENABLE_CANVAS_VISUALS=true |
