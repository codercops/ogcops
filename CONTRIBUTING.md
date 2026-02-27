# Contributing to OGCOPS

Thank you for your interest in contributing! OGCOPS is open source and welcomes contributions.

## Adding a Template

1. Create a new file in `src/templates/{category}/` following the naming convention: `kebab-case-name.ts`
2. Export a `TemplateDefinition` object as the default export
3. Register it in `src/templates/{category}/index.ts`
4. Add the import and registration in `src/templates/registry.ts`
5. Run `npm run test` to verify it renders without errors

### Template Guidelines

- Canvas is always 1200x630px
- Use only inline styles (no CSS classes in satori elements)
- Every container div must have `display: 'flex'` in its style
- Available fonts: Inter, Playfair Display, JetBrains Mono
- Use `truncate()` and `autoFontSize()` helpers from `../utils`
- Use `commonFields` where applicable for consistent field definitions
- Make the template visually distinct and professional

## Development

```bash
npm install
npm run dev          # Start dev server
npm run test         # Run tests
npm run check        # Type-check
npm run build        # Production build
```

## Pull Requests

- Keep PRs focused on a single change
- Include a screenshot for visual changes
- Ensure `npm run check` and `npm run test` pass
- Follow existing code style
