# Phase 6 / Task 004: products grid + 詳細ページ

## ステータス
- 完了 (2026-05-04)

## 背景
前回の home redesign で products を縦リスト型で並べたが、「アイコン + タイトル」のグリッドにし、詳細は別ページにしたいという要望。

## 受け入れ基準
- [x] スキーマに `icon` と `description_md` フィールドを追加
- [x] サンプル products 6 件にアイコン（漢字 1 文字）を付与、一部に description_md を追加
- [x] ホームの products セクションを 4 列グリッドに変更（タブレット 2 列、モバイル 1 列）
- [x] 各セルはアイコン + 名前のみ、リンク先は `/products/<slug>/`
- [x] `/products/[...slug].astro` 詳細ページを新設（パンくず・大型アイコン・tagline・tech・description・links）
- [x] CreativeWork JSON-LD を詳細ページに出力
- [x] Issue Form / 雛形 / コマンドに新フィールドを反映
- [x] build / typecheck / lint すべて 0 errors

## 成果物
- `src/content/config.ts` に `icon`、`description_md` を追加
- `src/lib/products.ts` (`defaultProductIcon`)
- `src/pages/index.astro` の products セクションを書き直し
- `src/pages/products/[...slug].astro` (新規)
- `src/content/products/*.json` 6 件に icon と一部 description_md を追加
- `.github/ISSUE_TEMPLATE/add-product.yml` に icon / description_md フィールド追加
- `docs/templates/product.json.template` 更新
- `.claude/commands/add-product.md` 更新

## 設計判断
- グリッドはセル個別に細い border を持たせる方式（`gap: var(--space-3)` + `border: 1px solid`）。最後の行が欠ける場合に空白が広がらない。
- アイコンは serif フォントで accent 色、square frame に入れる。デザイン方針の「絵文字 / Lucide 不採用」「rounded-2xl / 強シャドウ不採用」に合わせ、軽量な border-radius 4px で抑制。
- 詳細ページは breadcrumb 付き。「ホーム / プロダクト / <name>」の中段は home の `#products` アンカーへ飛ばす（独立した /products/ index は作らない）。

## 残課題
- `/products/` 単独 URL は 404 になる。需要があれば独立した index ページを追加する。
