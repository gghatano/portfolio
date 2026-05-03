---
description: メモまたは Issue から所属エントリ (src/content/affiliations/<slug>.json) を生成する
argument-hint: <メモ or #issue番号>
allowed-tools: Bash, Read, Write
---

メモまたは GitHub Issue を解析し、`src/content/affiliations/<slug>.json` を作成します。

## 入力解析

`$ARGUMENTS` は次のいずれか:
- `123` / `#123` → `gh issue view <#> --json title,body,labels` で取得
- それ以外 → free-form のメモ
- 空 → 入力を求める

## 抽出するフィールド

スキーマは [`src/content/config.ts`](../../src/content/config.ts) を真とする。

| フィールド | 必須 | 値 |
| --- | --- | --- |
| period_start | ✓ | YYYY-MM |
| period_end |  | YYYY-MM または `"present"` |
| organization | ✓ | 組織名 |
| role |  | 役割 |
| summary |  | サマリー |
| url |  | 公式サイト URL |

## 手順

1. 入力を解析。
2. フィールドを抽出。
3. 必須フィールドが不足していればユーザーに問い合わせる。
4. slug を生成: 組織の短いキーワードを kebab-case で。例: `ipsj-member`、`astro-wg`、`tech-book-fest`、`oss-community`。衝突時は末尾にキーワードを足す。
5. [`docs/templates/affiliation.json.template`](../../docs/templates/affiliation.json.template) を Read してフォーマットを確認。
6. `src/content/affiliations/<slug>.json` を Write。任意フィールドは値が無いキー自体を出さない。
7. `pnpm exec astro check` を実行してスキーマ検証。
8. 作成したファイルパス、slug、主要フィールド要約を 3〜5 行で報告。

## 注意

- `period_end` は `"present"` または `YYYY-MM`。
- 「単に名前を並べただけ」を避け、`role` か `summary` をなるべく書く（コンテンツ・ナラティブの観点）。
- worktree で作業すること（CLAUDE.md ルール）。
