# 自己紹介・取り組みまとめサイト

GitHub Pages で公開する個人ポートフォリオ。経歴・発表・論文・所属を一望できる名刺代わりの単一 URL を持つことを目的とする静的サイト。

要件は [`docs/requirements.md`](docs/requirements.md) を参照。実装規約は [`docs/conventions.md`](docs/conventions.md)。タスク履歴は [`docs/tasks/`](docs/tasks/)。

## 技術スタック

- Astro 5（静的ビルド）
- TypeScript strict
- Astro Content Collections + Zod
- pnpm + Biome
- `@astrojs/sitemap`
- スタイルは Astro scoped + CSS Variables（Tailwind 不使用）

## セットアップ

```sh
pnpm install
pnpm dev      # http://localhost:4321
pnpm build    # dist/ に静的ファイルを書き出す
pnpm preview  # build 結果を local で配信
pnpm lint     # biome check
pnpm check    # astro check（typecheck）
```

## コンテンツ追加フロー

すべてのコンテンツは `src/content/<コレクション>/` 配下のファイルを追加するだけで反映される。スキーマ違反は `pnpm build` または `pnpm dev` 起動時に落ちる。

| コレクション | フォーマット | ファイル |
| --- | --- | --- |
| `profile` | JSON（singleton） | `src/content/profile/main.json` |
| `career` | JSON（複数） | `src/content/career/<slug>.json` |
| `talks` | Markdown（frontmatter + 本文） | `src/content/talks/<slug>.md` |
| `publications` | Markdown（frontmatter + 本文） | `src/content/publications/<slug>.md` |
| `affiliations` | JSON（複数） | `src/content/affiliations/<slug>.json` |

スキーマ定義は [`src/content/config.ts`](src/content/config.ts)。各フィールドの型・必須／任意・enum 値はそこで一元管理しているので、項目を増やすときも先にスキーマを編集する。

### 発表 1 件を追加する例

`src/content/talks/2026-conf-name.md` を作る:

```md
---
date: 2026-04-01
title: 発表タイトル
event: イベント名
location: 東京
type: oral        # keynote | invited | oral | poster | lt | panel
language: ja      # ja | en
slides_url: https://example.com/slides/...   # 任意
video_url: https://example.com/videos/...    # 任意
---

本文（abstract）。一覧では非表示、詳細ページの「概要」に表示される。
```

`pnpm dev` で `/talks/` に新着が並び、`/talks/2026-conf-name/` が生成される。`type` を増やしたい場合は `src/content/config.ts` の `talkType` enum と `src/lib/labels.ts` の表示ラベルを同時に更新する。

### 論文 1 件を追加する例

`src/content/publications/2026-venue-title.md`:

```md
---
date: 2026-03-15
title: 論文タイトル
authors:
  - "**自分の名前**"   # ** で囲った 1 つを「自分」として太字表示する運用ルール
  - 共著者 1
  - 共著者 2
venue: 学会名・誌名
type: conference   # journal | conference | book | chapter | preprint | magazine
doi: 10.0000/example
pdf_url: https://example.com/paper.pdf
links:
  - { label: "発表スライド", url: "https://..." }
bibtex: |
  @inproceedings{...}
---

abstract 本文。
```

### 経歴・所属を追加する例

`src/content/career/<slug>.json`:

```json
{
  "period_start": "2023-04",
  "period_end": "present",
  "organization": "株式会社○○",
  "role": "ソフトウェアエンジニア",
  "location": "東京",
  "summary": "1 行サマリー",
  "highlights": ["箇条書き 1", "箇条書き 2"]
}
```

`period_end` は `YYYY-MM` または `"present"`。所属 (`affiliations`) も同形だが `summary` `url` 任意。

## 著者表記ルール

論文・寄稿の `authors` は **同列の文字列配列** で並べ、自分自身を表す要素のみ二重アスタリスクで囲む（例: `"**畑野 拓馬**"`）。一覧 / 詳細では `<strong class="self">` で表示され、JSON-LD では plain text として出力される。

## ライト／ダーク切替

CSS Variables で `:root` / `:root[data-theme='light'|'dark']` の 2 経路を持っており、

1. システム設定 (`prefers-color-scheme`)
2. ヘッダのトグルでユーザー指定（auto / light / dark）

ユーザー指定は `localStorage['pf-theme']` に保存。`auto` ではシステム設定に従う。

## デプロイ

公開先（ユーザーサイト or プロジェクトサイト）と独自ドメインは未確定。実装は両形態で壊れないよう、内部リンクをすべて `import.meta.env.BASE_URL` 経由 (`src/lib/url.ts`) で組み立てている。

公開先決定後の手順:

1. `astro.config.mjs` の `site` / `base` を環境変数（`SITE_URL` / `SITE_BASE`）で渡せるようになっている。プロジェクトサイトなら `SITE_BASE=/<repo>/` を CI で渡す。
2. GitHub Actions ワークフロー（`actions/deploy-pages`）を `.github/workflows/deploy.yml` に用意。**未作成**。
3. `public/og/default.png` を生成して OG 画像を配置。**未作成**。

## 開発上の補足

- フォントはまだ self-host していない。現在は system fallback (`Hiragino Sans` 系 / Inter)。WOFF2 サブセット化は要件 5.1 のため Phase 5 で対応予定。
- 一覧のフィルタは軽量な inline JS。JS 無効でも一覧自体は閲覧可能。
- メールアドレスは静的 HTML には書かず、クリック時に JS で `mailto:` を組み立てる。JS 無効でも文字列は読める。

## 既知の未対応 / TODO

- WOFF2 self-host fonts（`public/fonts/`）
- `public/og/default.png` 生成
- GitHub Actions deploy ワークフロー
- Lighthouse CI / pa11y CI
- アバター画像（要件 6.2 「個人らしさ 1 つ」）
- 連絡先の実アドレス・SNS リンクの差し替え
