# Phase 6 / Task 005: products アイコンをピクトグラム化

## ステータス
- 完了 (2026-05-04)

## 背景
products の `icon` フィールドが漢字 1 文字 (畑・観・型・請・速・訳) だったが、よりプロダクトの性質を視覚化したいので SVG ピクトグラムに置き換えたい。後方互換も保つ（漢字や任意の文字も引き続き使える）。

## 受け入れ基準
- [x] `<ProductIcon>` コンポーネントを新設し、ピクトグラム名 → SVG / それ以外 → 文字 を分岐
- [x] 8 種類のピクトグラム（`site` / `review` / `type` / `billing` / `speed` / `translate` / `book` / `oss`）を SVG で実装
- [x] 既存サンプル products のアイコンをピクトグラム名に切替
- [x] 詳細ページ・ホーム grid 双方で正しくレンダリング
- [x] スキーマの max を 16 に拡張（ピクトグラム名 `translate` 9 文字に対応）
- [x] Issue Form / 雛形 / コマンドの説明をピクトグラム名対応に更新
- [x] build / typecheck / lint すべて 0 errors

## 成果物
- `src/components/icons/ProductIcon.astro` (新規)
- `src/content/config.ts` の `icon` フィールド max(4) → max(16)
- `src/pages/index.astro` / `src/pages/products/[...slug].astro` で `<ProductIcon>` を使用
- `src/content/products/*.json` 6 件のアイコンをピクトグラム名に切替
- `.github/ISSUE_TEMPLATE/add-product.yml` / `docs/templates/product.json.template` / `docs/templates/README.md` / `.claude/commands/add-product.md` を更新

## ピクトグラム ⇄ プロダクト割当

| プロダクト | アイコン名 | デザイン |
| --- | --- | --- |
| 畑野ポートフォリオ | `site` | ブラウザウィンドウ（3 ドット + 横線） |
| Review Perspectives | `review` | 虫眼鏡（円 + ハンドル） |
| typed-content | `type` | 山括弧 `<>` |
| Billing Platform | `billing` | バーチャート（3 本） |
| Monorepo CI | `speed` | 雷マーク |
| Astro 翻訳 | `translate` | 地球（円 + 楕円 + 経度線） |

予備として `book`（開いた本）と `oss`（git ブランチ風）も実装済み。

## 設計判断
- すべての SVG は `viewBox="0 0 24 24"` / `stroke-width: 1.5` / `stroke-linecap: round` / `stroke-linejoin: round` で揃え、編集デザイン的な統一感を保つ。
- color は `currentColor` で継承させ、フレームの `color: var(--c-accent)` を引き継ぐ。
- consumer（ホーム grid と詳細ページ）の CSS で `:global(svg.pictogram)` セレクタを使い、フレームに合わせたサイズ（1.5rem / 2.25rem）を指定。
- 後方互換: ピクトグラム名でない `icon` 値（漢字や任意文字）はそのまま `<span class="pictogram-char">` として描画。

## 残課題
- ピクトグラムを増やしたい場合は `ProductIcon.astro` を直接編集する（schema 変更ではない）。アイコン追加が頻繁になれば外部 SVG ファイル管理に切り替え検討。
