# 要件定義書: 自己紹介・取り組みまとめサイト

最終更新: 2026-05-03 / ステータス: ドラフト v0.1

---

## 1. プロジェクト概要

### 1.1 目的
個人の経歴・発表・論文・所属団体・取り組みを一望できる、自己紹介ハブとなる静的サイトを GitHub Pages 上に公開する。読み手が短時間で「この人が何者で、何をやってきて、どこに連絡すればよいか」を把握できることを最重要とする。

### 1.2 背景・動機
- SNS や所属組織のページは情報が断片化しやすく、最新版が一箇所にまとまっていない。
- 名刺代わりとなる単一 URL を持ち、登壇・寄稿・論文の問い合わせ起点にしたい。
- AI ツールで生成されがちなテンプレート的見た目（後述「6. デザイン方針」）を意図的に避け、本人の趣味や姿勢が伝わる体裁にしたい。

### 1.3 ノンゴール
- ブログ／長文記事システム（必要になったら別サブドメイン or 別リポジトリで拡張）。
- CMS／管理画面。コンテンツ追加は Markdown + git push で完結する。
- 多言語対応（現時点では日本語のみ。論文タイトル等の英語混在は許容）。
- 動的機能（コメント、検索 API、フォーム送信処理など）。
- アクセス解析・トラッキング（プライバシー優先。導入する場合は別途意思決定する）。

---

## 2. 想定読者

| # | 読者像 | 流入経路 | 知りたいこと |
| - | --- | --- | --- |
| P1 | 同業エンジニア・OSS コミュニティ | SNS / 登壇イベント / GitHub | プロフィール、過去の発表、技術的な取り組み、連絡先 |
| P2 | 採用担当・カジュアル面談相手 | 紹介 / SNS | 経歴・スキル感・直近のアウトプット |
| P3 | イベント主催者・編集者 | 登壇後 / 記事寄稿打診 | 登壇実績・寄稿実績・連絡手段 |
| P4 | 学生・初学者 | 検索 / 登壇後 | どのような道筋でキャリアを歩んできたか |

サイト全体の文体・情報量は **P1 と P3 を主軸** とし、P2/P4 が読んでも疎外感のない構成にする。

---

## 3. スコープ

### 3.1 含むもの
- ホーム（自己紹介・サマリー）
- 経歴（職歴・学歴・資格）
- 発表（登壇・講演）
- 論文・寄稿
- 所属団体・コミュニティ
- 連絡先（メール、SNS、GitHub など）
- メタ情報（OGP、sitemap、構造化データ、favicon、404 ページ）

### 3.2 含まないもの
- 認証・会員機能
- 多言語切替 UI
- 全文検索
- ブログ／RSS（将来検討）
- 問い合わせフォーム送信処理（メールリンク or SNS DM 誘導で代替）

---

## 4. 機能要件

### 4.1 サイトマップ

```
/                       ホーム（ヒーロー + 自己紹介 + 各セクションへの導線）
/career/                経歴一覧
/talks/                 発表一覧
/talks/[slug]/          発表詳細（必要な場合のみ生成）
/publications/          論文・寄稿一覧
/publications/[slug]/   論文詳細（abstract を出すため詳細あり推奨）
/affiliations/          所属団体・コミュニティ
/contact/               連絡先（または / の末尾セクションでも可）
/404                    404 ページ
```

詳細ページの粒度は「**一覧で十分なものは詳細を作らない**」を原則とする。論文は詳細推奨、発表はスライド/動画 URL があるなら詳細あり、無ければ一覧の行内リンクで十分。

### 4.2 コンテンツモデル（Astro Content Collections）

Zod スキーマでの厳格バリデーションを必須とする。型は `src/content/config.ts` に集約。

#### 4.2.1 `profile`（singleton）
- `name_ja: string`
- `name_en?: string`
- `tagline: string` … 1 行プロフィール
- `bio_md: string` … 数段落の自己紹介本文
- `avatar?: string` … `public/` 配下の画像パス
- `links: { label: string; url: string; rel?: string }[]`

