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
    bibtex: z.string().optional(),
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

export const collections = {
  profile,
  career,
  talks,
  publications,
  affiliations,
};

export type TalkType = z.infer<typeof talkType>;
export type PublicationType = z.infer<typeof publicationType>;
