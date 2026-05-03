---
description: 既存コンテンツファイルをメモまたは Issue に従って更新する
argument-hint: <slug or path> <変更内容メモ or #issue番号>
allowed-tools: Bash, Glob, Read, Edit
---

既存の `src/content/<type>/<slug>.<ext>` を更新します。

## 入力解析

`$ARGUMENTS` は 2 部構成。

- 第 1 引数: `<slug>` または `<path>`
  - slug の場合（拡張子なし） → `src/content/*/<slug>.*` を Glob で探索
- 第 2 引数: 変更指示
  - `#<数字>` または `<数字>` → Issue 番号（`gh issue view`）
  - その他 → free-form メモ

引数が分割しづらい場合は、第 1 引数を空白で区切って処理してもよい（例: `2025-jsconf-jp #42`）。

## 手順

1. ターゲットファイルを特定:
   - 直接パスが渡されたら Read
   - slug だけならば Glob で `src/content/{talks,publications,career,affiliations}/<slug>.{md,json}` を探す
   - 複数ヒットしたら候補を出してユーザーに選ばせる
   - 0 件ならエラーを報告
2. ターゲットを Read。
3. 変更指示を解析（Issue or メモ）。修正・追記・削除を見極める。
4. Edit で更新。注意:
   - スキーマ（[`src/content/config.ts`](../../src/content/config.ts)）の必須フィールドを消さない
   - enum 値の変更は提示された値が schema にあることを確認してから
   - 著者表記の `**...**` は publications のみ
5. `pnpm exec astro check` を実行。失敗時は出力を読んで再調整。
6. 変更点（before / after の要点）を 3〜5 行で報告。

## 注意

- ファイル全体を Write し直すのではなく Edit を使う（不要な再フォーマットを避ける）。
- 任意フィールドの追加と必須フィールドの修正の両方ができる。
- worktree で作業すること（CLAUDE.md ルール）。
