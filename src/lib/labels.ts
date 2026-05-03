import type { PublicationType, TalkType } from '~/content/config';

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