#### 4.2.2 `career`（複数）
- `period_start: YYYY-MM`
- `period_end?: YYYY-MM | "present"`
- `organization: string`
- `role: string`
- `location?: string`
- `summary?: string`
- `highlights?: string[]` … 箇条書き

#### 4.2.3 `talks`（複数）
- `date: YYYY-MM-DD`
- `title: string`
- `event: string`
- `location?: string`
- `type: "keynote" | "invited" | "oral" | "poster" | "lt" | "panel"`
- `language: "ja" | "en"`
- `slides_url?: string`
- `video_url?: string`
- `abstract_md?: string`

#### 4.2.4 `publications`（複数）
- `date: YYYY-MM-DD`
- `title: string`
- `authors: string[]` … 自分は `**` などのマーカーを付ける運用ルールを README に書く
- `venue: string`
- `type: "journal" | "conference" | "book" | "chapter" | "preprint" | "magazine"`
- `doi?: string`
- `pdf_url?: string`
- `links?: { label: string; url: string }[]`
- `abstract_md?: string`

#### 4.2.5 `affiliations`（複数）
- `period_start: YYYY-MM`
- `period_end?: YYYY-MM | "present"`
- `organization: string`
- `role?: string`
- `summary?: string`
- `url?: string`

### 4.3 表示・操作要件

- 一覧は **新しい順** がデフォルト。年でグルーピングする UI を基本とする。
- 各一覧に `type` での絞り込みを置く（クエリパラメータでなく軽量な JS フィルタでよい。JS 無効でも一覧は閲覧可能）。
- ホームには各セクションの直近 3 件をプレビューし「もっと見る」リンクを置く。
- パンくずは詳細ページのみ。
- 外部リンクは新規タブ + `rel="noopener noreferrer"`。アイコン等で外部リンクであることを示す。
- 空セクション（例: 論文ゼロ）でもレイアウト崩れしない空状態 UI を持つ。

### 4.4 メタ情報・配信

- ページごとに固有の `<title>` と `<meta description>` を持つ。
- OGP: `og:title` `og:description` `og:image` `og:type` `og:url`。
- Twitter Card: `summary_large_image`。
- OG 画像はサイト共通テンプレ（タイトル + 名前）を 1200×630 で生成。論文詳細ページは可能なら個別生成（Phase 後半で対応）。
- 構造化データ (JSON-LD):
  - `Person`（ホーム）
  - `ScholarlyArticle`（論文詳細）
  - `Event` / `PresentationDigitalDocument`（発表詳細、可能であれば）
- `sitemap.xml` と `robots.txt` を生成。
- `favicon.svg` + `apple-touch-icon.png`。

### 4.5 コンテンツ追加フロー

`README.md` に以下が 10 分以内で完了する手順として記載されること:

1. 該当コレクションの Markdown / JSON ファイルを追加。
2. `pnpm dev` でプレビュー確認。
3. PR を作成。CI が schema 違反・lint・build・lighthouse をチェック。
4. main マージで自動デプロイ。

---

## 5. 非機能要件

### 5.1 パフォーマンス
- Lighthouse（モバイル）: Performance / Accessibility / Best Practices / SEO すべて **90 以上**、Accessibility は 100 を目標。
- LCP < 2.5s（Slow 4G、Moto G4 相当のシミュレーション）。
- CLS < 0.1。
- INP（タップ応答）目標 < 200ms。
- 初期 JS バンドル < 50KB（gzip）。Astro Islands を使う場合も最小限に。
- 画像は Astro `<Image>` で AVIF/WebP に変換、`width`/`height` 必須。
- フォントは `font-display: swap` + サブセット化を検討。WOFF2 + ローカルホスト。

