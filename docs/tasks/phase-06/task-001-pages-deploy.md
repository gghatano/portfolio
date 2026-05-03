# Phase 6 / Task 001: GitHub Pages デプロイワークフロー

## ステータス
- 完了 (2026-05-03)

## 背景
要件定義 7 章（GitHub Actions + `actions/deploy-pages`）と Phase 6（公開）。`main` 更新時に自動で GitHub Pages にビルド・デプロイされる経路を作り、CI で lint / typecheck / build を強制する。

## 受け入れ基準
- [x] `.github/workflows/deploy.yml` を作成
- [x] `main` への push と手動実行（`workflow_dispatch`）の両方をトリガにする
- [x] CI が pnpm install → lint → typecheck → build を順に流す
- [x] `actions/upload-pages-artifact` + `actions/deploy-pages` で公開
- [x] プロジェクトサイト構成 (`/portfolio/`) で canonical / 内部リンク / sitemap が正しく出ることを検証
- [x] デフォルト構成（base path なし）も壊れないことをローカルで確認

## 成果物
- `.github/workflows/deploy.yml`
- README の「デプロイ」節を更新（公開先確定、初回セットアップ手順、TODO 整理）
- `src/components/meta/Meta.astro` の canonical を BASE_URL 対応に修正

## 設計判断
- 公開先は **プロジェクトサイト** `https://gghatano.github.io/portfolio/`。env (`SITE_URL`, `SITE_BASE`) で astro.config に渡し、ユーザーサイトや独自ドメインへの切替は env 変更だけで済む構造を保つ。
- `concurrency: pages` + `cancel-in-progress: false`。Pages は in-progress を中断せずキューイング（GitHub 推奨パターン）。
- pnpm のバージョンは workflow で `version: 10` に固定。`packageManager` フィールドが lockfile と整合。

## 検出して直したバグ
- `Meta.astro` の canonical が `Astro.url.pathname` を使うパスでは BASE_URL を含むが、`path` props を経由するパスでは BASE_URL を欠いていた。BASE_URL を内部で前置する実装に変更。

## 初回デプロイの注意
- GitHub の Settings → Pages → Source を **GitHub Actions** に設定する必要がある。`actions/configure-pages@v5` が自動有効化を試みるが、組織権限で失敗する場合は手動。
