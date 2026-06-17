# P4-A Rollback Plan

**日期:** 2026-06-18
**当前版本:** v4-a-trading-product-reality (main @ 7e7112e)
**回滚目标:** v3-c-terminal-visual-closeout (367f15a)

---

## 方案一: Git Revert（推荐）

保留完整历史，安全可逆。

```bash
cd ~/stock-trading-demo
git checkout main
git revert HEAD --no-edit
git push origin main
```

Vercel 会自动部署 revert commit。

**回滚后验证:**
```bash
npm run build    # 必须通过
npm run lint     # 必须通过
```

---

## 方案二: Git Reset（紧急）

丢弃 P4-A 全部 commit，直接回退到 V3 tag。

```bash
cd ~/stock-trading-demo
git checkout main
git reset --hard v3-c-terminal-visual-closeout
git push origin main --force
```

**⚠️ 注意:** force push 会改写远程历史，仅在紧急情况下使用。

---

## 回滚影响范围

| 文件类型 | 回滚影响 |
|----------|----------|
| src/mock/*.ts | 数据恢复为静态随机值，失去逻辑关联 |
| src/components/stock/TradePanel.tsx | 恢复为简单买入/卖出表单 |
| src/app/orders/page.tsx | 恢复为基本订单列表 |
| src/app/sectors/[sectorId]/page.tsx | 移除分析文案和风险徽章 |
| src/app/stocks/[stockCode]/page.tsx | 移除 MA 指标和风险提示 |
| src/components/ui/*.tsx | 新增组件被移除 |
| final-delivery/p4-a-* | 交付文档保留在 git 历史中 |

---

## 回滚后恢复

如果回滚后需要重新部署 P4-A:

```bash
cd ~/stock-trading-demo
git checkout main
git merge p4-a-trading-product-reality-pass --no-ff -m "feat: re-apply P4-A trading product reality"
git push origin main
```

---

## 联系人

如有问题，检查:
1. Vercel 部署日志: https://vercel.com/dashboard
2. GitHub Actions: https://github.com/christopher47634/nexus-trade-demo/actions
3. 本地 build: `npm run build`
