---
description: メモまたは Issue から経歴エントリ (src/content/career/<slug>.json) を生成する
argument-hint: <メモ or #issue番号>
allowed-tools: Bash, Read, Write
---

メモまたは GitHub Issue を解析し、`src/content/career/<slug>.json` を作成します。

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
| role | ✓ | 役割・役職 |
| location |  | 場所 |
| summary |  | 1 行サマリー |
| highlights |  | 文字列配列（主な貢献） |

## 手順

1. 入力を解析。
2. フィールドを抽出。期間の表現を確認:
   - 「現職」「現在」「在籍中」 → `"present"`
   - 「2024 年 4 月から」 → `"2024-04"`
3. 必須フィールドが不足していればユーザーに問い合わせる。
4. slug を生成: `<period_start>-<period_end or current>-<キーワード>` の kebab-case。
   - 例: `2024-current-side-advisor`、`2018-2022.json`、`2017-summer-intern.json`
5. [`docs/templates/career.json.template`](../../docs/templates/career.json.template) を Read してフォーマットを確認。
6. `src/content/career/<slug>.json` を Write。任意フィールドは値が無いキー自体を出さない（`null` にしない）。
7. `pnpm exec astro check` を実行してスキーマ検証。
8. 作成したファイルパス、slug、主要フィールド要約を 3〜5 行で報告。

## 注意

- `period_end` は `"present"` リテラルか `YYYY-MM` のどちらか。`null` / 空文字列は不可。
- `highlights` は箇条書きの強い動詞で書く（「〜した」「〜削減」）。誰でも書ける履歴書テンプレ風にしない（具体数値・固有名）。
- worktree で作業すること（CLAUDE.md ルール）。
