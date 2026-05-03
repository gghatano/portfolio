/**
 * BASE_URL を意識した内部リンク生成。
 * `path` は先頭スラッシュ可・なし双方を許容し、末尾スラッシュは付与する。
 */
export function url(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/u, '');
  const p = path.startsWith('/') ? path : `/${path}`;
  const withSlash = p.endsWith('/') || /\.[a-z0-9]+$/iu.test(p) ? p : `${p}/`;
  return `${base}${withSlash}`;
}

export function isExternal(href: string): boolean {
  return /^(https?:)?\/\//u.test(href) || href.startsWith('mailto:');
}
