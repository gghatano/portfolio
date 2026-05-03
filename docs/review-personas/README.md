# レビューエージェント・ペルソナ集

このディレクトリは、本サイトのレビューを行う際の「視点」を 6 つのペルソナに切り出したものです。Claude Code のサブエージェントに役割を与えるとき、人間がセルフレビューを行うとき、PR レビューでチェックリストとして使うときの三用途を想定しています。

## 設計の前提

- 各ペルソナは **観点が排他的** になるよう切り分けています。重複が出たら「主担当」を決めて他ペルソナはコメントを残すだけに留めます。
- 各ペルソナは「**必ず指摘すべき項目（must）**」「**強く推奨する項目（should）**」「**好みの問題（nit）**」の 3 段階で指摘します。
- アウトプットフォーマットは原則として `[severity] file:line — 観点 — 提案` の 1 行形式に統一します。
- すべてのペルソナは `docs/requirements.md` を真とします。要件定義と矛盾する指摘は出さず、要件側の修正提案として上げます。

## ペルソナ一覧

| # | ファイル | 役割 | 主担当領域 |
| - | --- | --- | --- |
| 01 | [01-modern-design-critic.md](./01-modern-design-critic.md) | モダンデザイン批評家 | タイポ・色・レイアウト・テンプレ臭の検出 |
| 02 | [02-frontend-code-quality.md](./02-frontend-code-quality.md) | フロントエンド・コード品質 | Astro / TypeScript / Content Collections の実装品質 |
| 03 | [03-accessibility-usability.md](./03-accessibility-usability.md) | アクセシビリティ・ユーザビリティ | WCAG、キーボード、コントラスト、UX |
| 04 | [04-performance-seo-delivery.md](./04-performance-seo-delivery.md) | パフォーマンス・配信・SEO | Lighthouse、Core Web Vitals、メタ・構造化データ |
| 05 | [05-content-narrative.md](./05-content-narrative.md) | コンテンツ・ナラティブ戦略家 | 何を語るか、誰に届くか、文体一貫性 |
| 06 | [06-security-privacy.md](./06-security-privacy.md) | セキュリティ・プライバシー監査 | PII 露出、外部依存、公開倫理 |

## サブエージェントとして起動するときのテンプレ

```
You are reviewing a personal portfolio site built with Astro + TypeScript.
Adopt the persona defined in `docs/review-personas/<file>.md` exactly.
Read `docs/requirements.md` first as the source of truth.

Scope of this review: <変更ファイル群 or PR 番号 or ページパス>
Output format: `[must|should|nit] path:line — 観点 — 提案`
At the end, print a one-line verdict: APPROVE / APPROVE_WITH_NITS / REQUEST_CHANGES.
```

## ペルソナの使い分け

- **どれか 1 つだけ回したい**: PR の主目的に近いペルソナを選ぶ。例: ヒーロー実装なら 01、Content Collections 追加なら 02、画像追加なら 04 と 06。
- **全員回したい**: Phase 完了時、公開直前、デザイン大幅変更時。並列実行を推奨。
- **回さないでよいケース**: 軽微な typo 修正、スキーマに影響しないコンテンツ追加（Markdown 1 ファイル追加など）。
