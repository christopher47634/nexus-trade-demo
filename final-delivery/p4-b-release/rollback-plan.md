# P4-B Rollback Plan

**日期:** 2026-06-18
**版本:** V4-B Cleanup & Stability

---

## 回滚触发条件

- 移动端溢出修复导致桌面端布局异常
- 删除重复组件导致页面报错
- Build 或 Lint 失败
- 任何功能退化

---

## 回滚方案

### 方案 1: Git Revert (推荐)

```bash
# 回到 main 分支
git checkout main

# revert P4-B merge commit
git revert HEAD --no-edit

# push
git push origin main
```

这会创建一个新 commit 撤销 P4-B 的所有改动，保留历史记录。

### 方案 2: 回退到 V4-A tag

```bash
# 回到 main 分支
git checkout main

# 重置到 V4-A tag
git reset --hard v4-a-trading-product-reality

# 强制 push (谨慎使用)
git push origin main --force
```

**注意:** 方案 2 会丢失 V4 Release Freeze 和 P4-B 的所有 commit。

### 方案 3: 删除 P4-B 分支

```bash
# 删除本地分支
git branch -D p4-b-cleanup-stability

# 删除远程分支
git push origin --delete p4-b-cleanup-stability

# 删除 tag
git tag -d v4-b-cleanup-stability
git push origin --delete v4-b-cleanup-stability
```

---

## 回滚后验证

1. `npm run build` 通过
2. `npm run lint` 通过
3. 桌面端首页正常
4. 移动端首页正常
5. 10 个行业板块正常
6. 交易流程正常

---

## 影响范围

P4-B 仅修改 2 个文件：

| 文件 | 改动 | 风险 |
|------|------|------|
| src/components/layout/DesktopShell.tsx | 添加 min-w-0 overflow-hidden | 低 |
| src/components/ui/EmptyState.tsx | 删除 (0 引用) | 无 |
| src/components/ui/ErrorState.tsx | 删除 (0 引用) | 无 |

回滚影响范围小，风险低。
