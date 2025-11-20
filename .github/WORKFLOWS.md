# 🚀 GitHub Workflows Documentation

This document describes all the automated workflows set up for this project.

## 📋 Overview

Our CI/CD pipeline includes three main workflows:

1. **CI - Lint & Format** - Ensures code quality on PRs to `master` and `PROD`
2. **PROD Branch Protection** - Enhanced security checks for production deployments
3. **Auto Label PR** - Automatically categorizes PRs

---

## 🔍 Workflow Details

### 1. 🚀 CI - Lint & Format (`ci.yml`)

**Triggers:** Pull requests to `master` and `PROD` branches

**Jobs:**

- **🧹 ESLint Check** - Validates code follows linting rules
- **💅 Prettier Format Check** - Ensures consistent code formatting
- **📝 Commit Message Check** - Validates conventional commit messages

**Requirements:**

- All ESLint rules must pass
- Code must be formatted with Prettier
- Commit messages must follow conventional commits format

**How to fix failures:**

```bash
# Fix linting issues
pnpm lint

# Fix formatting
pnpm format
```

---

### 2. 🔒 PROD Branch Protection (`prod-protection.yml`)

**Triggers:** Pull requests to `PROD` branch

**Purpose:** Provides enhanced security and quality checks before deploying to production on Netlify.

**Jobs:**

#### 🛡️ Security & Quality Gates

- **🔍 Security Audit** - Runs `pnpm audit` to detect vulnerable dependencies (blocks on moderate+ severity)
- **🧹 ESLint Check** - Validates code quality
- **💅 Prettier Format Check** - Ensures consistent formatting
- **🏗️ Build Check** - Validates production build succeeds

**Why it's critical:**

- Prevents vulnerable dependencies from reaching production
- Ensures production builds work before deployment
- Provides a safety net for critical deployments
- Documents deployment requirements

**How to fix failures:**

```bash
# Run full security check locally
pnpm run prod:verify

# Fix specific issues
pnpm run security:audit  # Check dependencies
pnpm run lint            # Fix linting
pnpm run format          # Fix formatting
pnpm run build           # Test production build
```

**Production Deployment Workflow:**

```
Feature Branch → PR to master → Review & Merge
       ↓
   master → PR to PROD → Security Checks → Review → Merge
       ↓
   Netlify Auto-Deploy
```

**See Also:**

- [Branch Protection Guidelines](.github/BRANCH_PROTECTION.md)

---

### 3. 🏷️ Auto Label PR (`pr-labeler.yml`)

**Triggers:** PR opened, synchronized, or reopened

**What it does:**

1. **Labels by file paths** - Automatically adds labels based on which files were changed:
   - 📱 `frontend` - Changes in `src/app/` or `src/ui/`
   - 🎨 `styling` - Changes in CSS or Tailwind config
   - 📦 `dependencies` - Changes in `package.json` or lock files
   - 🔧 `config` - Changes in config files
   - 📚 `documentation` - Changes in markdown files
   - 🔄 `workflows` - Changes in `.github/`
   - 📄 `content` - Changes in `src/content/`

2. **Labels by PR size** - Adds size labels based on total lines changed:
   - 🟢 `size/XS` - Less than 10 lines
   - 🟢 `size/S` - 10-49 lines
   - 🟡 `size/M` - 50-199 lines
   - 🟠 `size/L` - 200-499 lines
   - 🔴 `size/XL` - 500+ lines (adds a warning comment)

**Why it's useful:**

- Quick visual understanding of what the PR changes
- Helps prioritize reviews (smaller PRs first)
- Encourages better PR practices

---

## 🎨 Required GitHub Labels

To use these workflows, create these labels in your GitHub repository:

### Size Labels

| Label     | Color     | Description                      |
| --------- | --------- | -------------------------------- |
| `size/XS` | `#00ff00` | Tiny changes (<10 lines)         |
| `size/S`  | `#7fff00` | Small changes (10-49 lines)      |
| `size/M`  | `#ffff00` | Medium changes (50-199 lines)    |
| `size/L`  | `#ff7f00` | Large changes (200-499 lines)    |
| `size/XL` | `#ff0000` | Extra large changes (500+ lines) |

### Category Labels

