---
description: import/<collection>.md の Markdown 表と body セクションを読んで src/content/<collection>/ に分解する
argument-hint: <products | talks | publications | career | affiliations | profile>
allowed-tools: Bash, Read, Write
---

`import/<collection>.md` を読み、Markdown 表 + body セクションを解析して個別ファイルに分解します。

## 引数

`$ARGUMENTS` は対象コレクション名:
- `products` / `talks` / `publications` / `career` / `affiliations` / `profile`
- 空 → 「どのコレクションか教えてください」

## 入力フォーマット

`import/<collection>.md` は次の構造:

```markdown
# <heading>

| slug | <field1> | <field2> | ... |
| --- | --- | --- | --- |
| <slug-1> | <val> | <val> | ... |
| <slug-2> | <val> | <val> | ... |

## body: <slug-1>
本文段落。複数段落可。

## body: <slug-2>
別の本文。
```

publications では `## bibtex: <slug>` も使える。

## 解析ルール

1. **表の認識**: 連続する `|` で始まる行のうち、`| --- |` で始まる separator 行とその直後の連続データ行を検出する。`<!-- ... -->` で囲まれた行は無視。
2. **空セル**: そのフィールドを省略する（`null` を入れない）。
3. **`|` のエスケープ**: セル内では `\|` を `|` に戻す。
4. **配列フィールド**:
   - `tech`: カンマ `,` 区切り
   - `highlights`: セミコロン `;` 区切り
   - `authors`: セミコロン `;` 区切り（要素は `**name**` 形式を保持）
   - `links`: カンマ区切り、各要素は `ラベル=URL` 形式 → `[{ label, url }]` に変換
5. **body セクション**: `^##\s+body:\s+(\S+)\s*$` で開始、次の `##` 見出しまでを本文とする。先頭/末尾の空行はトリム。
6. **bibtex セクション** (publications のみ): 同様に `^##\s+bibtex:\s+(\S+)\s*$` で開始。

## 出力

| collection | path | format |
| --- | --- | --- |
| products | `src/content/products/<slug>.json` | JSON |
| talks | `src/content/talks/<slug>.md` | frontmatter + body |
| publications | `src/content/publications/<slug>.md` | frontmatter (bibtex 含む) + body |
| career | `src/content/career/<slug>.json` | JSON |
| affiliations | `src/content/affiliations/<slug>.json` | JSON |
| profile | `src/content/profile/main.json` | JSON（slug は無視、必ず `main.json` に書く） |

body の対応:
- `talks`: body → md 本文
- `publications`: body → md 本文、bibtex → frontmatter `bibtex` フィールド
- `products`: body → JSON `description_md` フィールド
- `profile`: body → JSON `bio_md` フィールド

## 手順

1. `import/$ARGUMENTS.md` を Read。存在しなければエラー報告。
2. 表とすべての body / bibtex セクションを解析。
3. 各行を schema フィールドにマップ。schema は [`src/content/config.ts`](../../src/content/config.ts) を参照。
4. body セクションの内容を該当エントリに紐付け。
5. ファイルに書き出す（既存は上書き、idempotent）。
6. `pnpm exec astro check` を実行してスキーマ検証。
7. 完了報告: 処理した行数、スキップ数、書き出したパスのリスト、検証結果を 5〜10 行で。

## 注意

- `import/<collection>.md` の表が空（コメントアウトのみ）なら「データが無い」と報告して終了。
- 既存の `src/content/<collection>/<slug>.{md,json}` は **上書き**される。事前にコミットしておくことを推奨。
- スキーマに無いフィールドが表に含まれる場合は警告。schema 拡張が必要なら別タスクとして相談する。
- worktree で作業すること（CLAUDE.md ルール）。main 直下なら新しい worktree を切る。
