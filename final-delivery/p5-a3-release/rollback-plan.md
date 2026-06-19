# P5-A3 Rollback Plan

## 触发条件

如果 P5-A3 production 出现 Demo Mode 或 localStorage 污染问题, 按以下方案回滚.

## 方案 1: git revert merge commit (推荐)

```bash
git revert -m 1 166bbec
git push origin main
```

适用: 仅回退 P5-A3 变更, 保留 main 上其他提交.

## 方案 2: 回滚到上一个 release tag

```bash
git checkout v5-a2-trading-portfolio-linkage
git branch -f main v5-a2-trading-portfolio-linkage
git push origin main --force
```

适用: 需要完全回到 P5-A2 状态.

## 方案 3: Vercel 回滚

在 Vercel Dashboard → Deployments → 找到 P5-A2 的 deployment → Promote to Production.

适用: 不修改代码, 仅切换线上版本.
