# P5-A2 Rollback Plan

**日期**: 2026-06-18
**当前 tag**: v5-a2-trading-portfolio-linkage (commit 99f7232)
**回滚目标**: v4-b-cleanup-stability (commit a68b3f8) 或 v4-a-trading-product-reality (commit 0d916d5)

---

## 方案 1: Git Revert（推荐）

```bash
cd ~/stock-trading-demo
git checkout main
git revert 99f7232 --no-edit
npm run build
npm run lint
git push origin main
```

优点：保留历史，可随时 re-apply
缺点：会产生一个 revert commit

---

## 方案 2: Git Reset（破坏性）

```bash
cd ~/stock-trading-demo
git checkout main
git reset --hard a68b3f8  # 回到 v4-b-cleanup-stability
git push origin main --force
```

优点：干净回退
缺点：force push 会覆盖远程历史，需协调

---

## 方案 3: Vercel Dashboard 手动回滚

1. 打开 https://vercel.com/dashboard
2. 进 stock-trading-demo 项目 → Deployments
3. 找到 v4-b-cleanup-stability 对应的 deployment
4. 点 **⋯** → **Promote to Production**

优点：不改 git 历史，秒级生效
缺点：需要 Vercel Dashboard 权限

---

## 回滚影响评估

回滚后会丢失：
- trade-engine.ts（交易引擎）
- TradePanel 交易联动
- account-storage 改进
- PositionTable 8 列 grid 优化
- TransactionList flex row 优化
- P5-A2 全部交付物

回滚后保留：
- P4-B cleanup（min-w-0 overflow-hidden）
- P4-A trading product reality
- P3-C terminal visual closeout
- 所有 V4 功能

---

## 建议

优先使用方案 1（git revert），保留历史可追溯性。
如需秒级回滚，使用方案 3（Vercel Dashboard）。
