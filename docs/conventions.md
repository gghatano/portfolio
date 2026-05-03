# 実装規約

要件定義 5.6（保守性）で参照される本書。半年後の自分が触れることを優先し、過剰な抽象化は避ける。

## 1. ディレクトリ構成

```
src/
├── pages/         # ルーティング。ファイルパス = URL（trailingSlash: 'always'）
├── layouts/       # ページ全体のレイアウト
├── components/
│   ├── nav/       # サイト共通の導線（ヘッダ・フッタ・テーマトグル）
│   ├── lists/     # 一覧・行・小型 UI
│   └── meta/      # head 内に挿入されるメタ系
├── content/
│   ├── config.ts  # Zod スキーマ。コレクションの単一真実
│   ├── profile/   # singleton（main.json）
│   ├── career/    # JSON 複数
│   ├── talks/     # Markdown 複数
│   ├── publications/
│   └── affiliations/
├── styles/
│   ├── tokens.css      # CSS Variables（色・タイポ・余白）
│   ├── reset.css       # 最小限のリセット
│   └── typography.css  # html / 見出し / 段落の既定
└── lib/                # 関数だけのユーティリティ（コンポーネントを置かない）
```

要件定義 8 章の構成に準拠。逸脱する場合は本書を更新。

## 2. 命名規則

| 種類 | ルール | 例 |
| --- | --- | --- |
| ファイル / ディレクトリ | kebab-case | `entry-row.astro` ではなく **PascalCase が慣例の Astro コンポーネントのみ** PascalCase（下記） |
| Astro コンポーネント | PascalCase | `EntryRow.astro`、`SectionHeader.astro` |
| TS / TS module | kebab-case | `format.ts`、`labels.ts` |
| コレクション内ファイル | kebab-case + `<year>-<keyword>` | `2025-jsconf-jp.md`、`2018-2022.json` |
| CSS class | kebab-case | `.row-title`、`.year-heading` |
| CSS Variable | `--<カテゴリ>-<役割>` | `--c-text-muted`、`--space-5` |
| TS 識別子 | camelCase（型は PascalCase） | `formatYearMonth`、`type TalkType` |

`/Users/...` のような OS 固有絶対パスは書かない。インポートは `~/lib/...` のエイリアスを優先。

## 3. TypeScript

- `tsconfig.json` の strict / `noUncheckedIndexedAccess` / `noImplicitOverride` を維持。緩めない。
- `any` / `as unknown as T` / `@ts-ignore` 禁止。やむを得ない場合は 1 行コメントで理由を残す。
- Astro コンポーネントの props は `interface Props { ... }` で必ず明示。
- Content Collections のエントリ型は **`CollectionEntry<'collection'>` から得る**。再定義しない。
- enum はスキーマ側で `z.enum([...])` を真とし、表示ラベルは `src/lib/labels.ts` に切り出す（`Record<EnumType, string>` で網羅性を担保）。

## 4. Astro

- 静的書き出しで済むものに `client:*` を付けない。フィルタやテーマトグル程度の小さなページスクリプトは inline `<script>` で書き、必要なら `is:inline` を明示する（JSON-LD 用途は明示）。
- 内部リンクは `src/lib/url.ts` の `url()` を経由。`href="/career/"` のような直書き禁止（`SITE_BASE` 切替で壊れる）。
- 外部リンクは `<ExternalLink>` を経由。`target="_blank"` + `rel="noopener noreferrer"` + 視覚的な外部リンク標識（↗）と sr-only 注記が自動で付く。
- 画像を入れる場合は `astro:assets` の `<Image>` を使い、`width` / `height` を必ず指定（CLS 対策）。
- `getCollection` の sort は `(a, b) => b.data.date.localeCompare(a.data.date)` を基本（最新が先頭）。

## 5. コンテンツスキーマ

[`src/content/config.ts`](../src/content/config.ts) を真実とする。

