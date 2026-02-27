# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/), and this project adheres to [Semantic Versioning](https://semver.org/).

## [1.0.0] - 2026-02-27

### Added

- 109 OG image templates across 12 categories (Blog, Product, SaaS, GitHub, Event, Podcast, Developer, Newsletter, Quote, E-commerce, Job, Tutorial)
- Interactive OG image editor with client-side Satori rendering for instant preview
- Social media preview checker for 8 platforms (Twitter/X, Facebook, LinkedIn, Discord, Slack, Reddit, WhatsApp, Google Search)
- Per-platform viewport widths showing how images appear on each platform
- Free REST API for OG image generation (`/api/og`) — no API key, no rate limits, CORS-enabled
- Meta tag preview API (`/api/preview`) for checking any URL's social meta tags
- Template listing API (`/api/templates`) with thumbnail generation
- API documentation page at `/api-docs`
- Template customization: colors, fonts, text, layout options per template
- URL-based state — all editor state encoded in URL params for easy sharing
- Server-side PNG generation via Satori + resvg-wasm
- TypeScript strict mode throughout
- Vitest test suite for template rendering
- CI pipeline with type-checking, tests, and build verification
- MIT license
