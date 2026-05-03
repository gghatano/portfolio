# Phase 1 / Task 002: Content Collections + Zod スキーマ

## ステータス
- 完了 (2026-05-03)

## 背景
要件定義 4.2 のコンテンツモデルを Astro Content Collections + Zod で厳格に定義する。スキーマ違反でビルドが落ちる運用を担保する。

## 受け入れ基準
- [x] `profile`（singleton）/ `career` / `talks` / `publications` / `affiliations` の 5 コレクションを定義
- [x] enum (`talks.type`、`publications.type`、`talks.language`) を `z.enum([...])` で網羅
- [x] 日付フィールドは `YYYY-MM-DD` を `z.string().regex(...)` で検証
- [x] YAML frontmatter が日付を Date 型に自動変換する問題を `union([string, date]).transform(...)` で吸収
- [x] サンプルデータでビルドが落ちないこと

## 成果物
- `src/content/config.ts`（スキーマと型 export）
- サンプルコンテンツ:
  - `src/content/profile/main.json`
  - `src/content/career/{2014-2018,2018-2022,2018-current}.json`
  - `src/content/talks/{2023-builderscon-lt,2024-tskaigi,2025-jsconf-jp}.md`
  - `src/content/publications/{2023-magazine-typescript,2024-sigse-quality}.md`
  - `src/content/affiliations/{oss-community,sig-se}.json`

## 設計判断
- `talks` / `publications` を `type: 'content'` にし、frontmatter のメタデータと本文（abstract）を分離。要件 4.2 の `abstract_md?` フィールドは body で代替。
- `period_end` は `"present"` を許容するため `z.union([yearMonth, z.literal('present')])`。
- 著者表記の自分マーカーは `**name**`。`src/lib/authors.ts` で `<strong class="self">` に展開。
