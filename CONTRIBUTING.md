# Contributing to OGCOPS

Thank you for your interest in contributing! OGCOPS is open source and welcomes contributions of all kinds.

## Ways to Contribute

- **New templates** — add OG image templates to existing or new categories
- **Bug fixes** — fix rendering issues, API bugs, or editor glitches
- **New features** — platform previews, editor improvements, API enhancements
- **Documentation** — improve README, API docs, or inline comments
- **Performance** — optimize rendering, bundle size, or load times
- **Tests** — increase coverage for templates, API, and utilities

## Prerequisites

- [Node.js](https://nodejs.org/) 20+ (22 recommended, see `.nvmrc`)
- npm 9+
- Git

## Development Setup

```bash
git clone https://github.com/codercops/ogcops.git
cd ogcops
npm install
npm run dev
```

Visit `http://localhost:4321` to see the app.

## Project Structure

```
src/
  templates/           # 109 OG image templates by category
    types.ts           # TemplateDefinition interface
    registry.ts        # Central template registry
    utils.ts           # Shared helpers (truncate, autoFontSize, etc.)
    blog/              # Blog templates
    product/           # Product templates
    ...                # 10 more category folders
  lib/                 # Core engine
    og-engine.ts       # Satori + resvg-wasm PNG generation
    font-loader.ts     # Font loading for satori
    meta-fetcher.ts    # URL meta tag fetching
    meta-analyzer.ts   # Meta tag analysis and scoring
    api-validation.ts  # Zod schemas for API validation
    platform-specs.ts  # Platform viewport dimensions
  components/
    editor/            # React islands for OG image editor
    preview/           # React islands for preview checker
    shared/            # Platform mockups, viewport switcher
  pages/               # Astro pages + API routes
    api/               # /api/og, /api/preview, /api/templates
  styles/              # CSS custom properties (no Tailwind)
tests/                 # Vitest test suites
public/fonts/          # Bundled .woff fonts (Inter, Playfair Display, JetBrains Mono)
```

## Adding a Template

1. Create a new file in `src/templates/{category}/` following kebab-case naming: `my-template-name.ts`
2. Export a `TemplateDefinition` object as the default export
3. Register it in `src/templates/{category}/index.ts`
4. Add the import and registration in `src/templates/registry.ts`
5. Run `npm run test` to verify it renders without errors

Use `src/templates/blog/minimal-dark.ts` as a reference implementation.

### Template Guidelines

- Canvas is always 1200x630px
- Use only inline styles (no CSS classes in satori elements)
- Every container `div` must have `display: 'flex'` in its style
- Available fonts: Inter, Playfair Display, JetBrains Mono
- Use `truncate()` and `autoFontSize()` helpers from `../utils`
- Use `commonFields` where applicable for consistent field definitions
- Make the template visually distinct and professional

## Commit Conventions

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(templates): add neon-gradient blog template
fix(api): handle missing title parameter gracefully
docs: update API examples in README
refactor(editor): extract color picker into shared component
test(templates): add snapshot tests for podcast category
chore: update dependencies
```

## Code Style

- **CSS:** Custom properties only, no Tailwind
- **TypeScript:** Strict mode enabled
- **Templates:** Inline styles only in satori elements (no CSS classes)
- **Satori:** Every `div` needs explicit `display: 'flex'`
- **Utilities:** Use shared helpers from `src/templates/utils.ts`
- **Path alias:** `@/*` maps to `src/*`

## Testing

```bash
npm run test         # Run all tests
npm run test:watch   # Watch mode
npm run check        # Type-check (astro check + tsc)
npm run build        # Full production build
```

## Pull Request Process

1. Fork the repo and create a branch: `git checkout -b feat/my-feature`
2. Make your changes
3. Ensure `npm run check` and `npm run test` pass
4. Push and open a PR against `main`
5. Fill out the [PR template](.github/PULL_REQUEST_TEMPLATE.md) — screenshots are required for visual changes
6. Wait for review

### PR Tips

- Keep PRs focused on a single change
- Link related issues with "Closes #123"
- For new templates, include a screenshot of the rendered output

## Issue Guidelines

- Check [existing issues](https://github.com/codercops/ogcops/issues) before opening a new one
- Use the appropriate template: [Bug Report](.github/ISSUE_TEMPLATE/bug-report.md), [Feature Request](.github/ISSUE_TEMPLATE/feature-request.md), or [Template Request](.github/ISSUE_TEMPLATE/template-request.md)

## No CLA Required

Just submit your PR. By contributing, you agree that your contribution is licensed under the [MIT License](LICENSE).
