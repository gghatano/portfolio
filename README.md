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
| `products` | JSON（複数 / トップに常時表示） | `src/content/products/<slug>.json` |

スキーマ定義は [`src/content/config.ts`](src/content/config.ts)。各フィールドの型・必須／任意・enum 値はそこで一元管理しているので、項目を増やすときも先にスキーマを編集する。

### 入口は 3 つ

1. **GitHub Issue Form** — [Issues タブ → New issue](https://github.com/gghatano/portfolio/issues/new/choose) から該当テンプレートを選択。詳細は [`.github/ISSUE_TEMPLATE/`](.github/ISSUE_TEMPLATE/)。
2. **Claude Code スラッシュコマンド** — `/from-issue <#>` または `/add-talk <メモ>` などで Issue かメモから schema 準拠のファイルを自動生成。詳細は [`.claude/commands/README.md`](.claude/commands/README.md)。
3. **手動コピー** — [`docs/templates/`](docs/templates/) の雛形をコピーして編集。

入口が違っても、最終的に作られるファイルは同じ schema に従う。

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

公開先は **プロジェクトサイト** `https://gghatano.github.io/portfolio/`。`main` への push をトリガに [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) が GitHub Pages へ自動デプロイする。

ワークフローの流れ:

1. pnpm install → `pnpm lint` / `pnpm exec astro check` / `pnpm build`
2. `SITE_URL=https://gghatano.github.io` / `SITE_BASE=/portfolio/` を env で渡す
3. `actions/upload-pages-artifact` で `dist/` を artifact 化
4. `actions/deploy-pages` で公開

### 初回セットアップ（リポジトリ管理者の作業）

GitHub の **Settings → Pages → Build and deployment** で **Source** を `GitHub Actions` に設定する。`actions/configure-pages@v5` が自動で有効化を試みるが、組織権限などで失敗するケースは手動で。

### 別構成への切替

ユーザーサイト (`<owner>.github.io`) や独自ドメインに切り替える場合は、`.github/workflows/deploy.yml` の `SITE_URL` / `SITE_BASE` を変更する。内部リンクはすべて `import.meta.env.BASE_URL` 経由 (`src/lib/url.ts`) で組み立てているため、env 値の差し替えだけで両形態に対応できる。

### TODO

- `public/og/default.png`（1200×630）を生成して OG 画像を配置。**未作成**。

## 開発上の補足

- フォントはまだ self-host していない。現在は system fallback (`Hiragino Sans` 系 / Inter)。WOFF2 サブセット化は要件 5.1 のため Phase 5 で対応予定。
- 一覧のフィルタは軽量な inline JS。JS 無効でも一覧自体は閲覧可能。
- メールアドレスは静的 HTML には書かず、クリック時に JS で `mailto:` を組み立てる。JS 無効でも文字列は読める。

## 既知の未対応 / TODO

- WOFF2 self-host fonts（`public/fonts/`）
- `public/og/default.png` 生成
- Lighthouse CI / pa11y CI
- アバター画像（要件 6.2 「個人らしさ 1 つ」）
- 連絡先の実アドレス・SNS リンクの差し替え
