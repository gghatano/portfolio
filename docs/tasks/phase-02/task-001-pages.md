# Phase 2 / Task 001: 全ページ実装

## ステータス
- 完了 (2026-05-03)

## 背景
要件定義 Phase 2〜4 を一括で実装。Phase 2 (`/`、`/career`)、Phase 3 (`/talks`、`/publications`)、Phase 4 (`/affiliations`、`/contact`、メタ) を、サンプルコンテンツと共に通しで作る。

## 受け入れ基準
- [x] `/` にプロフィール + 各セクション直近 3 件のプレビュー
- [x] `/career/` に時系列の経歴一覧
- [x] `/talks/` 一覧（年単位グルーピング + 種別フィルタ）と `/talks/[...slug]/` 詳細
- [x] `/publications/` 一覧と `/publications/[...slug]/` 詳細（DOI / PDF / BibTeX 対応）
- [x] `/affiliations/` 一覧
- [x] `/contact/` 連絡先（mailto を JS hydration、SNS リンク）
- [x] `/404`（ホームへの戻り導線）
- [x] sitemap / robots.txt / canonical / OGP / Twitter Card
- [x] ホームに `Person` JSON-LD、論文詳細に `ScholarlyArticle`、発表詳細に `Event` または `PresentationDigitalDocument`

## 成果物
- `src/pages/index.astro`
- `src/pages/career/index.astro`
- `src/pages/talks/index.astro` / `src/pages/talks/[...slug].astro`
- `src/pages/publications/index.astro` / `src/pages/publications/[...slug].astro`
- `src/pages/affiliations/index.astro`
- `src/pages/contact/index.astro`
- `src/pages/404.astro`
- `src/lib/{authors,format,labels,url}.ts`

## 設計判断
- 一覧のフィルタは inline `<script>` で軽量実装。JS 無効でも一覧自体は閲覧可能。
- 内部リンクはすべて `src/lib/url.ts` の `url()` 経由で `import.meta.env.BASE_URL` を尊重。
- `EntryRow` は `date`（表示）と `dateTime`（ISO）を別 prop に分け、`<time datetime>` を必ず ISO 形式で出す。
- 著者の `**name**` マーカーは `lib/authors.ts` の `renderAuthors` で `<strong class="self">` に変換。
- 連絡先の mailto は静的 HTML に書かず、`a.email[data-mail-user][data-mail-host]` を JS で hydrate。
- 発表詳細の JSON-LD は `video_url` の有無で `PresentationDigitalDocument` / `Event` を分岐。
