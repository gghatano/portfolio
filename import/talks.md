# talks

`/bulk-import talks` で `src/content/talks/<slug>.md` に分解。

| slug | date | title | event | location | type | language | slides_url | video_url | url |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
<!--
| 2026-jsconf | 2026-03-15 | 型で表すコンテンツ | JSConf JP 2026 | 東京 | invited | ja | https://example.com/slides/jsconf-jp-2026 | https://example.com/videos/jsconf-jp-2026 | https://example.com/jsconf-jp-2026 |
| 2024-tskaigi | 2024-05-11 | 型を抜けないドメインモデリング | TSKaigi 2024 | 東京 | oral | ja | https://example.com/slides/tskaigi-2024 |  |  |
-->

## 列の意味

- `slug` (必須): ファイル名 (kebab-case)。`<YYYY>-<event>` 推奨
- `date` (必須): `YYYY-MM-DD`
- `title` / `event` (必須)
- `location`: 任意
- `type` (必須): `keynote` / `invited` / `oral` / `poster` / `lt` / `panel`
- `language` (必須): `ja` / `en`
- `slides_url` / `video_url` / `url`: 任意

## body: <slug>

abstract（必須）。詳細ページの「概要」として表示される。

<!--
## body: 2026-jsconf
発表アブスト本文。複数段落 OK。
-->
