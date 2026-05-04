# profile (singleton)

`/bulk-import profile` で `src/content/profile/main.json` に上書き保存。

| name_ja | name_en | tagline | avatar | links |
| --- | --- | --- | --- | --- |
<!--
| 畑野 拓馬 | Takuma Hatano | ソフトウェアエンジニア / 信頼できるシステムをつくる |  | GitHub=https://github.com/gghatano, X (Twitter)=https://x.com/example |
-->

## 列の意味

- `name_ja` (必須): 名前（日本語）
- `name_en`: 任意（ローマ字）
- `tagline` (必須): 1 行プロフィール
- `avatar`: 画像パス (`public/` からの相対) 任意
- `links`: `ラベル=URL` をカンマ区切り

## body: bio

bio_md（必須）。空行で段落区切り。複数段落 OK。

<!--
## body: bio
Web アプリケーションと開発基盤を中心に、運用に耐える設計を続けてきました。

このサイトは経歴・発表・寄稿・所属の起点として、SNS と論文インデックスの間にあるハブとして使うことを目的としています。
-->
