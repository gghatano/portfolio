# コンテンツテンプレート

`src/content/` 配下に新しいエントリを追加するときの雛形。スキーマは [`src/content/config.ts`](../../src/content/config.ts) を真とする。

## 雛形一覧

| 種別 | テンプレート | 配置先 | 拡張子 |
| --- | --- | --- | --- |
| 発表 | [`talk.md.template`](talk.md.template) | `src/content/talks/<slug>.md` | `.md` |
| 論文・寄稿 | [`publication.md.template`](publication.md.template) | `src/content/publications/<slug>.md` | `.md` |
| 経歴 | [`career.json.template`](career.json.template) | `src/content/career/<slug>.json` | `.json` |
| 所属 | [`affiliation.json.template`](affiliation.json.template) | `src/content/affiliations/<slug>.json` | `.json` |
| プロダクト | [`product.json.template`](product.json.template) | `src/content/products/<slug>.json` | `.json` |

profile (`src/content/profile/main.json`) は singleton なので雛形は持たない。直接編集する。

## products の `icon` フィールド

トップのグリッドセルに描画されるアイコン。次のいずれか:

- **ピクトグラム名**（推奨）: SVG が描画される
  - `site` / `review` / `type` / `billing` / `speed` / `translate` / `book` / `oss`
- **1〜4 文字の任意の文字**: フレーム内に文字として描画される（漢字 1 文字推奨。例 `"畑"`）
- **省略**: name の先頭文字が文字として描画される

新しいピクトグラムを追加したい場合は [`src/components/icons/ProductIcon.astro`](../../src/components/icons/ProductIcon.astro) の `KNOWN_PICTOGRAMS` セットと `<svg>` 内 conditional に追加する。

## slug 命名

`<YYYY>-<イベントや組織の略称>` の kebab-case を基本とする。同年に同イベント名で複数ある場合は末尾にキーワードを足す（`-lt`、`-keynote`、`-poster` など）。

```
2026-jsconf-jp.md
2025-tskaigi-builtin.md     # 既存 2025-tskaigi がある場合の衝突回避
2024-magazine-sd.md
2023-arxiv-branded.md
2022-tl-subsystem.json      # career の場合は組織や役割の略称
```

## 入力フロー

3 通りある。

1. **GitHub Issue Form**: [Issues タブ](https://github.com/gghatano/portfolio/issues/new/choose) から該当のテンプレートを選んで投稿 → ローカルで `/from-issue <#>` を Claude Code で実行
2. **Free-form メモ**: ローカルで `/add-talk <メモ>` などを実行
3. **手動コピー**: 雛形ファイルを手動でコピーして編集

いずれの場合も、提出前に `pnpm exec astro check` でスキーマ検証が通ることを確認する。
