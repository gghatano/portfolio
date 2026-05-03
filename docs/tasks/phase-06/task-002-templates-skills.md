# Phase 6 / Task 002: コンテンツ追加テンプレート / スキル整備

## ステータス
- 完了 (2026-05-03)

## 背景
Issue にメモを書いたら、それを schema 準拠のコンテンツファイルに整形する仕組みが欲しい。手書きで毎回テンプレートをコピーする運用は摩擦が大きい。GitHub Issue Form と Claude Code のスラッシュコマンドを組み合わせて「入口は緩く、出口は schema 厳守」にする。

## 受け入れ基準
- [x] GitHub Issue Form を 5 件追加（talk / publication / career / affiliation / update）
- [x] 雛形 (`docs/templates/`) を 4 件追加（talk.md / publication.md / career.json / affiliation.json）
- [x] スラッシュコマンド (`.claude/commands/`) を 6 件追加（add-talk / add-publication / add-career / add-affiliation / from-issue / update-content）
- [x] README に新フローへの導線を追加
- [x] 雛形・コマンドのいずれもスキーマ (`src/content/config.ts`) を真実とする
- [x] CLAUDE.md ルール（worktree 作業）を各コマンドの注意に明記

## 成果物

### `.github/ISSUE_TEMPLATE/`
- `config.yml`（空 Issue 無効化）
- `add-talk.yml` / `add-publication.yml` / `add-career.yml` / `add-affiliation.yml`
- `update-content.yml`

各 Form は schema の必須フィールドを `validations.required: true` で強制し、enum は `dropdown` で選ばせる。Issue にはラベル `content` + `content:<type>` を自動付与する。

### `docs/templates/`
- `README.md`（運用ガイド）
- `talk.md.template` / `publication.md.template`
- `career.json.template` / `affiliation.json.template`

各雛形は schema 全フィールドを並べ、必須／任意をコメントで明示。

### `.claude/commands/`
- `README.md`（コマンド一覧）
- `from-issue.md`（種別ディスパッチ）
- `add-talk.md` / `add-publication.md` / `add-career.md` / `add-affiliation.md`
- `update-content.md`

各コマンドは:
1. メモ or `#issue` を引数に取る
2. schema を読み、必須フィールド不足ならユーザーに問い合わせ
3. slug を kebab-case で生成（衝突回避ロジック含む）
4. `docs/templates/` の雛形を参照してファイル化
5. `pnpm exec astro check` で検証して結果を報告

### README 更新
コンテンツ追加フロー節に「入口は 3 つ」サブセクションを追加。

## 設計判断
- `from-issue` は単独で type 別の処理を全部抱える。`/from-issue` から内部で他コマンドを呼び出さない（Claude Code のスラッシュコマンドは相互呼び出しが構造化されていないため、各コマンドの本文で「同じ手順を踏む」と参照させる）。
- 雛形 (`docs/templates/`) と Form (`.github/ISSUE_TEMPLATE/`) は別レイヤだが、整合性は schema を共通真実にすることで保つ。
- 既存コンテンツの更新は別コマンド `/update-content` に分離。`add-*` 系と上書き危険を分けるため。

## 残課題
- スキーマを変える操作（enum 値の追加など）を支援するコマンドは未整備。需要が出たら別タスクで。
- Issue Form の `dropdown` の選択肢ラベルに enum 名と日本語訳を併記したいが、Issue Form YAML は単一文字列のみ受け付けるため断念（説明欄に追記して回避）。
