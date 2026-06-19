# NexusTrade — Rollback Plan

## Quick Rollback (Vercel)

### Option 1: Vercel Dashboard Rollback (Recommended)

1. Go to https://vercel.com → stock-trading-demo project
2. Navigate to **Deployments** tab
3. Find the previous stable deployment
4. Click **⋯** (three dots) → **Promote to Production**
5. Confirm promotion

**Time to rollback:** ~30 seconds

### Option 2: Git Revert

```bash
cd ~/stock-trading-demo
git revert 838597f --no-edit
git push origin main
# Vercel auto-deploys the revert
```

**Time to rollback:** ~2-3 minutes (build + deploy)

### Option 3: Vercel CLI

```bash
# Install Vercel CLI if not installed
npm i -g vercel

# List deployments
vercel ls stock-trading-demo

# Promote specific deployment
vercel promote <deployment-url> --scope=<team>
```

## Rollback Triggers

| Trigger | Severity | Action |
|---------|----------|--------|
| Site completely down | Critical | Immediate Vercel rollback |
| Major rendering broken | High | Vercel rollback within 5 min |
| Trade panel non-functional | High | Git revert + push |
| Demo mode broken | Medium | Git revert in next window |
| Minor visual issues | Low | Hotfix branch |

## Pre-Rollback Checklist

- [ ] Confirm the issue is deployment-related (not network/cache)
- [ ] Check Vercel deployment logs for errors
- [ ] Verify the target rollback version is stable
- [ ] Notify stakeholders of rollback

## Post-Rollback Actions

1. Verify production URL loads correctly
2. Run smoke tests against rolled-back version
3. Create incident report if critical
4. Investigate root cause on staging
5. Fix and re-deploy with proper testing

## Current Stable References

| Reference | Value |
|-----------|-------|
| Production URL | https://stock-trading-demo.vercel.app |
| Main Commit | 838597f |
| Build ID | d8n02h2eBn04xpiTmias5 |
| Tags | v5-a3-demo-portfolio-story, v6-final-interaction-premium |

## Emergency Contacts

- Repository: GitHub (stock-trading-demo)
- Hosting: Vercel
- DNS: Managed by Vercel
