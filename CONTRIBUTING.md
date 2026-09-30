# Contributing to OGCOPS

Thank you for your interest in contributing! OGCOPS is open source and welcomes contributions of all kinds.

## Hacktoberfest 2026

We're taking part in Hacktoberfest this year, and first-time contributors are very welcome.

1. Pick an open issue labeled [`hacktoberfest`](https://github.com/codercops/ogcops/issues?q=is%3Aissue+is%3Aopen+label%3Ahacktoberfest+no%3Aassignee) or [`good first issue`](https://github.com/codercops/ogcops/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22+no%3Aassignee) that nobody is assigned to. New template ideas are listed in [#5](https://github.com/codercops/ogcops/issues/5).
2. Comment on it to ask for it. I'll assign it to you, usually within a day. Please don't start on an issue that's assigned to someone else.
3. Take one issue at a time. Once your PR is merged, grab the next one.
4. If you're assigned and there's no PR or update for 5 days, I'll free the issue up for someone else. Just comment if you need more time.
5. Open your PR against `dev` and put `Closes #<issue number>` in the description.

PRs count for Hacktoberfest once they're merged or labeled `hacktoberfest-accepted`. PRs that aren't linked to an issue, only reformat code, or change things nobody asked for will be closed, and spammy ones get the `spam` label. If you have an idea that isn't an issue yet, open an issue first so we can agree on it before you write code.

Stuck? Ask on the issue. Questions are welcome.

## Ways to Contribute

- **New templates:** add OG image templates to existing or new categories
- **Bug fixes:** fix rendering issues, API bugs, or editor glitches
- **New features:** platform previews, editor improvements, API enhancements
- **Documentation:** improve README, API docs, or inline comments
- **Performance:** optimize rendering, bundle size, or load times
- **Tests:** increase coverage for templates, API, and utilities

## Prerequisites

- [Node.js](https://nodejs.org/) 22+ (see `.nvmrc`; the Cloudflare tooling needs 22)
- npm 9+
- Git

## Development Setup

```bash
# Fork the repo on GitHub, then clone your fork
git clone https://github.com/<your-username>/ogcops.git
cd ogcops
git remote add upstream https://github.com/codercops/ogcops.git

# Branch off dev for every change
git checkout -b feat/my-template upstream/dev

npm install
npm run dev
```

Visit `http://localhost:4321` to see the app.

## Project Structure

```
src/
  templates/           # OG image templates by category
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
2. Export a `TemplateDefinition` object as the default export. The id must be `{category}-{file name}`, for example `blog/minimal-dark.ts` has the id `blog-minimal-dark`.
3. Re-export it from `src/templates/{category}/index.ts` (for consistency; nothing imports these files)
4. Import it in `src/templates/registry.ts` and add it to that category's array. This is the step that makes it show up. Append at the end of the block to keep merge conflicts small.
5. Run `npm run dev`, open `http://localhost:4321/create/{category}` and check your template with long text and with optional fields left empty
6. Run `npm run check` and `npm run test`

The tests check the template's shape and size but don't run Satori yet, so the live preview in step 5 is where layout problems show up. You don't need to update template counts in the README.

Use `src/templates/blog/minimal-dark.ts` as a reference implementation.

### Template Guidelines

- Canvas is always 1200x630px
- Use only inline styles (no CSS classes in satori elements)
- Every container `div` must have `display: 'flex'` in its style
- Available fonts: Inter (400/500/600/700), Playfair Display (400/700), JetBrains Mono (400/700)
- No emoji or remote images in defaults (no emoji font is bundled)
- Use `truncate()` and `autoFontSize()` helpers from `../utils`
- API params arrive as strings, so parse numbers and toggles defensively: `Number(params.x)`, `params.x === true || params.x === 'true'`
- No `Math.random()` or dates in `render`. Images are cached, so output must be deterministic.
- Give it a clear `description` and 4 to 6 `tags` (the editor search and AI template search use them)
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

1. Fork the repo and create a branch off `dev`: `git checkout -b feat/my-feature upstream/dev`
2. Make your changes
3. Ensure `npm run check` and `npm run test` pass
4. Push and open a PR against `dev`
5. Fill out the [PR template](.github/PULL_REQUEST_TEMPLATE.md). Screenshots are required for visual changes.
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
