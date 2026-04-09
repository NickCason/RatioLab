# GitHub Pages CI/CD — Design Spec

**Date:** 2026-04-09
**Status:** Approved

---

## Goal

Eliminate manual `dist/` commits and deploy automatically on every push to `master`. Serve the site at both `www.themotion.guru` (custom domain) and `nickcason.github.io/ratiolab` (GitHub Pages URL, redirects to custom domain).

---

## Context

- DNS is already configured: Porkbun Quick DNS Config has a CNAME pointing `www.themotion.guru` → `nickcason.github.io`
- The existing workflow (`deploy-pages.yml`) incorrectly targets Netlify — replaced entirely
- `vite.config.js` has no `base` set (defaults to `/`) — correct for a custom-domain root deployment, no change needed
- `dist/` is currently committed to the repo — removed and gitignored

---

## Approach

**Native GitHub Pages Action** — use the official `actions/configure-pages`, `actions/upload-pages-artifact`, and `actions/deploy-pages` actions. No third-party services, no secrets required beyond the built-in `GITHUB_TOKEN`.

---

## Workflow Design

**File:** `.github/workflows/deploy-pages.yml`

**Triggers:**
- `push` to `master`
- `workflow_dispatch` (manual trigger retained)

**Concurrency:** cancel in-progress runs in the same group to avoid stale deploys.

**Jobs:**

### `build`
1. `actions/checkout@v4`
2. `actions/setup-node@v4` — Node 20, npm cache
3. `npm ci`
4. `npm run build`
5. `actions/upload-pages-artifact@v3` — uploads `dist/`

### `deploy`
- Depends on `build`
- Environment: `github-pages` (required by the deploy action)
- `actions/deploy-pages@v4`
- Outputs the deployed page URL

**Permissions required on the workflow:**
```yaml
permissions:
  contents: read
  pages: write
  id-token: write
```

---

## Repository Changes

| Change | Detail |
|--------|--------|
| `.github/workflows/deploy-pages.yml` | Rewrite — remove Netlify logic, implement native Pages action |
| `public/CNAME` | New file — single line: `www.themotion.guru` |
| `.gitignore` | Add `dist/` |
| `dist/` (tracked files) | Delete from git history (`git rm -r dist/`) |
| `vite.config.js` | No change — `base: '/'` default is correct |

---

## One-Time Manual Step

In the GitHub repository UI:
> **Settings → Pages → Build and deployment → Source → set to "GitHub Actions"**

This only needs to be done once. Without it, GitHub Pages won't pick up the Actions deployment.

---

## URL Behavior After Deployment

| URL | Behavior |
|-----|----------|
| `www.themotion.guru` | Served directly from GitHub Pages |
| `nickcason.github.io/ratiolab` | GitHub redirects to `www.themotion.guru` |

---

## What Is Removed

- All Netlify deployment logic from the workflow
- Committed `dist/` build artifacts
- `NETLIFY_AUTH_TOKEN` and `NETLIFY_SITE_ID` secrets (optional cleanup in GitHub repo settings)

---

## Out of Scope

- Preview deployments on pull requests
- Branch deploys
- Environment-specific builds
