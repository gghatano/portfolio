# Phase 7 / Task 001: ブログ基盤

## ステータス
- 未着手

## 背景
B.LEAGUE クラブ決算の分析記事（[設計書](../../bleague-finance/README.md)）を載せる場所として、ポートフォリオにブログを追加する。要件定義 1.3 と 3.2 は「ブログ／RSS」をノンゴールとし、「必要になったら別サブドメイン or 別リポジトリで拡張」としていた。今回は同じサイト内に置く判断をしたので、要件定義の改訂もこのタスクに含める。

同じサイトに置く理由は、記事の図を決算データ（`src/content/club-finances/`）から build 時に生成したいからである。データと記事が別リポジトリにあると、この経路が作れない。

## 受け入れ基準
- [ ] 要件定義を改訂する: 1.3 と 3.2 からブログを外し、4.1 サイトマップと 4.2 コンテンツモデルに `posts` を追加。12 章の未決事項に、ブログを置く判断をした日付と理由を残す
- [ ] `posts` コレクションを追加する（`type: 'content'`）
  - `title`、`date`（`isoDate`）、`description`（meta description 兼一覧の要約）、`tags: string[]`、`draft: boolean`（既定 `false`）、`updated?`（`isoDate`）
- [ ] `@astrojs/mdx` を導入し、`.md` と `.mdx` の両方を受け付ける
- [ ] `/blog/` 一覧ページ: 新しい順、年でグルーピング（既存の talks 一覧の UI に揃える）。`draft: true` は本番ビルドで除外し、`pnpm dev` では表示する
- [ ] `/blog/[slug]/` 詳細ページ: 公開日・更新日（`<time datetime>`）、タグ、前後の記事へのリンク
- [ ] 構造化データ `BlogPosting` を詳細ページに出す
- [ ] ヘッダのナビゲーションに「ブログ」を追加する
- [ ] RSS フィード `/blog/rss.xml`（`@astrojs/rss`）
- [ ] 記事本文のタイポグラフィ（見出し、表、図のキャプション、脚注）を `typography.css` のトークンで整える。表は横スクロール可能なラッパーで囲み、320px 幅で崩れないようにする
- [ ] 記事の追加手順を README に書き、`docs/templates/post.mdx.template` を用意する
- [ ] サンプル記事 1 本（`draft: true`）で、lint / check / build が 0 errors

## 成果物
- `src/content/config.ts`（`posts` 追加）
- `src/pages/blog/index.astro`、`src/pages/blog/[...slug].astro`、`src/pages/blog/rss.xml.ts`
- `astro.config.mjs`（mdx 追加）
- `docs/requirements.md`、`README.md`、`docs/templates/post.mdx.template`

## 設計判断
- **`posts` はテーマを決め打ちしない。** 決算分析専用のフィールド（クラブ、シーズン等）を frontmatter に持たせない。記事とデータのつながりは、MDX 内で図コンポーネントに引数を渡して表現する。
- **MDX を選ぶ理由。** 図を記事中の任意の位置に置けるのは MDX だけである。`@astrojs/mdx` は build 時に処理され、クライアント JS を増やさない。
- **カテゴリではなくタグ。** 記事数が少ないうちは階層を作らない。

## 依存
- なし（task-002 と並行して進められる）
