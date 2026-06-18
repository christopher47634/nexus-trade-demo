# Rollback Plan — P5-A1

**日期:** 2026-06-18
**Tag:** v5-a1-readonly-portfolio
**Previous tag:** v4-b-production-ready

---

## 方案 1: Git Revert（推荐）

```bash
git checkout main
git revert HEAD --no-edit
git push origin main
```

Vercel 自动部署，回到 V4-B 状态。

---

## 方案 2: Git Reset

```bash
git checkout main
git reset --hard v4-b-production-ready
git push origin main --force
```

⚠️ 强制推送，影响其他协作者。

---

## 方案 3: Vercel Dashboard

1. 打开 Vercel Dashboard
2. 进 stock-trading-demo 项目
3. Deployments 找到 v4-b-production-ready 对应的 deployment
4. 点 Promote to Production

---

## 回滚影响

| 项目 | 回滚后 |
|------|--------|
| /portfolio | 404（页面删除） |
| /mobile/portfolio | 404（页面删除） |
| 首页资产概览 | 恢复硬编码 |
| TradePanel | 不受影响 |
| 订单页 | 不受影响 |
| Demo Mode | 不受影响 |

---

## 回滚后恢复

```bash
git checkout main
git merge v5-a1-readonly-portfolio --no-ff
git push origin main
```
