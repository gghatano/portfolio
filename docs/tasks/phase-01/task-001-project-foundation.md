# Phase 1 / Task 001: プロジェクト基盤

## ステータス
- 完了 (2026-05-03)

## 背景
要件定義 Phase 1「プロジェクト基盤」。Astro + TypeScript + Content Collections + Biome の最小構成を立ち上げ、`pnpm build` / `pnpm lint` / `pnpm check` がすべて 0 errors で通る状態を作る。

## 受け入れ基準
- [x] `pnpm install` で依存解決できる
- [x] `pnpm build` がローカルで成功する
- [x] `pnpm exec astro check` が 0 errors / 0 warnings / 0 hints
- [x] `pnpm lint`（biome）が 0 errors
- [x] `tsconfig.json` strict + `noUncheckedIndexedAccess`
- [x] `astro.config.mjs` で `SITE_URL` / `SITE_BASE` を環境変数経由で受ける
- [x] `@astrojs/sitemap` で sitemap-index.xml が生成される
- [x] `.gitignore` に `node_modules` / `dist` / `.astro` / `.env*` を含む

## 成果物
- `package.json` / `pnpm-lock.yaml`
- `astro.config.mjs` / `tsconfig.json` / `biome.json`
- `.gitignore`
- `public/favicon.svg` / `public/robots.txt`

## 採用したバージョン
- astro 5.18 / @astrojs/sitemap 3.7 / @astrojs/check 0.9
- typescript 5.9 / @biomejs/biome 1.9 / sharp 0.33
- pnpm 10.33

## メモ
- pnpm が未インストールだったので `npm i -g pnpm` で導入。corepack 経由は環境にない。
- `pnpm approve-builds --all` で sharp / esbuild / biome の postinstall を許可。
- `tsconfig.json` の `extends` は `astro/tsconfigs/strict`。
