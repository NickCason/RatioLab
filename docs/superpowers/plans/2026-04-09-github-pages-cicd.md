# GitHub Pages CI/CD Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace manual `dist/` commits and a defunct Netlify workflow with a fully automated GitHub Actions → GitHub Pages pipeline that serves `www.themotion.guru` and `nickcason.github.io/ratiolab`.

**Architecture:** Two GitHub Actions jobs run on every push to `master`: `build` (npm ci → npm run build → upload artifact) and `deploy` (actions/deploy-pages consumes the artifact). A `public/CNAME` file tells GitHub Pages to bind the custom domain on every deploy. No secrets required — the built-in `GITHUB_TOKEN` handles authorization.

**Tech Stack:** GitHub Actions, `actions/upload-pages-artifact@v3`, `actions/deploy-pages@v4`, Vite 8, Node 20

> **Note on testing:** This project has no test suite (per README). There are no unit tests to write for CI/CD infrastructure. Verification for each task is done via git log and, for the final task, observing the GitHub Actions run succeed in the GitHub UI.

---

## File Map

| Action | Path | Purpose |
|--------|------|---------|
| Modify | `.github/workflows/deploy-pages.yml` | Replace Netlify logic with native GitHub Pages action |
| Create | `public/CNAME` | Custom domain binding — copied into `dist/` by Vite at build time |
| Modify | `.gitignore` | Add `dist/` so build artifacts are never committed |
| Delete (git) | `dist/` | Untrack committed build artifacts |

---

## Task 1: Untrack and ignore dist/

**Files:**
- Modify: `.gitignore`
- Delete from tracking: `dist/` (all contents)

- [ ] **Step 1: Remove dist/ from git tracking (keep files locally)**

```bash
cd C:/DevSpace/Work/ratiolab
git rm -r --cached dist/
```

Expected output: many lines like `rm 'dist/assets/...'` and `rm 'dist/index.html'` etc. The files remain on disk — `--cached` only removes them from git's index.

- [ ] **Step 2: Add dist/ to .gitignore**

Open `.gitignore`. After the existing `dist-ssr` line, add `dist/`:

```
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist-ssr
dist/
*.local
...
```

- [ ] **Step 3: Verify dist/ is no longer tracked**

```bash
git status
```

Expected: `dist/` files appear under "Untracked files" (not staged), and `.gitignore` appears under "Changes not staged for commit" or "Changes to be committed".

- [ ] **Step 4: Commit**

```bash
git add .gitignore
git commit -m "chore: untrack dist/ build artifacts and add to gitignore"
```

---

## Task 2: Add public/CNAME

**Files:**
- Create: `public/CNAME`

- [ ] **Step 1: Create the CNAME file**

Create `public/CNAME` with exactly this content (no trailing newline issues, just the domain):

```
www.themotion.guru
```

> **Why `public/` and not `dist/`?** Vite copies everything in `public/` into `dist/` at build time. Putting CNAME in `public/` means it's always present in the build artifact without being regenerated manually.

- [ ] **Step 2: Verify it will end up in the build**

```bash
cd C:/DevSpace/Work/ratiolab
npm run build
```

Then check:

```bash
cat dist/CNAME
```

Expected output: `www.themotion.guru`

- [ ] **Step 3: Commit**

```bash
git add public/CNAME
git commit -m "chore: add CNAME for www.themotion.guru custom domain"
```

---

## Task 3: Rewrite the GitHub Actions workflow

**Files:**
- Modify: `.github/workflows/deploy-pages.yml` (full rewrite)

- [ ] **Step 1: Replace the entire workflow file**

Overwrite `.github/workflows/deploy-pages.yml` with:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: ["master"]
  workflow_dispatch:

concurrency:
  group: "pages"
  cancel-in-progress: true

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Upload Pages artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: dist/

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Verify the file looks correct**

```bash
cat C:/DevSpace/Work/ratiolab/.github/workflows/deploy-pages.yml
```

Confirm: no mention of `netlify`, `NETLIFY_AUTH_TOKEN`, or `NETLIFY_SITE_ID`. Confirm `permissions` block is present at the top level.

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/deploy-pages.yml
git commit -m "ci: replace Netlify workflow with native GitHub Pages action"
```

---

## Task 4: Enable GitHub Pages in repo settings (manual)

This is a one-time UI step that cannot be done via code.

- [ ] **Step 1: Open repo settings**

Go to: `https://github.com/NickCason/ratiolab/settings/pages`

- [ ] **Step 2: Set source to GitHub Actions**

Under **Build and deployment → Source**, select **"GitHub Actions"** from the dropdown. Save.

> If this is already set to a branch (e.g. `master` or `gh-pages`), change it to "GitHub Actions". If it's already "GitHub Actions", no action needed.

- [ ] **Step 3: Set custom domain (if not already set)**

Still on the Pages settings page, under **Custom domain**, enter:

```
www.themotion.guru
```

Click Save. GitHub will verify DNS. This may take a few minutes. Check the "Enforce HTTPS" box once it appears (requires DNS verification to complete first).

---

## Task 5: Push and verify deployment

- [ ] **Step 1: Push all commits to master**

```bash
cd C:/DevSpace/Work/ratiolab
git push origin master
```

- [ ] **Step 2: Watch the Actions run**

Go to: `https://github.com/NickCason/ratiolab/actions`

You should see a workflow run titled "Deploy to GitHub Pages" triggered by your push. Click into it and confirm:
- `build` job: green
- `deploy` job: green
- The deploy job summary shows a URL like `https://www.themotion.guru`

- [ ] **Step 3: Verify both URLs work**

Open a browser:
1. `https://www.themotion.guru` — should load RatioLab normally
2. `https://nickcason.github.io/ratiolab` — should redirect to `www.themotion.guru`

- [ ] **Step 4: Verify dist/ is not in the repo**

```bash
git ls-files dist/
```

Expected output: *(empty)* — no files tracked under `dist/`.

---

## Optional Cleanup

After verifying deployment works, you can delete the unused Netlify secrets from GitHub:

Go to `https://github.com/NickCason/ratiolab/settings/secrets/actions` and delete:
- `NETLIFY_AUTH_TOKEN`
- `NETLIFY_SITE_ID`

These are inert after the workflow rewrite but leaving them is harmless.