- 日付は `YYYY-MM-DD`（`isoDate`）または `YYYY-MM` / `"present"`（`yearMonthOrPresent`）。
- YAML frontmatter は `YYYY-MM-DD` を Date オブジェクトに自動変換するため、`isoDate` 内で `union([string, date]).transform(...)` で文字列に正規化してから検証している。手書きで `date: "2024-01-01"` のようにクオートするより、スキーマ側で吸収する。
- `enum` を増やすときは:
  1. `config.ts` に追加
  2. `src/lib/labels.ts` の `Record<...>` も同時に追加（網羅性の型エラーで気付ける）

## 6. CSS / デザイントークン

- 色・余白・タイポはすべて [`src/styles/tokens.css`](../src/styles/tokens.css) の CSS Variables。コンポーネントに hex 値を直書きしない。
- ライト／ダークは `prefers-color-scheme` 自動 + `data-theme="light"|"dark"` ユーザー上書き。トークンを 3 箇所定義（`:root` / `@media dark` / `[data-theme=...]`）。値変更時はすべてに反映する。
- アクセント色 `--c-accent` の用途は最大 3 つに限定（current page、hover、blockquote）。フィルタの押下状態のような「選択中」ロールは current page と同じ役割として共有する。
- 純黒 `#000` / 純白 `#fff` を本文・背景に使わない。warm な near-black / near-white を使う。
- セレクタは Astro の scoped style（`<style>`）を基本とする。グローバルが必要なら `:global(...)` を明示。
- `!important` 禁止。
- spacing は `--space-1` 〜 `--space-9` から選ぶ。新しい値が欲しい場合はトークンを増やす。

## 7. アクセシビリティ

- すべての操作要素は `<a>` または `<button>`。div / span を click 可能にしない。
- タップターゲット 44×44px 以上（WCAG 2.5.5）。`min-height: 44px` を tap 可能要素には付ける。
- フォーカスリングは `reset.css` で `:focus-visible` に統一定義。コンポーネントで `outline: none` しない。
- 装飾画像は `alt=""`、意味のある画像は `alt` 必須。アイコンのみのリンクには `aria-label`。
- `prefers-reduced-motion: reduce` ですべてのアニメ・トランジションを最小化（`reset.css` で対応済）。
- 各ページ `<h1>` は 1 つ。階層を飛ばさない（h1→h3 はダメ、h1→h2→h3）。

## 8. パフォーマンス

- 初期 JS バンドル < 50KB（gzip）を予算とする。`client:*` を増やす前にこの予算を意識する。
- フォントは将来 self-host (`public/fonts/`) + WOFF2 + サブセット化。
- 画像は `<Image>` 経由で AVIF/WebP 変換。
- `<time>` 要素の `datetime` 属性は **必ず ISO 形式**。表示用と機械可読用は `EntryRow` で別 prop に分けている。

## 9. メタ情報

- 各ページに固有の `<title>` / `<meta description>`。`BaseLayout` の props で必ず指定する。
- canonical URL は `Astro.site` + path から生成。
- OG 画像 `public/og/default.png` が未生成のうちは `<Meta>` が `og:image` を出さない（404 を踏ませない）。生成後はデフォルトとして使われる。
- 構造化データ:
  - ホーム: `Person`
  - 論文詳細: `ScholarlyArticle`
  - 発表詳細: `PresentationDigitalDocument`（動画あり）または `Event`（なし）

## 10. セキュリティ・プライバシー

- third-party script はゼロが原則。導入時は要件 5.5 に従い理由を README に記載。
- 外部リンクは `<ExternalLink>` 経由で `rel="noopener noreferrer"` を付ける。
- メールアドレスは静的 HTML に直書きしない（`href="mailto:..."` を JS で組み立てる）。
- `<meta name="referrer" content="strict-origin-when-cross-origin">` を `BaseLayout` で固定。
- リポジトリに secrets / `.env` を置かない（`.gitignore` で除外済）。

## 11. ファイル変更時のチェックリスト

```sh
pnpm lint     # biome
pnpm check    # astro check (typecheck)
pnpm build    # ビルドが通るか
```

3 つすべて 0 errors を守る。コンテンツのスキーマ違反は `pnpm build` で落ちる設計なので、build は省略しない。
