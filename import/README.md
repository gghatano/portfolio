# bulk-import

`import/<collection>.md` に Markdown 表形式でまとめて記載 → Claude Code で `/bulk-import <collection>` を実行すると、`src/content/<collection>/<slug>.{md,json}` に分解される。

## ファイル一覧

| コレクション | テンプレート | 出力先 | 拡張子 |
| --- | --- | --- | --- |
| profile (singleton) | [`profile.md`](profile.md) | `src/content/profile/main.json` | `.json` |
| career | [`career.md`](career.md) | `src/content/career/<slug>.json` | `.json` |
| talks | [`talks.md`](talks.md) | `src/content/talks/<slug>.md` | `.md` |
| publications | [`publications.md`](publications.md) | `src/content/publications/<slug>.md` | `.md` |
| affiliations | [`affiliations.md`](affiliations.md) | `src/content/affiliations/<slug>.json` | `.json` |
| products | [`products.md`](products.md) | `src/content/products/<slug>.json` | `.json` |

## フォーマット規約

### 表

- 1 行目: ヘッダ（フィールド名 / `slug` 列必須）
- 2 行目: separator (`---`)
- 3 行目以降: データ
- セル中で `|` を使いたい場合は `\|` でエスケープ
- 配列フィールドの区切り:
  - `tech`: カンマ `,`
  - `highlights`: セミコロン `;`（要素内にカンマが入りうるため）
  - `authors`: セミコロン `;`（自分は `**畑野 拓馬**` のように `**` で囲む）
  - `links`: `ラベル=URL` をカンマ区切り。例: `Repo=https://..., Live=https://...`
- 空セルはそのフィールドを省略（`null` を入れない）
- URL は `http(s)://` から始まる絶対 URL

### body セクション

長文（abstract / description_md / bio_md / bibtex）は表の下に `## body: <slug>` 見出しで本文を書く。
publications の `bibtex` だけは `## bibtex: <slug>` という別の見出し。

```markdown
## body: 2026-jsconf
本文段落 1。

本文段落 2。
```

## 実行

```
/bulk-import talks
/bulk-import publications
```

既存の slug と一致するファイルは上書きされる。`pnpm exec astro check` でスキーマ検証されるので、フィールド名や enum を間違えるとそこで落ちる。

## 注意

- worktree で作業すること（CLAUDE.md ルール）
- 投入後の変更は通常の Issue Form / `/add-*` / `/update-content` を使う（`import/*.md` は初期シードや一括差し替え用）
