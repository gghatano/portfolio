# Phase 5 / Task 001: 6 ペルソナ自己レビュー → 修正

## ステータス
- 完了 (2026-05-03)

## 背景
要件定義 9 章「セルフレビュー: 後述レビューペルソナ全 6 種のチェックリストを自分で通す」。`docs/review-personas/` の 01〜06 すべてに通し、検出した指摘を分類して直す。

## 受け入れ基準
- [x] 全 6 ペルソナのチェックリストを通読
- [x] 検出した指摘を `must` / `should` / `nit` に分類
- [x] `must` / `should` レベルの指摘をすべて対応
- [x] 修正後に build / typecheck / lint がすべて 0 errors

## 検出 → 対応した指摘

| 重要度 | 由来 | 内容 | 対応 |
| --- | --- | --- | --- |
| must | a11y (03) | フィルタボタン / テーマトグルが 28px。WCAG 2.5.5 違反 | `min-height: 44px` に統一 |
| must | perf (04) | 発表詳細に JSON-LD 未実装 | `PresentationDigitalDocument` / `Event` を `video_url` 有無で分岐出力 |
| must | perf (04) | `<time datetime="2025.11.22">` のように datetime が ISO 形式でない | `EntryRow` の `date` / `dateTime` を分離 |
| must | perf (04) | OG 画像が未生成のまま `og:image` が 404 を指す | 画像未指定時は `og:image` / `twitter:image` を出さない実装に変更 |
| must | perf (04) | `robots.txt` の Sitemap がハードコード | 相対パス `/sitemap-index.xml` に修正 |
| should | code (02) | `renderAuthors` が 2 ファイルで重複 | `src/lib/authors.ts` に集約 |
| should | security (06) | `<meta name="referrer">` 未設定 | `strict-origin-when-cross-origin` を `BaseLayout` で固定 |
| should | security (06) | mailto 直書きでスクレイパに拾われる | JS で hydrate、静的 HTML には mailto: 文字列を出さない |
| should | security (06) | 簡易プライバシー注記なし | フッタに「アクセス解析・サードパーティスクリプト未導入」を明記 |
| nit | design (01) | アクセント色の用途が 4 箇所以上 | eyebrow を `--c-text-muted` に降格、selection は除外し 3 用途に限定 |

## 残課題（別タスクに切り出し）
- WOFF2 self-host fonts
- `public/og/default.png` の生成
- GitHub Actions deploy ワークフロー
- Lighthouse CI / pa11y CI
- アバター画像 / 個人らしさの素材
- 連絡先の実アドレス・SNS リンク差し替え
