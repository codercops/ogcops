# Release Process

This document describes the step-by-step process for creating a production release of OGCOPS.

## Branch Strategy

```
feature branches → PR to dev (upstream) → merge → PR to production → merge → release → sync back to dev
```

| Branch | Purpose |
|--------|---------|
| `dev` | Default branch. All feature PRs target this branch. |
| `production` | Stable release branch. Only accepts PRs from `dev`. |

## Versioning

We follow [Semantic Versioning](https://semver.org/):

- **`patch`** (1.0.0 → 1.0.1): Bug fixes, minor CSS tweaks
- **`minor`** (1.0.0 → 1.1.0): New features, new templates, UI improvements
- **`major`** (1.0.0 → 2.0.0): Breaking API changes, major redesigns

## Pre-Release Checklist

- [ ] All feature PRs merged into `dev`
- [ ] `npm run check` passes (TypeScript + Astro type-check)
- [ ] `npm run test` passes
- [ ] `npm run build` succeeds
- [ ] Manual testing on desktop and mobile
- [ ] No unresolved critical issues

## Release Steps

### 1. Verify dev is clean

```bash
cd ogcops
git fetch upstream
git checkout dev
git pull upstream dev
npm run check && npm run test && npm run build
```

### 2. Create a release PR (dev → production)

```bash
gh pr create \
  --repo codercops/ogcops \
  --head dev \
  --base production \
  --title "release: vX.Y.Z — Short description" \
  --body "$(cat <<'EOF'
## Release vX.Y.Z

Brief summary of what's in this release.

### Fixes
- ...

### Enhancements
- ...

### Docs & Chores
- ...

### Test Plan
- [ ] ...

EOF
)"
```

### 3. Review and merge the PR

- Ensure CI passes on the PR
- Review the diff one final time
- **Squash and merge** into `production`

### 4. Create the GitHub Release

```bash
gh release create vX.Y.Z \
  --repo codercops/ogcops \
  --target production \
  --title "vX.Y.Z — Short description" \
  --notes "$(cat <<'EOF'
## What's Changed

### Fixes
- ...

### Enhancements
- ...

### Docs & Chores
- ...

**Full Changelog**: https://github.com/codercops/ogcops/compare/vPREVIOUS...vX.Y.Z

EOF
)"
```

### 5. Sync production back into dev

Since `dev` has branch protection, create a sync PR:

```bash
gh pr create \
  --repo codercops/ogcops \
  --head production \
  --base dev \
  --title "chore: sync production into dev after vX.Y.Z release" \
  --body "Syncs production back into dev after the [vX.Y.Z release](https://github.com/codercops/ogcops/releases/tag/vX.Y.Z)."
```

Then **merge** this PR (use regular merge, NOT squash, to keep history aligned).

### 6. Update your fork

```bash
git fetch upstream
git checkout dev
git pull upstream dev
git push origin dev
```

## Quick Reference (Copy-Paste)

Replace `X.Y.Z` with the actual version and `PREVIOUS` with the last release tag.

```bash
# Step 1: Verify
npm run check && npm run test && npm run build

# Step 2: Release PR
gh pr create --repo codercops/ogcops --head dev --base production \
  --title "release: vX.Y.Z — Description"

# Step 3: Merge the PR on GitHub (squash and merge)

# Step 4: Create release
gh release create vX.Y.Z --repo codercops/ogcops --target production \
  --title "vX.Y.Z — Description" --generate-notes

# Step 5: Sync PR
gh pr create --repo codercops/ogcops --head production --base dev \
  --title "chore: sync production into dev after vX.Y.Z release"

# Step 6: Merge the sync PR on GitHub (regular merge, NOT squash)

# Step 7: Update fork
git fetch upstream && git checkout dev && git pull upstream dev && git push origin dev
```

## Notes

- The `pr-target-check.yml` workflow enforces that only `dev` can PR into `production`.
- CI runs on all PRs to both `dev` and `production` branches.
- Vercel auto-deploys `production` after merge.
- Use `--generate-notes` flag on `gh release create` to auto-generate changelog from commits.
