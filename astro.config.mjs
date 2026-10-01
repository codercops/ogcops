import { defineConfig, envField } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  output: 'server',
  site: 'https://og.codercops.com',
  integrations: [
    react(),
    sitemap({
      filter: (page) => !page.includes('/api/'),
    }),
  ],
  prefetch: true,
  // Astro 7 defaults to 'jsx' whitespace rules; keep the previous output.
  compressHTML: true,
  // No Astro sessions, so the Cloudflare adapter doesn't add or provision a
  // SESSION KV namespace.
  session: false,
  trailingSlash: 'never',
  // Every route renders in the Cloudflare Worker. The resvg wasm and the fonts
  // are bundled into it (see src/lib/og-engine.ts and src/lib/font-loader.ts).
  adapter: cloudflare({ imageService: 'passthrough' }),
  env: {
    // Read per request with getSecret(): Worker secrets don't exist at build
    // time, so import.meta.env would bake in `undefined`.
    schema: {
      UPSTASH_REDIS_REST_URL: envField.string({ context: 'server', access: 'secret', optional: true }),
      UPSTASH_REDIS_REST_TOKEN: envField.string({ context: 'server', access: 'secret', optional: true }),
    },
  },
  vite: {
    optimizeDeps: {
      exclude: ['@resvg/resvg-wasm'],
    },
  },
});
