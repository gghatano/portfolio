---
description: メモまたは Issue からプロダクトエントリ (src/content/products/<slug>.json) を生成する
argument-hint: <メモ or #issue番号>
allowed-tools: Bash, Read, Write
---

メモまたは GitHub Issue を解析し、`src/content/products/<slug>.json` を作成します。

## 入力解析

`$ARGUMENTS` は次のいずれか:
- `123` / `#123` → `gh issue view <#> --json title,body,labels` で取得
- それ以外 → free-form のメモ
- 空 → 入力を求める

## 抽出するフィールド

スキーマは [`src/content/config.ts`](../../src/content/config.ts) を真実とする。

| フィールド | 必須 | 値 |
| --- | --- | --- |
| name | ✓ | プロダクト名 |
| tagline | ✓ | 1〜2 行の短い説明（詳細ページのサブタイトルに使用） |
| period_start |  | YYYY-MM |
| period_end |  | YYYY-MM または `"present"` |
| role |  | 役割（個人開発 / 主導 / OSS contributor など） |
| tech |  | 主要技術の文字列配列 |
| links |  | `{ label, url }` 配列 |
| priority |  | 整数（小さいほど先頭） |
| icon |  | グリッドセル用 1〜4 文字（漢字 1 文字推奨） |
| description_md |  | 詳細ページの本文（Markdown 段落区切り） |

## 手順

1. 入力を解析。
2. フィールドを抽出。期間表現の解釈:
   - 「現職で進行中」「現在」 → `period_end: "present"`
   - 「2024-04 から」 → `period_start: "2024-04"`
3. 必須フィールドが不足していればユーザーに問い合わせる。
4. slug を生成: プロダクト名の短いキーワードを kebab-case に。例: `portfolio`、`review-perspectives`、`monorepo-ci`、`astro-docs-jp`。衝突時は末尾にキーワードを足す。
5. [`docs/templates/product.json.template`](../../docs/templates/product.json.template) を Read してフォーマットを確認。
6. priority を割り当てる:
   - 既存ファイルを読んで使用中の priority を把握
   - 指定がなければ既存の最大値 + 1
   - 指定があれば衝突回避のため重複時に 1 増やす提案
7. `src/content/products/<slug>.json` を Write。任意フィールドは値が無いキー自体を出さない（`null` にしない）。
8. `pnpm exec astro check` を実行してスキーマ検証。
9. 作成したファイルパス、slug、priority、主要フィールド要約を 3〜5 行で報告。

## 注意

- ホームのグリッドはアイコン + 名前のみ。tagline と description_md は詳細ページ (/products/<slug>/) で表示される。
- icon が未指定の場合は `defaultProductIcon` が name の先頭文字を使う。日本語名なら漢字 1 文字、英名なら 1 文字目（例 typed-content → "t" → 詰まるので明示的に "型" などを推奨）。
- `tech` は実プロダクトで実際に使ったものに絞る。盛らない。
- 機密情報（顧客名・社内コードネーム）は含めない。社外に出せる粒度に。
- worktree で作業すること（CLAUDE.md ルール）。
