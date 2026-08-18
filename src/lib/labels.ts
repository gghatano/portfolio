import type { PublicationType, TalkType, WorkCategory } from '~/content/config';

export const talkTypeLabel: Record<TalkType, string> = {
  keynote: '基調講演',
  invited: '招待講演',
  oral: '口頭発表',
  poster: 'ポスター',
  lt: 'LT',
  panel: 'パネル',
};

export const publicationTypeLabel: Record<PublicationType, string> = {
  journal: '論文誌',
  conference: '国際会議 / 研究会',
  book: '書籍',
  chapter: '書籍章',
  preprint: 'プレプリント',
  magazine: '寄稿',
};

export const workCategoryLabel: Record<WorkCategory, string> = {
  privacy: 'プライバシー・匿名加工',
  synthetic: '合成データ',
  analysis: '分析・再現実験',
  app: 'ツール・アプリ',
  site: 'サイト・まとめ',
};
