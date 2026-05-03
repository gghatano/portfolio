# Phase 6 / Task 003: home redesign + products コレクション

## ステータス
- 完了 (2026-05-03)

## 背景
公開後のレビューで:
- ヒーローと bio が縦に大きく、経歴・発表などのプレビューがファーストビューに入らず読まれない
- 「開発したもの・プロダクト」を「直近の」ではなくトップに常時表示したい

ホームページを再構成し、新コレクション `products` を追加する。

## 受け入れ基準
- [x] `products` コレクションをスキーマに追加（priority による手動順位を許容）
- [x] サンプルデータ 6 件を投入
- [x] ホームのヒーローを圧縮（h1 を clamp(1.85, 2.6) に、padding-block を縮小）
- [x] bio の最初の段落だけをヒーローに移し、残りはページ末尾「もう少し詳しく」へ
- [x] Products セクションをヒーロー直後に配置し、**全件**表示（preview ではない）
- [x] 直近 3 件の発表 / 論文 / 経歴セクションを compact に維持
- [x] BaseLayout の main padding と Footer margin を縮小
- [x] Issue Form / 雛形 / スラッシュコマンドに products 用を追加
- [x] README / docs/templates/README / .claude/commands/README を更新
- [x] 1440 幅で products がファーストビューに入ることを確認

## 成果物
- `src/content/config.ts` に `products` コレクション追加
- `src/content/products/*.json` x 6
- `src/pages/index.astro` 全面書き直し
- `src/layouts/BaseLayout.astro` / `src/components/nav/SiteFooter.astro` の余白圧縮
- `.github/ISSUE_TEMPLATE/add-product.yml`
- `docs/templates/product.json.template`
- `.claude/commands/add-product.md`
- `.claude/commands/from-issue.md` に `content:product` ラベル追加
- 各 README を products に対応

## 設計判断
- products は singleton ではなく複数。priority で手動順位、未指定なら period_start desc の二段ソート。
- products は home に全件表示する仕様（要件として「直近の、ではなく」と明示）。専用一覧ページは作らない（直接性を保つため）。
- bio は singleton schema を変えず、ホーム側で `\n\n` で段落分割して 1 段落目だけ lede に、残りを末尾セクションに置く。

## 残課題
- ホームに products があるため、ナビに「プロダクト」項目を入れる必要が出た場合は home の `#products` アンカーリンクを足す（現状は不要と判断）。
- products に画像（スクショ）を持たせる選択肢は将来検討。今は文章とリンクのみ。
