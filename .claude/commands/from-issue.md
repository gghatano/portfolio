---
description: GitHub Issue を読み、ラベルから種別を判定して該当する add-* 処理を実行する
argument-hint: <#issue番号>
allowed-tools: Bash, Read, Write
---

GitHub Issue から種別を判定し、コンテンツファイルを生成します。

## 入力

`$ARGUMENTS` は Issue 番号（`123` または `#123`）。空のときは「Issue 番号を教えてください」と尋ねる。

## 手順

1. `gh issue view <#> --json title,body,labels,state` で Issue を取得。
2. labels に以下のいずれかがあれば対応する種別:
   - `content:talk` → talks（[`add-talk.md`](add-talk.md) と同じ手順を踏む）
   - `content:publication` → publications（[`add-publication.md`](add-publication.md)）
   - `content:career` → career（[`add-career.md`](add-career.md)）
   - `content:affiliation` → affiliations（[`add-affiliation.md`](add-affiliation.md)）
   - `content:update` → 既存コンテンツの更新（[`update-content.md`](update-content.md) に切替）
3. 判定不能（複数該当 / 該当なし）なら body の冒頭から推測してユーザーに 1 件確認。
4. 該当する add-* / update-content と同じ処理でファイルを生成または編集。Issue body の各 Form フィールドは `### <ラベル>` の見出しで区切られているので、それを手掛かりに値を取り出す。
5. 完了後、Issue にコメントを残す（`gh issue comment $ARGUMENTS --body "..."`）か、PR 作成まで進めるかをユーザーに確認。
6. 作業完了時に何をしたか（生成したファイル、Issue コメントの有無、PR 作成の有無）を 3〜5 行で報告。

## 注意

- 本コマンドは複数の content type にまたがるディスパッチを行うため、各 add-* の制約をそのまま守ること。
- main ブランチ直下では作業しない。worktree が無いなら新しく切る（CLAUDE.md ルール）。
- 自動で Issue を close しない。close するかは人間判断に委ねる。
