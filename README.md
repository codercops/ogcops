# OGCOPS

[![CI](https://github.com/codercops/ogcops/actions/workflows/ci.yml/badge.svg)](https://github.com/codercops/ogcops/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

> Free, open-source OG image generator. 109 templates, 8 platform previews, free API. No login, no watermarks.

**Live:** [og.codercops.com](https://og.codercops.com)

![OGCOPS](https://og.codercops.com/api/og?title=OGCOPS&template=blog-minimal-dark&description=Free+OG+Image+Generator+%E2%80%A2+109+Templates+%E2%80%A2+8+Platform+Previews+%E2%80%A2+Free+API&author=og.codercops.com)

## Why OGCOPS?

Most OG image generators require sign-up, add watermarks, impose rate limits, or lock templates behind paywalls.

OGCOPS is different:

- **Completely free** — no login, no watermarks, no rate limits
- **Open source** — MIT licensed, self-hostable, fully transparent
- **109 templates** — professional designs across 12 categories, ready to use
- **Instant preview** — client-side Satori rendering, zero server calls while editing
- **Developer-friendly API** — generate images via URL, CORS-enabled, no API key needed

## Features

- **109 Templates** across 12 categories: Blog, Product, SaaS, GitHub, Event, Podcast, Developer, Newsletter, Quote, E-commerce, Job, Tutorial
- **8 Platform Previews**: Twitter/X, Facebook, LinkedIn, Discord, Slack, Reddit, WhatsApp, Google Search — see exactly how your image looks on each platform
- **Free REST API**: Generate OG images via URL. CORS-enabled. No API key required.
- **Social Preview Checker**: Paste any URL to analyze its meta tags and see platform previews
- **Client-side Rendering**: Satori runs in the browser for instant preview during editing. Zero server calls while editing.
- **URL-based State**: All editor state is encoded in URL params — share or bookmark any configuration

## Quick Start

```bash
git clone https://github.com/codercops/ogcops.git
cd ogcops
npm install
npm run dev
```

Visit `http://localhost:4321` to start generating OG images.

## API

Generate an OG image:

```
GET https://og.codercops.com/api/og?title=Hello+World&template=blog-minimal-dark
```

Returns a `1200x630` PNG image. Pass any template field as a query parameter.

Check a URL's meta tags:

```
GET https://og.codercops.com/api/preview?url=https://example.com
```

List all templates:

```
GET https://og.codercops.com/api/templates
```

See [API documentation](https://og.codercops.com/api-docs) for full details, parameters, and response formats.

## Self-Hosting

OGCOPS requires no environment variables for basic usage. Deploy it anywhere that runs Node.js.

### Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fcodercops%2Fogcops)

### Manual Deployment

```bash
git clone https://github.com/codercops/ogcops.git
cd ogcops
npm install
npm run build
```

The build output in `dist/` can be deployed to any Node.js hosting platform.

## Template Categories

| Category | Count | Description |
|----------|-------|-------------|
| Blog | 12 | Blog posts, articles, editorial content |
| Product | 10 | Product announcements and launches |
| SaaS | 10 | SaaS products and landing pages |
| GitHub | 10 | Open source and GitHub projects |
| Event | 10 | Events, conferences, meetups |
| Podcast | 8 | Podcasts, videos, audio content |
| Developer | 9 | Developer profiles and portfolios |
| Newsletter | 8 | Newsletter issues and digests |
| Quote | 8 | Quotes and social media posts |
| E-commerce | 8 | Products, sales, commerce |
| Job | 8 | Job listings and hiring |
| Tutorial | 8 | Tutorials, courses, education |

## Tech Stack

- [Astro](https://astro.build) + [React](https://react.dev) Islands
- [Satori](https://github.com/vercel/satori) + [@resvg/resvg-wasm](https://github.com/nicolo-ribaudo/resvg-js)
- [Zod](https://zod.dev) for API validation
- [Vitest](https://vitest.dev) for testing
- Deployed to [Vercel](https://vercel.com)

## Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for the full guide.

Ways to contribute:

- Add new OG image templates
- Fix bugs or improve existing features
- Improve documentation
- Add platform previews
- Report issues

## Community

- [GitHub Issues](https://github.com/codercops/ogcops/issues) — bug reports and feature requests
- [GitHub Discussions](https://github.com/codercops/ogcops/discussions) — questions, ideas, and show & tell

## License

[MIT](LICENSE)

## Acknowledgments

- [Satori](https://github.com/vercel/satori) by Vercel — SVG generation from JSX
- [resvg-wasm](https://github.com/nicolo-ribaudo/resvg-js) — SVG to PNG conversion
- [Astro](https://astro.build) — web framework
- [React](https://react.dev) — UI components
