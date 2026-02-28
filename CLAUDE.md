# CLAUDE.md — OGCOPS

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What is this?
OGCOPS is a free, open-source OG image generator and social media preview checker. Built with Astro SSR + React Islands, deployed to Vercel at og.codercops.com. GitHub: github.com/codercops/ogcops. MIT licensed.

## Commands
```bash
npm run dev              # Start dev server (port 4321)
npm run build            # Production build
npm run preview          # Preview production build
npm run test             # Run vitest (single run)
npm run test:watch       # Watch mode
npm run test:ui          # Vitest UI
npm run check            # Type-check (astro check + tsc --noEmit)
npm run lint             # Astro linting
npm run generate:favicons  # Generate favicon assets
```

## Architecture
- **Astro SSR** for pages and API endpoints
- **React Islands** (`client:load`) for interactive editor and preview checker
- **Satori** runs client-side for instant SVG preview (zero server calls during editing)
- **Satori + resvg-wasm** runs server-side for PNG generation (`/api/og`)
- **No database** — state lives in URL query params + client-side useReducer
- **CORS-open API** — no API key, no rate limits

## Key Directories
- `src/templates/` — 120 templates across 12 categories. Each is a `.ts` file exporting a `TemplateDefinition`.
- `src/lib/` — Core engine (og-engine.ts, font-loader.ts, meta-fetcher.ts, meta-analyzer.ts, api-validation.ts)
- `src/components/editor/` — React components for the OG image editor
- `src/components/preview/` — React components for the social media preview checker
- `src/pages/api/` — API endpoints
- `src/styles/` — CSS files (global.css, editor.css, preview.css, api-docs.css)
- `public/fonts/` — Bundled .woff fonts (Inter, Playfair Display, JetBrains Mono)
- `tests/` — Vitest tests (api/, lib/, templates/)

## Pages & API Endpoints

**Pages:**
- `/` — Homepage
- `/create/` — OG image editor
- `/templates` — Template gallery
- `/preview` — Social media preview checker
- `/api-docs` — API documentation

**API (all CORS-open, no auth):**
- `GET /api/og?template={id}&...` — Generate PNG (1200x630, 24h cache)
- `GET /api/preview?url={url}` — Fetch and analyze a URL's meta tags
- `GET /api/templates` — List all templates as JSON
- `GET /api/templates/[id]/thumbnail.png` — Template thumbnail (1-week cache)

## Reference Files
- Template interface: `src/templates/types.ts`
- Reference template: `src/templates/blog/minimal-dark.ts`
- Shared utilities: `src/templates/utils.ts` (truncate, autoFontSize, commonFields)
- OG engine: `src/lib/og-engine.ts`
- API validation schemas: `src/lib/api-validation.ts`
- Template registry: `src/templates/registry.ts`

## Template System

120 templates across 12 categories: blog, product, saas, github, event, podcast, developer, newsletter, quote, ecommerce, job, tutorial.

**Adding a template:**
1. Create `src/templates/{category}/{id}.ts` exporting a `TemplateDefinition`
2. Register in `src/templates/{category}/index.ts`
3. Add import + registration in `src/templates/registry.ts`
4. Run `npm run test` to verify

**Template field types:** text, textarea, color, select, number, toggle, image.
**Field groups:** Content, Style, Brand.

## Conventions
- CSS custom properties only (no Tailwind). Accent: `#E07A5F`.
- TypeScript strict mode. Path alias `@/*` → `src/*`.
- Fonts bundled as `.woff` in `public/fonts/` (Inter Regular/Medium/SemiBold/Bold, Playfair Display Regular/Bold, JetBrains Mono Regular/Bold).
- Node 22 (`.nvmrc`).
- Testing: Vitest with node environment. Tests in `tests/**/*.test.ts`. Globals enabled.

## CI/CD
- Runs on push to `production`/`dev` and PRs to those branches
- Steps: `npm run check` → `npm run test` → `npm run build`
- **Branch strategy:** `dev` is the default branch. PRs target `dev`. Releases go `dev` → `production`. Direct PRs to `production` are blocked unless from `dev`.

## Environment Variables (`.env.local`, all optional)
- `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` — Optional visitor counter

## Gotchas / Constraints
- Satori does **not** support CSS grid — only flexbox
- Every `div` must have `display: 'flex'` explicitly in its style
- No CSS classes in satori JSX — inline styles only
- Font files must be listed in `astro.config.mjs` `includeFiles` array for Vercel deployment
- WASM imports need `optimizeDeps.exclude` in the Vite config
- `renderToPng` returns `ArrayBuffer` (not `Buffer`) for `BodyInit` compatibility
- Canvas is always 1200x630px

## Do NOT
- Add Tailwind CSS — the project uses CSS custom properties only
- Add a database — state lives in URL params, no persistence by design
- Add new fonts without updating `astro.config.mjs` `includeFiles`
- Use CSS classes in satori render functions — inline styles only
