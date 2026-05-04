# Phase 6 / Task 006: bulk-import インフラ整備

## ステータス
- 完了 (2026-05-04)

## 背景
コンテンツの初期シードや大量更新を 1 件ずつ Issue Form / `/add-*` で行うのは効率が悪い。Markdown 表で一括記載 → スラッシュコマンドで分解する経路を用意する。書きやすさを優先し、長文は表とは別の `## body: <slug>` セクションで持つ。

## 受け入れ基準
- [x] `import/<collection>.md` のテンプレートを 6 種類用意（products / talks / publications / career / affiliations / profile）
- [x] 各テンプレートに表のヘッダ、コメントアウトされた例、列の意味、body セクション例を記載
- [x] 列定義に `slug` を必ず含める（出力先ファイル名）
- [x] 配列フィールドの区切り文字を統一: `tech`=カンマ、`highlights`/`authors`=セミコロン、`links`=`label=URL` をカンマ
- [x] `/bulk-import <collection>` スラッシュコマンドを実装
- [x] スキーマに `url` フィールドを追加（career / talks / publications / products に optional）
- [x] README / `.claude/commands/README` / `import/README.md` で導線を整理
- [x] 既存テンプレ（empty rows）状態で build / typecheck / lint が 0 errors

## 成果物
- `src/content/config.ts` に `url` を 4 コレクションに追加
- `import/README.md` (運用ガイド)
- `import/{products,talks,publications,career,affiliations,profile}.md` (空テンプレ + 例)
- `.claude/commands/bulk-import.md` (新コマンド)
- `.claude/commands/README.md` 更新
- ルート README に「入口は 4 つ」として追記

## 設計判断
- **書きやすさ重視**: スプレッドシート/エディタどちらでも書ける Markdown 表に統一。CSV/TSV ではなく Markdown 表を選んだのは Git diff レビューしやすさと、本文セクションを同じファイルに持たせる利便性のため。
- **配列フィールドの区切り**: `,`（tech）と `;`（highlights, authors）で使い分ける。要素内にカンマが入りうる項目はセミコロンで区切る。`links` は `label=URL` の対表現にすることで `|` を避け、表セルに収まる形にした。
- **長文は body セクション**: tagline 程度はセルに収まるが、abstract / description_md / bio_md / bibtex は段落区切りが必要なので `## body: <slug>` 見出しで分離。
- **slug が必須**: 出力先ファイル名を表で明示することで、再実行時に同じファイルが上書きされる idempotent 性を確保。
- **`url` の追加**: career/talks/publications/products に optional な汎用 URL を追加。affiliations は既に `url` を持っていたためそのまま。プロダクトの `links` 配列とは別のレイヤとして「主要 1 URL」を保持できる。

## 残課題
- 表の解析を Claude のスラッシュコマンドに任せる方式。決定論的な再現性を求めるなら Node スクリプト化を別タスクで検討。
- 表中の `|` は `\|` でエスケープが必要。実運用で頻発するなら別区切り文字検討。
- `url` フィールドは schema に追加したが、ホーム / 詳細ページでのレンダリングは未対応（必要になったら別タスク）。
