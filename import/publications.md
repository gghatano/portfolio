# publications

`/bulk-import publications` で `src/content/publications/<slug>.md` に分解。

| slug | date | title | authors | venue | type | doi | pdf_url | links | url |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
<!--
| 2024-sigse-quality | 2024-08-30 | コードレビュー観点ドキュメントが欠陥検出に与える影響 | **畑野 拓馬**; 山田 太郎; 佐藤 花子 | 情報処理学会 SIGSE | conference | 10.0000/sample.2024.0001 | https://example.com/pdfs/sigse-2024.pdf | スライド=https://example.com/slides/sigse-2024 |  |
-->

## 列の意味

- `slug` (必須): ファイル名 (kebab-case)
- `date` (必須): `YYYY-MM-DD`
- `title` (必須)
- `authors` (必須): セミコロン `;` 区切り。**自分は `**...**` で囲む**
- `venue` (必須): 学会名・誌名
- `type` (必須): `journal` / `conference` / `book` / `chapter` / `preprint` / `magazine`
- `doi`: `10.xxxx/...` 部分のみ (`https://doi.org/` プレフィックス不要)
- `pdf_url` / `url`: 任意
- `links`: `ラベル=URL` をカンマ区切り

## body: <slug>

abstract（必須）。詳細ページの「概要」として表示される。

## bibtex: <slug>

bibtex（任意）。BibTeX エントリ全体を貼る。

<!--
## body: 2024-sigse-quality
社内 3 プロダクト計 12 名のコードレビューにおいて、観点ドキュメントの導入前後で検出された欠陥の種別と件数を比較した。

## bibtex: 2024-sigse-quality
@inproceedings{hatano2024review,
  author    = {Hatano, Takuma and Yamada, Taro and Sato, Hanako},
  title     = {Effect of Review-Perspective Documents on Defect Detection},
  booktitle = {SIGSE},
  year      = {2024}
}
-->
