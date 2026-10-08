import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// 既定値は本番（Cloudflare Workers）。テスト環境の GitHub Pages は deploy.yml で上書きする。
const SITE = process.env.SITE_URL ?? 'https://portfolio.gghatano.com';
const BASE = process.env.SITE_BASE ?? '/';

export default defineConfig({
  site: SITE,
  base: BASE,
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
  integrations: [sitemap()],
  vite: {
    resolve: {
      alias: {
        '~': new URL('./src', import.meta.url).pathname,
      },
    },
  },
});
