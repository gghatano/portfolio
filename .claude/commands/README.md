# プロジェクト固有のスラッシュコマンド

Claude Code でこのリポジトリを開いているとき、コンテンツ追加・更新を支援するスラッシュコマンドが利用できる。

## 一覧

| コマンド | 用途 | 引数 |
| --- | --- | --- |
| `/from-issue` | Issue のラベルから種別を判定して該当 add-* を実行 | `<#issue番号>` |
| `/add-talk` | 発表エントリを追加 | `<メモ or #issue>` |
| `/add-publication` | 論文・寄稿エントリを追加 | `<メモ or #issue>` |
| `/add-career` | 経歴エントリを追加 | `<メモ or #issue>` |
| `/add-affiliation` | 所属エントリを追加 | `<メモ or #issue>` |
| `/add-product` | プロダクトエントリを追加 | `<メモ or #issue>` |
| `/update-content` | 既存コンテンツを更新 | `<slug or path> <メモ or #issue>` |

## 使い方

3 通り。

### 1. Issue 経由

[Issue Form](../../.github/ISSUE_TEMPLATE/) で投稿 → ローカルで Claude Code に `/from-issue 42` のように指示。

### 2. 直接メモ

```
/add-talk 2026年1月24日 Static Site Day で基調講演をした 「コンテンツ駆動の静的サイトに何が向くのか」 スライドあり
```

### 3. 既存コンテンツの更新

```
/update-content 2025-jsconf-jp video_url を https://... に追加
```

## スキーマと真実

すべてのコマンドは `src/content/config.ts` の Zod スキーマを真実とする。enum 外の値・schema にないフィールドを勝手に追加してはならない。schema を変えたい場合は別タスクとして相談する。

## 雛形

各 add-* コマンドは `docs/templates/<type>.<ext>.template` を読み込んでフォーマットを合わせる。手動で作りたい場合も雛形をコピーすれば schema 整合性を保てる。

## CLAUDE.md ルール

すべてのコマンドは worktree (`gitworktree/feature-<task番号>-<キーワード>`) での作業を前提とする。main 直下にいるなら、コマンド実行前に worktree を切るよう案内すること。
