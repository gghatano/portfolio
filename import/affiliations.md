# affiliations

`/bulk-import affiliations` で `src/content/affiliations/<slug>.json` に分解。

| slug | period_start | period_end | organization | role | summary | url |
| --- | --- | --- | --- | --- | --- | --- |
<!--
| ipsj-member | 2018-04 | present | 情報処理学会 (IPSJ) | 正会員 | ソフトウェア工学研究会 (SIGSE) の活動を中心に参加。 | https://www.ipsj.or.jp/ |
-->

## 列の意味

- `slug` (必須): ファイル名 (kebab-case)
- `period_start` (必須): `YYYY-MM`
- `period_end`: `YYYY-MM` または `present`
- `organization` (必須)
- `role` / `summary` / `url`: 任意

affiliations には body セクションは無い。
