# Amra ❤️

[![Netlify Status](https://api.netlify.com/api/v1/badges/e5c9effb-747f-4864-b61e-c04bc22384a2/deploy-status)](https://app.netlify.com/projects/amralove/deploys)

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deployment

### Production

The `PROD` branch is automatically deployed to [Netlify](https://app.netlify.com/projects/amralove/deploys).

**Security:** All changes require PR review, pass security audits, and complete CI checks. See [Branch Protection Guide](.github/BRANCH_PROTECTION.md) for details.

### Development

The `master` branch is for active development. Create feature branches from `master` and submit PRs.

## Contributing

1. Create feature branch from `master`
2. Make your changes (pre-commit hooks auto-format code)
3. Push (security checks run automatically)
4. Submit PR to `master`
5. After merge, promote to `PROD` via PR when ready to deploy

**Pre-deployment check:**

```bash
pnpm run prod:verify  # Runs security audit, lint, format check, and build
```

## Documentation

- [Branch Protection & Deployment](.github/BRANCH_PROTECTION.md)
- [GitHub Workflows](.github/WORKFLOWS.md)
