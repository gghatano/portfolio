import type { WorkCategory } from '~/content/config';

/** `owner/name` からリポジトリの GitHub URL を組み立てる。 */
export function repoUrl(repo: string): string {
  return `https://github.com/${repo}`;
}

/** `owner/name` の name 部分だけを返す（カードの識別子表示用）。 */
export function repoName(repo: string): string {
  const name = repo.split('/')[1];
  return name ?? repo;
}

/** フィルタの並び順。カテゴリ数が増えたら本配列にも追加する（型で気付ける）。 */
export const workCategoryOrder: readonly WorkCategory[] = [
  'privacy',
  'synthetic',
  'analysis',
  'app',
  'site',
];
