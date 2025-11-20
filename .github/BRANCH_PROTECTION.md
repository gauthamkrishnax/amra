# 🔒 Branch Protection Guidelines

## Overview

The `PROD` branch contains production-ready code deployed to Netlify. This guide covers all security measures, workflows, and best practices.

## 🔒 Protection Rules

1. **No Direct Pushes**
   - Direct commits to PROD are prohibited
   - All changes must go through Pull Requests

2. **Required Status Checks**
   - ✅ ESLint must pass
   - ✅ Prettier formatting check must pass
   - ✅ Security audit must pass
   - ✅ Production build must succeed
   - ✅ Commit message validation must pass

3. **Code Review Requirements**
   - Minimum 1 approving review required
   - Stale reviews should be dismissed on new commits

4. **Source Branch Requirements**
   - PRs to PROD should originate from `master` (stable releases)
   - Hotfixes can come from `hotfix/*` branches
   - Feature branches should NOT be merged directly to PROD

## 🚀 Deployment Workflow

```
Feature → master (via PR) → PROD (via PR) → Netlify
```

#### Normal Flow:

1. Create feature branch from `master`
2. Develop and test changes
3. Submit PR to `master`
4. After review and merge, changes are in `master`
5. When ready for production, create PR from `master` to `PROD`
6. Merge to `PROD` triggers Netlify deployment

#### Hotfix Flow:

1. Create `hotfix/*` branch from `PROD`
2. Make critical fix
3. Submit PR to `PROD` with "hotfix" label
4. After deployment, backport to `master`

## 🛡️ Security Measures

### Automated (CI/CD)

1. **Automated Security Scanning**
   - `pnpm audit` runs on every PR
   - Dependencies are checked for vulnerabilities
   - Moderate and above severity issues block merging

2. **Code Quality**
   - ESLint enforces code standards
   - Prettier ensures consistent formatting
   - Commit messages follow conventional commits

3. **Build Verification**
   - Production build must succeed
   - Ensures no build-time errors
   - Validates all dependencies resolve correctly

### Local (Husky Hooks)

1. **Pre-commit Hook**
   - Runs ESLint automatically
   - Formats code with Prettier
   - Ensures clean commits

2. **Pre-push Hook**
   - Blocks direct pushes to `master` and `PROD`
   - Runs security audit on all pushes
   - Catches vulnerabilities before they reach remote
   - Provides guidance for PROD deployment

3. **Commit Message Hook**
   - Validates conventional commit format
   - Ensures consistent commit history

## 🔧 Setting Up GitHub Branch Protection

To enable these rules in GitHub:

1. Go to **Settings** → **Branches**
2. Add rule for `PROD` branch
3. Enable the following:
   - ✅ Require a pull request before merging
     - ✅ Require approvals (1+)
     - ✅ Dismiss stale pull request approvals when new commits are pushed
   - ✅ Require status checks to pass before merging
     - ✅ Require branches to be up to date before merging
     - Add status checks:
       - `🛡️ Security & Quality Gates`
   - ✅ Require conversation resolution before merging
   - ✅ Do not allow bypassing the above settings
   - ✅ Restrict who can push to matching branches (optional)

## 📞 Emergency Procedures

In case of critical production issues:

1. Create hotfix branch from PROD
2. Make minimal changes to fix the issue
3. Follow expedited review process
4. Deploy immediately after approval
5. Document the incident
6. Schedule post-mortem review

## 🎓 Quick Reference Commands

```bash
# Pre-deployment checks (run locally)
pnpm run security:check   # Full security validation
pnpm run prod:verify      # Complete pre-deployment check

# Individual checks
pnpm run security:audit   # Check for vulnerabilities
pnpm lint                 # Run linter
pnpm run format:check     # Check formatting
pnpm build                # Test production build

# Development
pnpm dev                  # Start dev server
pnpm format               # Auto-format code
```

## 📊 Monitoring

- **Netlify Status**: [![Netlify Status](https://api.netlify.com/api/v1/badges/e5c9effb-747f-4864-b61e-c04bc22384a2/deploy-status)](https://app.netlify.com/projects/amralove/deploys)
- **GitHub Actions**: Repository → Actions tab
- **Deploy History**: [Netlify Dashboard](https://app.netlify.com/projects/amralove/deploys)

## 📚 Additional Resources

- [GitHub Branch Protection Documentation](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
- [Netlify Deploy Documentation](https://docs.netlify.com/site-deploys/overview/)
- [Next.js Production Best Practices](https://nextjs.org/docs/deployment)
