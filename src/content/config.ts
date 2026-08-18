import { defineCollection, z } from 'astro:content';

const yearMonth = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/u, 'period は YYYY-MM 形式');
const yearMonthOrPresent = z.union([yearMonth, z.literal('present')]);

// YAML frontmatter は YYYY-MM-DD を Date に自動変換するため、文字列に正規化してから検証する。
const isoDate = z
  .union([z.string(), z.date()])
  .transform((v) => (v instanceof Date ? v.toISOString().slice(0, 10) : v))
  .pipe(z.string().regex(/^\d{4}-\d{2}-\d{2}$/u, 'date は YYYY-MM-DD 形式'));

const linkSchema = z.object({
  label: z.string().min(1),
  url: z.string().url(),
  rel: z.string().optional(),
});

const profile = defineCollection({
  type: 'data',
  schema: z.object({
    name_ja: z.string().min(1),
    name_en: z.string().optional(),
    tagline: z.string().min(1),
    bio_md: z.string().min(1),
    avatar: z.string().optional(),
    links: z.array(linkSchema).default([]),
  }),
});

const career = defineCollection({
  type: 'data',
  schema: z.object({
    period_start: yearMonth,
    period_end: yearMonthOrPresent.optional(),
    organization: z.string().min(1),
    role: z.string().min(1),
    location: z.string().optional(),
    summary: z.string().optional(),
    highlights: z.array(z.string()).optional(),
    /** 組織や案件の関連 URL（任意） */
    url: z.string().url().optional(),
  }),
});

const talkType = z.enum(['keynote', 'invited', 'oral', 'poster', 'lt', 'panel']);

const talks = defineCollection({
  type: 'content',
  schema: z.object({
    date: isoDate,
    title: z.string().min(1),
    event: z.string().min(1),
    location: z.string().optional(),
    type: talkType,
    language: z.enum(['ja', 'en']),
    slides_url: z.string().url().optional(),
    video_url: z.string().url().optional(),
    /** イベントページなどスライド/動画以外の関連 URL（任意） */
    url: z.string().url().optional(),
  }),
});

const publicationType = z.enum([
  'journal',
  'conference',
  'book',
  'chapter',
  'preprint',
  'magazine',
]);

const publications = defineCollection({
  type: 'content',
  schema: z.object({
    date: isoDate,
    title: z.string().min(1),
    authors: z.array(z.string().min(1)).min(1),
    venue: z.string().min(1),
    type: publicationType,
    doi: z.string().optional(),
    pdf_url: z.string().url().optional(),
    links: z.array(linkSchema).optional(),
    /** 論文・寄稿の掲載ページなどの関連 URL（任意） */
    url: z.string().url().optional(),
  }),
});

const affiliations = defineCollection({
  type: 'data',
  schema: z.object({
    period_start: yearMonth,
    period_end: yearMonthOrPresent.optional(),
    organization: z.string().min(1),
    role: z.string().optional(),
    summary: z.string().optional(),
    url: z.string().url().optional(),
  }),
});

// プロダクト / 開発したもの。トップページに 4 列グリッドで全件表示する想定。
// 各セルはアイコン + 名前のみで、詳細は /products/<slug>/ で展開する。
const products = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string().min(1),
    tagline: z.string().min(1),
    period_start: yearMonth.optional(),
    period_end: yearMonthOrPresent.optional(),
    role: z.string().optional(),
    tech: z.array(z.string()).optional(),
    links: z.array(linkSchema).optional(),
    priority: z.number().int().optional(),
    /**
     * グリッドのアイコンに使う識別子。
     * - ピクトグラム名 (`site` / `review` / `type` / `billing` / `speed` / `translate` / `book` / `oss`) → SVG として描画
     * - それ以外の 1〜4 文字 → 文字としてフレーム内に描画
     * - 省略時は name の先頭文字を文字として描画
     */
    icon: z.string().min(1).max(16).optional(),
    /** 詳細ページに表示する追加の説明（任意、Markdown 段落区切り） */
    description_md: z.string().optional(),
    /** プロダクトの主要 URL（任意 / links とは別。サイト URL や代表リンクに使う） */
    url: z.string().url().optional(),
  }),
});

// 作成物（リポジトリ）。公開ページが生きているものだけを 1 件 1 ファイルで持ち、
// /works/ にカードとして並べる。API 由来のフィールド（language / updated / stars）は
// `pnpm sync:works` で洗い替えるので、手で書き換えても次回同期で上書きされる。
const workCategory = z.enum(['privacy', 'synthetic', 'analysis', 'app', 'site']);

const works = defineCollection({
  type: 'data',
  schema: z.object({
    /** GitHub のリポジトリ識別子。`owner/name` 形式 */
    repo: z.string().regex(/^[\w.-]+\/[\w.-]+$/u, 'repo は owner/name 形式'),
    title: z.string().min(1),
    summary: z.string().min(1),
    /** 公開ページの URL（GitHub Pages とは限らない） */
    site_url: z.string().url(),
    category: workCategory,
    /** GitHub の primary language（同期で更新） */
    language: z.string().optional(),
    /** リポジトリの最終更新日（同期で更新） */
    updated: isoDate,
    /** star 数（同期で更新） */
    stars: z.number().int().nonnegative().default(0),
  }),
});

export const collections = {
  profile,
  career,
  talks,
  publications,
  affiliations,
  products,
  works,
};

export type TalkType = z.infer<typeof talkType>;
export type PublicationType = z.infer<typeof publicationType>;
export type WorkCategory = z.infer<typeof workCategory>;
