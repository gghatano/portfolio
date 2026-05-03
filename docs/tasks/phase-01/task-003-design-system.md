# Phase 1 / Task 003: デザイントークンと BaseLayout

## ステータス
- 完了 (2026-05-03)

## 背景
要件定義 6 章「デザイン方針」を反映した CSS Variables ベースのトークンと、全ページ共通の `BaseLayout` を作る。Tailwind 既定や Claude Code 風アンチパターン（6.1）を踏まないことが必須。

## 受け入れ基準
- [x] `src/styles/tokens.css` に色・タイポ・余白を集約
- [x] 純黒・純白を避け、warm な near-black / paper な near-white を採用
- [x] アクセント 1 色（朱／ink red）。light は `#a8362f`、dark は `#d27267`
- [x] ライト／ダーク両対応。`prefers-color-scheme` + `data-theme` 上書き
- [x] `BaseLayout.astro` でメタ・サイトヘッダ・フッタを統合
- [x] スキップリンク、`<meta name="referrer">`、color-scheme を装備
- [x] `prefers-reduced-motion: reduce` 対応（`reset.css`）
- [x] テーマトグル（auto / light / dark）を `localStorage` に保存

## 成果物
- `src/styles/{tokens,reset,typography}.css`
- `src/layouts/BaseLayout.astro`
- `src/components/nav/{SiteHeader,SiteFooter,ThemeToggle}.astro`
- `src/components/meta/Meta.astro`
- `src/components/lists/{EntryRow,SectionHeader,ExternalLink}.astro`

## アクセント色の用途制限
要件 6.4 で「3 つ以下」とあるため、用途を以下に限定:
1. 現在ページ / 選択中状態（ナビ・フィルタ）
2. hover（行タイトルの下線）
3. blockquote の縦罫線

それ以外（eyebrow text、ボーダー）は `--c-text-muted` / `--c-rule` で済ませる。
