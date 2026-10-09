import { defineCollection, reference, z } from 'astro:content';

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
    /** トップの「作成物のピックアップ」に出す works のエントリ（ファイル名から .json を除いたもの） */
    pickup: reference('works').optional(),
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
    /**
     * ピックアップ。値を持つものが更新日より先に、昇順で並ぶ。
     * 省略したものは最終更新の新しい順。
     */
    priority: z.number().int().optional(),
    /** 公開ページが認証を要求するか。`auth` は Cloudflare Access などで保護されているもの */
    access: z.enum(['public', 'auth']).default('public'),
    /** リポジトリが private か（同期で更新）。true のとき GitHub リンクは出さない */
    repo_private: z.boolean().default(false),
  }),
});

export const collections = {
  profile,
  career,
  talks,
  publications,
  affiliations,
  works,
};

export type TalkType = z.infer<typeof talkType>;
export type PublicationType = z.infer<typeof publicationType>;
export type WorkCategory = z.infer<typeof workCategory>;
