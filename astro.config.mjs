import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

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
  trailingSlash: 'never',
  adapter: vercel({
    includeFiles: [
      './node_modules/@resvg/resvg-wasm/index_bg.wasm',
      './public/fonts/Inter-Regular.woff',
      './public/fonts/Inter-Medium.woff',
      './public/fonts/Inter-SemiBold.woff',
      './public/fonts/Inter-Bold.woff',
      './public/fonts/PlayfairDisplay-Regular.woff',
      './public/fonts/PlayfairDisplay-Bold.woff',
      './public/fonts/JetBrainsMono-Regular.woff',
      './public/fonts/JetBrainsMono-Bold.woff',
    ],
  }),
  vite: {
    optimizeDeps: {
      exclude: ['@resvg/resvg-wasm'],
    },
  },
});