### 5.2 アクセシビリティ
- WCAG 2.1 AA 準拠。
- セマンティック HTML（heading 階層を `<h1>` 1 つ + `<h2>` 〜 を順守）。
- すべての操作要素がキーボードで到達・操作可能。フォーカスリング非表示禁止。
- 文字色とのコントラスト比: 通常テキスト 4.5:1、大文字テキスト 3:1 以上。
- `prefers-reduced-motion: reduce` を尊重し、装飾アニメーションを無効化。
- `prefers-color-scheme` でライト／ダーク自動切替。明示切替トグルも提供を推奨。
- タップターゲット 44×44px 以上。
- 画像に `alt`、装飾画像は空 `alt`。
- 言語属性: `<html lang="ja">`。

### 5.3 ブラウザ・デバイス対応
- 最新 2 バージョンの Chrome / Firefox / Safari / Edge。
- iOS Safari / Android Chrome の最新 2 バージョン。
- IE は非対応。
- 画面幅 320px から最大 1440px までで破綻しない。

### 5.4 SEO
- 各ページ固有の title / description。
- 論文は構造化データで Google Scholar に拾われやすい形を意識。
- canonical URL を全ページで明示。
- robots.txt で `Sitemap:` を宣言。

### 5.5 セキュリティ・プライバシー
- 個人情報（住所・電話など）は載せない。連絡はメール・SNS のみ。
- メールアドレスは画像化または mailto + 簡易難読化。
- 写真をアップロードする場合は EXIF（GPS 等）を事前に除去。
- 外部リンクは `rel="noopener noreferrer"`。
- third-party script ゼロを基本。導入する場合は理由とプライバシー影響を README に明記。
- リポジトリに秘匿情報をコミットしない（`.env` 不要だが念のため `.gitignore` 整備）。

### 5.6 保守性
- TypeScript strict。`any` 禁止。
- Content Collections の Zod スキーマと UI 型は同一 source of truth。
- コンポーネント命名・配置規約を `docs/conventions.md` に持つ（実装フェーズで作成）。
- Storybook 等は導入しない（オーバースペック）。代わりに `/_dev/` 配下に視覚回帰用の見本ページを置く案を残す。

---

## 6. デザイン方針

### 6.1 アンチパターン（避けたい "Claude Code にありがちな見た目"）
以下を意図的に避ける。これは趣味の問題ではなくサイトの差別化要件である。

1. **ターミナル風ダーク + monospace 全面採用**。コードを書く人なら通る道だが、本人らしさが消える。
2. **Tailwind 既定の `slate`/`zinc` グレーと既定 `blue-500` アクセント** の組み合わせ。AI 生成サイトの典型色。
3. **ヒーローに虹色グラデーションテキスト**。`bg-gradient-to-r from-purple-500 to-pink-500` の類。
4. **ガラスモーフィズム多用**（`backdrop-blur` + 半透明カード）。
5. **全セクションがカードグリッド**。リスト・テーブル・記事レイアウトの使い分けが消える。
6. **過剰な絵文字 / Lucide アイコン乱用**。各見出しに飾りアイコンを付けない。
7. **派手なグラデーション背景**（紫→青のフルブリード等）。
8. **過剰なフレーマーモーション系入場アニメ**。スクロールでフェードイン連発。
9. **AI 生成画像をプロフィール／ヒーローに使う**。
10. **やたら太い rounded-2xl のシャドウ付きカード**。

### 6.2 取りたい方向性
- **エディトリアル（紙の雑誌・学術誌）の情報設計** に学ぶ。タイポと余白で語る。
- **本文中心**。ヒーローも装飾より内容。
- **静的さの良さ**。スクロールで派手な変化は要らない。
- **個人らしさ**。色・タイポ・1 枚の画像など、1 つでよいので "らしさ" の手掛かりを置く。

