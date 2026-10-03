# Phase 7 / Task 004: 比較ページと図コンポーネント

## ステータス
- 未着手

## 背景
蓄積したデータを比べて見る場所を作る。図は 2 か所で使う。常設の比較ページ `/data/bleague-finance/` と、ブログ記事（MDX）への埋め込みである。どちらも同じ図コンポーネントを使う。

## 受け入れ基準
- [ ] 実装前に `dataviz` スキルを読み、色・マーク・凡例の方針をそれに合わせる。色は `tokens.css` にトークンとして追加し、ライト／ダークの 3 箇所に定義する
- [ ] 図は Astro コンポーネントで、**build 時に SVG を生成する**。クライアント JS のチャートライブラリは使わない
- [ ] `src/components/charts/` に次の 4 種を作る。すべて `season` などの引数を受け取り、データは `getCollection('club-finances')` から読む
  - [ ] `RevenueRanking`: 営業収入の横棒ランキング。B.PREMIER 基準（12 億円）の参照線を引く（Q1）
  - [ ] `RevenueMix`: 営業収入の内訳の 100% 積み上げ横棒。内訳が欠けているクラブは「不明」として明示し、0 と区別する（Q2）
  - [ ] `PayrollVsWins`: 横軸を人件費、縦軸を勝率にした散布図。点の色で営業利益の正負を表し、クラブ名を点の横に直接書く（Q3）
  - [ ] `ClubTrend`: 1 クラブの営業収入推移。一時要因（`one_off_items`）を注記として重ねる（Q4）
- [ ] すべての図に、`<figure>` と `<figcaption>`（出典と `preliminary` を含むかどうか）、`role="img"`、`aria-label` を付ける。さらに、同じ数値を `<table>` でも出す（折りたたみ可）
- [ ] `preliminary` の値は、図の上でも見分けがつくようにする（ハッチングや破線など、色だけに頼らない表現にする）
- [ ] `/data/bleague-finance/` 比較ページ: シーズンの切り替え（シーズンごとに静的ページを生成し、リンクで切り替える）、全項目の表、上の 4 図
- [ ] `/data/bleague-finance/[club]/` クラブ別ページ: 全シーズンの推移と出典一覧
- [ ] 320px〜1440px 幅で崩れない。初期 JS 予算（< 50KB gzip）を超えない
- [ ] lint / check / build が 0 errors

## 成果物
- `src/components/charts/*.astro`
- `src/pages/data/bleague-finance/index.astro`、`[season].astro`、`[club].astro`（ルーティングは実装時に決める）
- `src/styles/tokens.css`（チャート用トークン）

## 設計判断
- **SVG を build 時に生成する。** 実装規約 §8 と §10（third-party script ゼロ、初期 JS 予算）に合わせるためである。インタラクションはツールチップ程度なので、SVG の `<title>` と表の併記で足りる。
- **散布図はクラブ名を直接書く。** 凡例で 20 色以上を見分けさせるのは無理がある。
- **速報値と確定値を見た目で分ける。** 10 月のリーグ発表をまたぐ期間は、2 種類の数値が混在する。区別できない図は誤読を生む。

## 依存
- task-001（MDX 埋め込みの確認）、task-002（データ）
