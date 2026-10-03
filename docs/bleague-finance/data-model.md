# データモデル

蓄積するデータの形を決める。実装時は `src/content/config.ts` の Zod スキーマを真実とし、本書との差分が出たら本書を更新する（[実装規約 §5](../conventions.md#5-コンテンツスキーマ)と同じ運用）。

---

## 1. コレクション構成

| コレクション | 種類 | 1 ファイルの単位 | 配置 |
| --- | --- | --- | --- |
| `clubs` | data (JSON) | 1 クラブ | `src/content/clubs/<club-slug>.json` |
| `club-finances` | data (JSON) | 1 クラブ × 1 シーズン | `src/content/club-finances/<season>-<club-slug>.json` |
| `posts` | content (MD / MDX) | 1 記事 | `src/content/posts/<YYYY>-<keyword>.mdx`（[task-001](../tasks/phase-07/task-001-blog-foundation.md)） |

- `club-slug` は運営会社名ではなく**チーム名**のローマ字 kebab-case にする（例: `utsunomiya-brex`、`chiba-jets`、`ryukyu-golden-kings`）。チーム名が変わった場合は slug を変えず、`clubs.aliases` に旧名を足す。
- ファイル名の例: `2025-26-utsunomiya-brex.json`。実装規約の `<year>-<keyword>` に揃えている。

---

## 2. `clubs`

クラブの静的な属性。決算データから `reference('clubs')` で参照する。

```ts
const clubs = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string().min(1),                 // 宇都宮ブレックス
    short_name: z.string().min(1),           // 宇都宮（リーグ略称。図のラベルに使う）
    operator: z.string().min(1),             // 株式会社栃木ブレックス
    prefecture: z.string().min(1),           // 栃木県
    fiscal_year_end_month: z.number().int().min(1).max(12), // 6
    aliases: z.array(z.string()).default([]), // 旧チーム名・旧社名。記事との照合に使う
    url: z.string().url().optional(),
  }),
});
```

---

## 3. シーズンと決算期の対応

- `season` は `YYYY-YY` 形式（例: `2025-26`）で、リーグの「2025-26 シーズン（2025 年度）」に対応する。
- 6 月決算のクラブでは「2026 年 6 月期」＝ `2025-26`。
- 6 月以外の決算期のクラブがどのシーズンに割り当てられるかは、リーグ PDF の注記で確認して本節に追記する（task-002）。

---

## 4. `club-finances`

### 4.1 フィールド

金額はすべて**千円の整数**。項目を**省略すると「不明」**、`0` は「実際にゼロ」を表す。この区別を崩さないこと。

| フィールド | 型 | 必須 | 説明 |
| --- | --- | --- | --- |
| `club` | `reference('clubs')` | ✓ | |
| `season` | `YYYY-YY` | ✓ | §3 |
| `fiscal_period_end` | `YYYY-MM` | ✓ | 決算期末（例: `2026-06`） |
| `division` | enum | ✓ | そのシーズンの所属。`b1` / `b2` / `b3` / `premier` / `one` / `next`（2026-27 からの新ディビジョンを含む） |
| `status` | enum | ✓ | `preliminary`（tier 2〜3 のみ）/ `official`（tier 1 で確定） |
| `revenue.total` | int | ✓ | 営業収入（[research-guide §5](research-guide.md#5-科目の対応づけ)） |
| `revenue.sponsorship` | int | | スポンサー収入 |
| `revenue.ticket` | int | | 入場料収入 |
| `revenue.distribution` | int | | 配分金 |
| `revenue.merchandise` | int | | 物販収入 |
| `revenue.academy` | int | | アカデミー関連収入 |
| `revenue.other` | int | | その他（賞金を含む） |
| `expenses.total` | int | | 営業費用 |
| `expenses.top_team_personnel` | int | | トップチーム人件費 |
| `expenses.*` | int | | 他の内訳は §5 で確定させる |
| `operating_income` | int | | 営業利益 |
| `ordinary_income` | int | | 経常利益 |
| `net_income` | int | | 当期純利益 |
| `net_assets` | int | | 純資産（債務超過はマイナス） |
| `attendance.total` | int | | ホーム入場者数（合計） |
| `attendance.games` | int | | ホーム試合数 |
| `record.wins` / `record.losses` | int | | レギュラーシーズンの勝敗 |
| `resolution` | `Record<path, int>` | | 項目ごとの精度（千円単位）。省略時は 1。例: `{ "revenue.sponsorship": 100000 }` は 1 億円単位 |
| `one_off_items` | array | | 一時要因。`{ label, amount?, direction: 'revenue' \| 'expense', note }` |
| `sources` | array（1 件以上） | ✓ | `{ tier, title, url, published, fields }`。`fields` はその出典から取った項目パスの配列 |
| `notes` | string | | 対応づけできなかった科目、表記の注意（「40 億円超」等）、ソース間の食い違い |

### 4.2 スキーマで検証すること

`superRefine` で次の 3 点を検証し、違反があれば build を落とす。

1. **内訳の合計 ≤ 総額。** 内訳がすべて埋まっている場合は「合計 ＝ 総額」を、許容誤差（関係する項目の `resolution` の合計）付きで検証する。
2. **営業利益 ＝ 営業収入 − 営業費用。** 3 つとも揃っている場合だけ、同じく許容誤差付きで検証する。
3. **`status: official` には `tier: 'league'` の出典が 1 件以上あること。**

### 4.3 例（速報値）

```json
{
  "club": "utsunomiya-brex",
  "season": "2025-26",
  "fiscal_period_end": "2026-06",
  "division": "b1",
  "status": "preliminary",
  "revenue": {
    "total": 4035787,
    "sponsorship": 1200000,
    "ticket": 1200000,
    "merchandise": 725000
  },
  "operating_income": 350848,
  "net_income": 206980,
  "resolution": {
    "revenue.sponsorship": 100000,
    "revenue.ticket": 100000,
    "revenue.merchandise": 1000,
    "net_income": 10
  },
  "one_off_items": [
    {
      "label": "EASL 優勝賞金",
      "direction": "revenue",
      "note": "2025-26 EASL 優勝による賞金。金額は未公表"
    }
  ],
  "sources": [
    {
      "tier": "club",
      "title": "【ご報告】株式会社栃木ブレックス 2026年6月期決算",
      "url": "https://www.utsunomiyabrex.com/settlement-report/202606/",
      "published": "2026-09-12",
      "fields": ["revenue.total", "operating_income"]
    }
  ],
  "notes": "スポンサー・チケットは報道の「それぞれ約12億円」による概数。公式発表の公開日は要確認。"
}
```

上の数値は報道ベースで、`published` などは実装時に元資料で確認すること。

---

## 5. 未確定事項

リーグ PDF を確認してから確定させる（task-002 の受け入れ基準）。

- 営業費用の内訳科目の正式名と数。暫定案: `top_team_personnel`（トップチーム人件費）/ `game_operations`（試合関連経費）/ `top_team_operations`（トップチーム運営経費）/ `academy`（アカデミー関連経費）/ `merchandise_cost`（物販関連経費）/ `sga`（販売費及び一般管理費）/ `other`
- 営業収入の内訳が上記 6 項目で過不足ないか
- 6 月以外の決算期のクラブのシーズン割り当て（§3）
- 入場者数をリーグ公式の「入場者数」と揃えるか（決算概要に載るか、別資料か）