### 6.3 タイポグラフィ
- 本文サイズ 16〜18px、行間 1.7〜1.9。
- 和文: Noto Sans JP / IBM Plex Sans JP / 源ノ角ゴシック等から 1 つ。
- 欧文: Inter / IBM Plex Sans / Söhne 系 など、和文と x-height が揃うものを選ぶ。
- 見出しは type scale ratio 1.2〜1.333。weight 差で階層を作る（巨大化に頼りすぎない）。
- 数字は tabular-nums を有効化（年表で揃う）。
- ローカルホスト・WOFF2・サブセット化。

### 6.4 カラー
- パレットは **アクセント 1 色 + ニュートラル 5〜7 段階**。
- 純黒 `#000` / 純白 `#fff` を避け、わずかに色味のある near-black / near-white を使う。
- ライト／ダーク両対応。`prefers-color-scheme` 自動 + 明示切替。
- アクセント色は「現在のページ・hover・引用線」など用途を 3 つ以下に限定。

### 6.5 レイアウト
- 1 カラム基調。本文 max-width 約 680〜760px。
- リストは 1080〜1200px まで広げてよい。
- セクション間の `padding-block` を大きめに取り、視覚的な呼吸を作る。
- 罫線・余白で区切る。シャドウ付きカードに頼らない。
- グリッドにわずかな非対称性（タイトルと本文がずれる、年がはみ出す等）を許容する。

### 6.6 モーション
- スクロールフェードイン等の入場演出は **使わない**。
- hover / focus の微細なフィードバックのみ（150ms 程度の color/underline 変化）。
- `prefers-reduced-motion` 尊重。

---

## 7. 技術スタック

| 層 | 採用 | 補足 |
| --- | --- | --- |
| フレームワーク | Astro (latest) | 静的書き出し中心。MDX は必要になったら追加 |
| 言語 | TypeScript strict | `any` 禁止 |
| コンテンツ | Astro Content Collections + Zod | スキーマ検証必須 |
| スタイル | Astro scoped styles + CSS Variables | デザイン独自性のため Tailwind は使わない（必要になればトークン層のみ流用検討） |
| パッケージマネージャ | pnpm | lockfile を含めてコミット |
| Lint / Format | Biome | ESLint + Prettier の二本立てを避け軽量化 |
| 画像 | Astro `<Image>` + sharp | AVIF/WebP 自動 |
| デプロイ | GitHub Actions + `actions/deploy-pages` | main ブランチへの push でビルド・公開 |
| 品質 CI | Lighthouse CI | PR でモバイル計測、しきい値違反で fail |
| アクセシビリティ CI | `@axe-core/cli` または `pa11y-ci` | 主要ページのみ対象 |

公開先は **未定**:
- ユーザーサイト `<username>.github.io` の場合 `base: '/'`。
- プロジェクトサイトの場合 `base: '/<repo>/'` を環境変数 `SITE_BASE` で切替可能にする。
- 実装時はどちらでも壊れないよう、内部リンクは Astro の `import.meta.env.BASE_URL` 経由で組み立てる。

---

## 8. リポジトリ構成（実装時の指針）

```
.
├── astro.config.mjs
├── package.json
├── tsconfig.json
├── biome.json
├── public/
│   ├── favicon.svg
│   ├── og/
│   └── fonts/
├── src/
│   ├── pages/
│   │   ├── index.astro
│   │   ├── career/index.astro
│   │   ├── talks/index.astro
│   │   ├── talks/[...slug].astro
│   │   ├── publications/index.astro
│   │   ├── publications/[...slug].astro
│   │   ├── affiliations/index.astro
│   │   ├── contact/index.astro
│   │   └── 404.astro
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── components/
│   │   ├── nav/
│   │   ├── lists/
│   │   ├── meta/
│   │   └── ui/
│   ├── content/
│   │   ├── config.ts
│   │   ├── profile/
│   │   ├── career/
│   │   ├── talks/
│   │   ├── publications/
│   │   └── affiliations/
│   ├── styles/
│   │   ├── tokens.css
│   │   ├── reset.css
│   │   └── typography.css
│   └── lib/
└── docs/
    ├── requirements.md           ← 本書
    ├── review-personas/
    └── tasks/
        └── phase-NN/task-MMM.md
```

