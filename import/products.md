# products

`/bulk-import products` で `src/content/products/<slug>.json` に分解。

| slug | name | icon | tagline | period_start | period_end | role | tech | links | priority | url |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
<!--
| portfolio | 畑野ポートフォリオ | site | このサイトそのもの。Astro + TS + Content Collections。 | 2026-05 | present | 個人開発 | Astro, TypeScript, Zod, Biome | Repo=https://github.com/gghatano/portfolio, Live=https://gghatano.github.io/portfolio/ | 1 | https://gghatano.github.io/portfolio/ |
| review-perspectives | Review Perspectives（架空） | review | コードレビュー観点ドキュメントを構造化し、PR コメントに自動展開する社内ツール。 | 2024-04 | present | 主導 | TypeScript, Node.js, GitHub Actions | 発表=https://example.com/slides/devopscon-2024 | 2 |  |
-->

## 列の意味

- `slug` (必須): ファイル名 (kebab-case)
- `name` (必須): プロダクト名
- `icon`: ピクトグラム名 (`site` / `review` / `type` / `billing` / `speed` / `translate` / `book` / `oss`) または 1〜4 文字
- `tagline` (必須): 1〜2 行の短い説明
- `period_start` / `period_end`: `YYYY-MM` または `present`
- `role`: 個人開発 / 主導 / OSS contributor など
- `tech`: カンマ区切り (`Astro, TypeScript`)
- `links`: `ラベル=URL` をカンマ区切り (`Repo=https://..., Live=https://...`)
- `priority`: 整数（小さいほど先頭）
- `url`: 主要 URL（任意）

## body: <slug>

description_md（任意）。空行で段落区切り。

<!--
## body: portfolio
GitHub Pages 上に立てた自己紹介・取り組みまとめサイト。

Astro + Content Collections + Zod でコンテンツの型を厳格化している。
-->
