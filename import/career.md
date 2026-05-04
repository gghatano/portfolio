# career

`/bulk-import career` で `src/content/career/<slug>.json` に分解。

| slug | period_start | period_end | organization | role | location | summary | highlights | url |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
<!--
| 2018-current | 2022-04 | present | 株式会社サンプル | シニアソフトウェアエンジニア | 東京 | プロダクトの基盤チームで開発生産性とリリース品質に責任を持つ。 | モノレポ CI 高速化（30 分→7 分）; 観点ドキュメント整備 | https://example.com/sample-corp |
| 2014-2018 | 2014-04 | 2018-03 | ○○大学 △△研究科 | 修士課程 / 学部 | 東京 |  |  |  |
-->

## 列の意味

- `slug` (必須): ファイル名 (kebab-case)
- `period_start` (必須): `YYYY-MM`
- `period_end`: `YYYY-MM` または `present`
- `organization` / `role` (必須)
- `location` / `summary` / `url`: 任意
- `highlights`: セミコロン `;` 区切り（要素内にカンマを含み得るため）

career には body セクションは無い（すべて表のセルに収まる）。
