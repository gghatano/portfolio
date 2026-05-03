---
description: メモまたは Issue から発表エントリ (src/content/talks/<slug>.md) を生成する
argument-hint: <メモ or #issue番号>
allowed-tools: Bash, Read, Write
---

メモまたは GitHub Issue を解析し、`src/content/talks/<slug>.md` を作成します。

## 入力解析

`$ARGUMENTS` は次のいずれか:
- `123` または `#123` のような数字 → GitHub Issue 番号として `gh issue view <#> --json title,body,labels` で取得
- それ以外 → free-form のメモ
- 空 → ユーザーに「発表のメモまたは Issue 番号を教えてください」と尋ねる

## 抽出するフィールド

スキーマは [`src/content/config.ts`](../../src/content/config.ts) を真とする。

| フィールド | 必須 | 値 |
| --- | --- | --- |
| date | ✓ | YYYY-MM-DD |
| title | ✓ | 発表タイトル |
| event | ✓ | イベント名 |
| location |  | 場所（東京、Berlin、オンライン 等） |
| type | ✓ | keynote / invited / oral / poster / lt / panel |
| language | ✓ | ja / en |
| slides_url |  | スライド URL |
| video_url |  | 動画 URL |
| (本文) | ✓ | アブストラクト |

## 手順

1. 入力を解析。
2. フィールドを抽出。`type` / `language` が曖昧なときは推測候補を 1 件出して確認。
3. 必須フィールドが不足していればユーザーに具体的に問い合わせる（複数まとめて）。
4. slug を生成: `<YYYY>-<イベント略称>` の kebab-case（例: `2026-jsconf-jp`）。`src/content/talks/` の既存ファイルと衝突したら、末尾にキーワードを足して衝突回避（`-lt`、`-keynote`、`-poster` など）。
5. [`docs/templates/talk.md.template`](../../docs/templates/talk.md.template) を Read してフォーマットを確認。
6. `src/content/talks/<slug>.md` を Write。任意フィールドは値が無ければ frontmatter から省略すること。
7. `pnpm exec astro check` を実行してスキーマ検証。失敗したら原因を読み取り、再調整。
8. 作成したファイルパス、生成された slug、主要フィールド要約を 3〜5 行で報告。

## 注意

- 著者太字 `**...**` ルールは talks には**適用しない**（publications のみ）。
- ファイルは UTF-8 / LF。frontmatter のキー名は schema と完全一致。
- enum 外の値は使わない。値が schema に無いカテゴリのときは「schema 拡張が要るかも」と提案するに留め、勝手に追加しない。
- worktree で作業すること（CLAUDE.md ルール）。main 直下にいるなら新しい worktree を切ってから進める。
