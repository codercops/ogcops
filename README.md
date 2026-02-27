# OGCOPS

Free, open-source OG image generator with 109 templates across 12 categories, a social media preview checker for 8 platforms, and a free REST API. No login, no watermarks, no rate limits.

**Live:** [og.codercops.com](https://og.codercops.com)

## Features

- **109+ Templates** across 12 categories: Blog, Product, SaaS, GitHub, Event, Podcast, Developer, Newsletter, Quote, E-commerce, Job, Tutorial
- **8 Platform Previews**: Twitter/X, Facebook, LinkedIn, Discord, Slack, Reddit, WhatsApp, Google Search
- **Free REST API**: Generate OG images via URL. CORS-enabled. No API key required.
- **Client-side rendering**: Satori runs in the browser for instant preview during editing. Zero server calls while editing.
- **Open source**: MIT licensed. Contribute templates via PR.

## Quick Start

```bash
npm install
npm run dev
```

Visit `http://localhost:4321`.

## API

Generate an OG image:

```
GET https://og.codercops.com/api/og?title=Hello+World&template=blog-minimal-dark
```

Check a URL's meta tags:

```
GET https://og.codercops.com/api/preview?url=https://example.com
```

List all templates:

```
GET https://og.codercops.com/api/templates
```

See [API documentation](https://og.codercops.com/api-docs) for full details.

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

See [CONTRIBUTING.md](CONTRIBUTING.md) for how to add templates and contribute.

## License

MIT
