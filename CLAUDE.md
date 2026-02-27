# CLAUDE.md — OGCOPS

## What is this?
OGCOPS is a free, open-source OG image generator and social media preview checker. Built with Astro + React Islands, deployed to Vercel.

## Commands
```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run preview      # Preview production build
npm run test         # Run vitest
npm run test:watch   # Watch mode
npm run check        # Type-check (astro check + tsc)
```

## Architecture
- **Astro SSR** for pages and API endpoints
- **React Islands** (`client:load`) for interactive editor and preview checker
- **Satori** runs client-side for instant SVG preview (zero server calls during editing)
- **Satori + resvg-wasm** runs server-side for PNG generation (`/api/og`)
- **No database** — state lives in URL query params + client-side useReducer
- **CORS-open API** for developer use

## Key Directories
- `src/templates/` — 120 templates across 12 categories. Each template is a `.ts` file exporting a `TemplateDefinition`.
- `src/lib/` — Core engine (og-engine.ts, font-loader.ts, meta-fetcher.ts, meta-analyzer.ts)
- `src/components/editor/` — React components for the OG image editor
- `src/components/preview/` — React components for the social media preview checker
- `src/pages/api/` — API endpoints (og, preview, templates)

## Conventions
- CSS custom properties only (no Tailwind). Accent: `#E07A5F`.
- TypeScript strict mode. Path alias `@/*` → `src/*`.
- Fonts bundled as `.woff` in `public/fonts/`.
- Templates follow `TemplateDefinition` interface in `src/templates/types.ts`.

## Template Contribution
1. Create `src/templates/{category}/{id}.ts`
2. Export a `TemplateDefinition`
3. Register in `src/templates/{category}/index.ts`
4. Run `npm run test` to verify
