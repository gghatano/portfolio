# Phase 7 / Task 002: 決算データのスキーマと初期データ

## ステータス
- 未着手（追跡: #31）

## 背景
決算データを蓄積する器を作る。設計は [data-model.md](../../bleague-finance/data-model.md) にある。リーグの決算概要（2026 年 10 月中旬見込み）が出る前に器を作り、発表済みのクラブを速報値で入れて、スキーマの不備を早めに見つけるのが狙い。

## 受け入れ基準
- [ ] `clubs` コレクションを追加し、2026-27 シーズンの B.PREMIER 所属クラブを全件登録する。所属クラブの一覧はリーグ公式の発表で確定させ、記憶や二次情報に頼らない（`name` / `short_name` / `operator` / `prefecture` / `fiscal_year_end_month` / `premier_from` / `aliases`。2016-17 以降の旧チーム名・旧社名も `aliases` に入れる）
- [ ] `club-finances` コレクションを追加する（data-model §4.1）
- [ ] `superRefine` で data-model §4.2 の 3 つの検証を実装する。許容誤差の計算は `src/lib/finance.ts` に切り出し、ユニットテストを書く（テスト基盤がなければ、検証関数を純関数にしておき `node --test` で回す）
- [ ] 不正なデータ（内訳合計が総額を超える、`official` なのに tier 1 の出典がない）で build が落ちることを確認する
- [ ] 初期データを速報値（`status: preliminary`）で入れる
  - 2025-26: 宇都宮（クラブ発表）、ほか発表済みのクラブ
  - 2024-25: 千葉J、A東京、琉球、宇都宮の営業収入とトップチーム人件費（報道ベース）
  - いずれも B.PREMIER 所属クラブに限る
- [ ] 表示ラベル（`division`、`status`、科目名）を `src/lib/labels.ts` に `Record<...>` で追加する
- [ ] リーグ PDF を確認し、data-model §5 の未確定事項を確定させて本書と data-model を更新する（**リーグ発表後**。発表前にこのタスクを閉じる場合は、この項目を別タスクに切り出す）
- [ ] lint / check / build が 0 errors

## 成果物
- `src/content/config.ts`（`clubs`、`club-finances`）
- `src/content/clubs/*.json`、`src/content/club-finances/*.json`
- `src/lib/finance.ts`、`src/lib/labels.ts`
- `docs/bleague-finance/data-model.md` の更新

## 設計判断
- **金額は千円の整数で、省略 ＝ 不明。** 0 と不明を区別しないと、「物販収入 0 のクラブ」と「物販収入を公表していないクラブ」が図の上で同じに見えてしまう。
- **1 クラブ × 1 シーズン ＝ 1 ファイル。** 速報値から確定値への上書きが、1 ファイルの diff としてレビューできる。
- **派生値（前年比、人件費率、平均入場者数）は保存しない。** 計算は `src/lib/finance.ts` に集約し、図と記事で同じ関数を使う。

## 依存
- なし。リーグ PDF に関する項目だけ、リーグ発表を待つ