| Label              | Color     | Description             |
| ------------------ | --------- | ----------------------- |
| `📱 frontend`      | `#0052cc` | Frontend code changes   |
| `🎨 styling`       | `#e4e669` | CSS/styling changes     |
| `📦 dependencies`  | `#0366d6` | Dependency updates      |
| `🔧 config`        | `#d4c5f9` | Configuration changes   |
| `📚 documentation` | `#0075ca` | Documentation updates   |
| `🔄 workflows`     | `#000000` | GitHub workflow changes |
| `📄 content`       | `#6f42c1` | Content changes         |
| `🚀 deployment`    | `#fbca04` | Production deployment   |
| `🐛 hotfix`        | `#d73a4a` | Critical production fix |
| `🔒 security`      | `#ee0701` | Security-related        |

### How to create labels:

1. Go to your GitHub repository
2. Click on **Issues** → **Labels**
3. Click **New label**
4. Enter the name (with emoji), hex color, and description
5. Click **Create label**

Or use the GitHub CLI:

```bash
gh label create "size/XS" --color "00ff00" --description "Tiny changes"
gh label create "size/S" --color "7fff00" --description "Small changes"
gh label create "size/M" --color "ffff00" --description "Medium changes"
gh label create "size/L" --color "ff7f00" --description "Large changes"
gh label create "size/XL" --color "ff0000" --description "Extra large changes"
gh label create "📱 frontend" --color "0052cc" --description "Frontend code changes"
gh label create "🎨 styling" --color "e4e669" --description "CSS/styling changes"
gh label create "📦 dependencies" --color "0366d6" --description "Dependency updates"
gh label create "🔧 config" --color "d4c5f9" --description "Configuration changes"
gh label create "📚 documentation" --color "0075ca" --description "Documentation updates"
gh label create "🔄 workflows" --color "000000" --description "GitHub workflow changes"
gh label create "📄 content" --color "6f42c1" --description "Content changes"
gh label create "🚀 deployment" --color "fbca04" --description "Production deployment"
gh label create "🐛 hotfix" --color "d73a4a" --description "Critical production fix"
gh label create "🔒 security" --color "ee0701" --description "Security-related"
```

---

## 🚀 Getting Started

1. **Push these workflow files to your repository:**

   ```bash
   git add .github/
   git commit -m "ci: add GitHub workflows for CI/CD"
   git push
   ```

2. **Create the required labels** (see section above)

3. **Create a test PR** to see the workflows in action!

---

## 🔧 Customization

### Adjusting PR Size Thresholds

Edit `.github/workflows/pr-labeler.yml` and modify these values:

```javascript
if (totalChanges < 10) sizeLabel = "size/XS";
else if (totalChanges < 50) sizeLabel = "size/S";
else if (totalChanges < 200) sizeLabel = "size/M";
else if (totalChanges < 500) sizeLabel = "size/L";
else sizeLabel = "size/XL";
```

### Adding More File Categories

Edit `.github/labeler.yml` and add new patterns:

```yaml
"🎯 your-label":
  - changed-files:
      - any-glob-to-any-file: "your/path/**/*"
```

---

## 📊 Monitoring Workflows

- View workflow runs: Go to **Actions** tab in your GitHub repository
- Check individual workflow status: Click on any workflow run
- View logs: Click on specific jobs to see detailed logs

---

## 🐛 Troubleshooting

### Workflows not running?

- Make sure workflows are enabled in your repository settings
- Check that you've pushed the `.github/workflows/` files to GitHub
- Verify you're creating PRs to the correct branch:
  - `ci.yml` runs on PRs to `master` and `PROD`
  - `prod-protection.yml` runs only on PRs to `PROD`
  - `pr-labeler.yml` runs on all PRs

### Labels not being applied?

- Ensure the labels exist in your repository
- Check workflow permissions in repository settings
- Review workflow logs in the Actions tab

### CI checks failing?

- Run `pnpm lint` locally to check for linting issues
- Run `pnpm format` to fix formatting
- Check commit messages follow conventional commits

---

## 🔐 PROD Branch Security

For deploying to the `PROD` branch (Netlify production):

1. **Required Checks:**
   - All CI checks must pass
   - Security audit must pass
   - Production build must succeed
   - Code review required

2. **Best Practices:**
   - Always create PRs from `master` to `PROD`
   - Run `pnpm run prod:verify` locally before creating PR
   - Have rollback plan ready

3. **Documentation:**
   - [Branch Protection Guide](.github/BRANCH_PROTECTION.md)
   - [Netlify Deployment Status](https://app.netlify.com/projects/amralove/deploys)

## 📚 Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitHub Branch Protection](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches)
- [Netlify Deploy Documentation](https://docs.netlify.com/site-deploys/overview/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)

---

**Questions or issues?** Open an issue or contact the maintainers!
