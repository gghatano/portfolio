# タスク履歴

要件定義 10 章のフェーズに対応させて記録する。`phase-NN/task-MMM-<keyword>.md` 形式。

## 索引

- Phase 1: プロジェクト基盤
  - [task-001 プロジェクト基盤セットアップ](phase-01/task-001-project-foundation.md)
  - [task-002 Content Collections + Zod スキーマ](phase-01/task-002-content-collections.md)
  - [task-003 デザイントークンと BaseLayout](phase-01/task-003-design-system.md)
- Phase 2〜4: ページ実装
  - [task-001 全ページ実装](phase-02/task-001-pages.md)
- Phase 5: 仕上げ
  - [task-001 6 ペルソナ自己レビュー → 修正](phase-05/task-001-self-review-and-fixes.md)
- Phase 6: 公開
  - [task-001 GitHub Pages デプロイワークフロー](phase-06/task-001-pages-deploy.md)
  - [task-002 コンテンツ追加テンプレート / スキル整備](phase-06/task-002-templates-skills.md)
  - [task-003 home redesign + products コレクション](phase-06/task-003-home-products.md)
  - [task-004 products grid + 詳細ページ](phase-06/task-004-products-grid.md)
  - [task-005 products アイコンをピクトグラム化](phase-06/task-005-pictograms.md)
  - [task-006 bulk-import インフラ整備](phase-06/task-006-bulk-import.md)
- Phase 7: ブログ + B.LEAGUE クラブ決算データベース（設計: [docs/bleague-finance/](../bleague-finance/README.md)、親 Issue: #29）
  - [task-001 ブログ基盤](phase-07/task-001-blog-foundation.md) #30
  - [task-002 決算データのスキーマと初期データ](phase-07/task-002-finance-data-schema.md) #31
  - [task-003 決算記事の取り込みコマンド](phase-07/task-003-finance-ingest-command.md) #32
  - [task-004 比較ページと図コンポーネント](phase-07/task-004-finance-visualization.md) #33
  - [task-005 最初の分析記事](phase-07/task-005-first-article.md) #34
  - [task-006 2016-17 までのさかのぼり取り込み](phase-07/task-006-finance-backfill.md) #35

## 運用ルール

- 1 タスク 1 ファイル。**ステータス**・**背景**・**受け入れ基準**・**成果物** を最低限含める。
- ステータスは `未着手` / `進行中` / `完了 (YYYY-MM-DD)` / `見送り (理由)` のいずれか。
- 受け入れ基準はチェックボックスで書き、実装中に増減する場合は本文を更新する。
- 完了後の振り返りで残課題が出たら **別タスク** として切り出す。タスク内に「TODO」を残さない。
- Phase 7 以降は、タスクごとに GitHub Issue を立てて進捗を追う。受け入れ基準はタスクファイルを正とし、Issue には要約とリンクだけを書く（二重管理で食い違うのを防ぐ）。Issue には `content` 系のラベルを付けない（`/from-issue` がコンテンツ追加と誤認する）。
