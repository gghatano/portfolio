---
description: メモまたは Issue から論文・寄稿エントリ (src/content/publications/<slug>.md) を生成する
argument-hint: <メモ or #issue番号>
allowed-tools: Bash, Read, Write
---

メモまたは GitHub Issue を解析し、`src/content/publications/<slug>.md` を作成します。

## 入力解析

`$ARGUMENTS` は次のいずれか:
- `123` / `#123` のような数字 → `gh issue view <#> --json title,body,labels` で取得
- それ以外 → free-form のメモ
- 空 → 入力を求める

## 抽出するフィールド

スキーマは [`src/content/config.ts`](../../src/content/config.ts) を真とする。

| フィールド | 必須 | 値 |
| --- | --- | --- |
| date | ✓ | YYYY-MM-DD |
| title | ✓ | タイトル |
| authors | ✓ | 1 つ以上。自分は `**...**` で囲む |
| venue | ✓ | 学会名・誌名 |
| type | ✓ | journal / conference / book / chapter / preprint / magazine |
| doi |  | DOI（`10.xxxx/...`） |
| pdf_url |  | PDF URL |
| links |  | `{ label, url }` 配列 |
| bibtex |  | BibTeX エントリ（複数行） |
| (本文) | ✓ | アブストラクト |

## 手順

1. 入力を解析。
2. フィールドを抽出。`type` の判定が曖昧なときは 1 件推測して確認:
   - 学術誌・査読付き → `journal`
   - 国際会議 / 研究会 → `conference`
   - 商業書籍（単著・共著） → `book`
   - 書籍の章 → `chapter`
   - arXiv / 査読前 → `preprint`
   - 一般雑誌・Web メディア寄稿 → `magazine`
3. authors の中で「自分」が判別できるならその 1 件を `**...**` で囲む。判別できなければユーザーに尋ねる。
4. 必須フィールドが不足していればユーザーに問い合わせる。
5. slug を生成: `<YYYY>-<媒体や論文の短いキーワード>` の kebab-case（例: `2025-icse`、`2024-tse`、`2025-magazine-001`）。衝突時は末尾を足す。
6. [`docs/templates/publication.md.template`](../../docs/templates/publication.md.template) を Read してフォーマットを確認。
7. `src/content/publications/<slug>.md` を Write。任意フィールドは値が無ければ frontmatter から省略。`bibtex` は YAML の block scalar (`|`) で書く。
8. `pnpm exec astro check` を実行してスキーマ検証。
9. 作成したファイルパス、slug、主要フィールド要約を 3〜5 行で報告。

## 注意

- 共著者の氏名は本人の許諾なしに勝手に変更しない。Issue / メモにある通りに記載する。
- `doi` は `https://doi.org/` のプレフィックスを含めず、`10.xxxx/...` 部分だけにする（プレフィックスはレンダリング側で付ける）。
- worktree で作業すること（CLAUDE.md ルール）。