CLAUDE.md 規約に従い、開発は **mainブランチ直下では行わず**、`gitworktree/feature-<task番号>-<keyword>` に worktree を切って行う。

---

## 9. 開発・レビュー・デプロイフロー

1. **タスク定義**: `docs/tasks/phase-NN/task-MMM.md` に背景・受け入れ基準・関連ファイルを記述。
2. **worktree 作成**: `gitworktree/feature-<タスク番号>-<キーワード>` でブランチを切る。
3. **実装**: Astro dev で確認しながら進める。
4. **セルフレビュー**: 後述レビューペルソナ全 6 種のチェックリストを自分で通す。
5. **PR 作成**: テンプレに「どのペルソナの観点で確認したか」「未対応事項」を記載。
6. **CI**: build / lint / typecheck / lighthouse / a11y。
7. **マージ**: GitHub Actions で `actions/deploy-pages` 経由公開。

---

## 10. マイルストーン

| Phase | ゴール | 主な成果物 |
| --- | --- | --- |
| 0 | 要件・デザイン方針確定 | 本書、レビューペルソナ、ワイヤーフレーム |
| 1 | プロジェクト基盤 | Astro セットアップ、Content Collections、tokens、BaseLayout |
| 2 | ホーム + 経歴 | `/`、`/career` 完成 |
| 3 | 発表 + 論文 | `/talks`、`/publications` 一覧/詳細 |
| 4 | 所属団体 + 連絡先 + メタ | `/affiliations`、`/contact`、OGP、sitemap、構造化データ |
| 5 | 仕上げ | Lighthouse / a11y チューニング、404、OG 画像、コピー調整 |
| 6 | 公開 | GitHub Pages 公開、独自ドメイン検討（任意） |

---

## 11. 受け入れ基準（Phase 6 終了時）

- [ ] 全主要ページで Lighthouse モバイル 90 以上、Accessibility 100。
- [ ] WCAG 2.1 AA 自動チェック (axe / pa11y) でクリティカル指摘ゼロ。
- [ ] 320px〜1440px 幅で表示崩れなし。
- [ ] 全コレクションでスキーマ違反時に build が落ちることを確認。
- [ ] 各ページ固有の title / description / OGP 画像が出る。
- [ ] レビューペルソナ 6 種すべての必須チェック項目をパス。
- [ ] README に新規発表・新規論文の追加手順が記載されており、未経験者が 10 分以内に追加できる。
- [ ] 第三者（同業エンジニアまたは編集者役）に「テンプレ感」「Claude Code っぽさ」がないか確認してもらい、合意を得る。

---

## 12. 未決事項 / 今後の意思決定

- 公開先リポジトリ形態（ユーザーサイト or プロジェクトサイト）。
- 独自ドメイン利用の有無。
- ライト／ダーク手動切替トグルの提供有無。
- アクセス解析の導入可否（プライバシー優先で原則なしを推奨）。
- アバター画像の素材（撮影 / イラスト / なし）。
- 連絡先の出し方（メール直書き / 画像化 / フォームサービス）。

---

## 13. 参考: レビュー観点の概要

詳細は `docs/review-personas/` 配下を参照。

| # | ペルソナ | 主な観点 |
| - | --- | --- |
| 01 | モダンデザイン批評家 | テンプレ感の検出、タイポ・色・レイアウトの独自性 |
| 02 | フロントエンド・コード品質 | Astro / TS / Content Collections 実装品質 |
| 03 | アクセシビリティ・ユーザビリティ | WCAG、キーボード、コントラスト、UX |
| 04 | パフォーマンス・配信・SEO | Lighthouse、Core Web Vitals、メタ・構造化データ |
| 05 | コンテンツ・ナラティブ | 何を語るか、誰に届くか、文体一貫性 |
| 06 | セキュリティ・プライバシー | PII 露出、外部依存、公開倫理 |
