# Phase 7 / Task 003: 決算記事の取り込みコマンド

## ステータス
- 未着手（追跡: #32）

## 背景
決算記事 1 本を読んで `club-finances` の JSON に落とす作業は、手作業だと単位変換と科目の対応づけで間違えやすい。既存の `/add-*` コマンドと同じ方式で、Claude Code のスラッシュコマンドにする。リーグ PDF の全クラブ表は、既存の `/bulk-import` の経路に乗せる。

## 受け入れ基準
- [ ] `.claude/commands/add-club-finance.md` を作成する
  - 入力: 記事の URL、または本文の貼り付け（ネットワーク制限下でも使えるように、テキスト入力を必ず受け付ける）
  - 手順は [research-guide.md](../../bleague-finance/research-guide.md) の §3 に従う
  - **記事中に数字として書かれていない値は入れない**（逆算・推測の禁止）をコマンド本文に明記する
  - 既存ファイルがある場合は、tier を比べて上書きの可否を判断する（research-guide §7）。上書き前に差分を表示し、ユーザーの確認を取る
  - 出力の最後に「入れた項目 / 入れなかった項目とその理由」を報告する
- [ ] `import/club-finances.md` テンプレートを作り、`/bulk-import club-finances` で分解できるようにする（リーグ PDF の表を転記する用途）
- [ ] カバレッジ確認スクリプト `scripts/finance-coverage.mjs`: クラブ × シーズンの行列で、`official` / `preliminary` / 欠損を一覧表示する
- [ ] `.claude/commands/README.md` と `import/README.md` に導線を追加する
- [ ] 宇都宮の 2025-26 決算記事で実際にコマンドを流し、task-002 で手入力した値と一致することを確認する

## 成果物
- `.claude/commands/add-club-finance.md`
- `import/club-finances.md`
- `scripts/finance-coverage.mjs`
- `.claude/commands/README.md`、`import/README.md` の更新

## 設計判断
- **クローラーは作らない。** クラブサイトの構成はばらばらで、決算リリースは年 1 回しか出ない。記事を選ぶのは人が行い、構造化だけを自動化する。
- **確認を挟む上書き。** 確定値を速報値で潰す事故がいちばん痛い。tier の比較はコマンドに任せるが、書き込みの前に人の目を通す。

## 依存
- task-002（スキーマ）
