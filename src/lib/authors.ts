function escapeHtml(s: string): string {
  return s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

/** 著者名のうち `**畑野 拓馬**` のように二重アスタリスクで囲まれたものを <strong class="self"> に変換する。 */
export function renderAuthors(authors: readonly string[]): string {
  return authors
    .map((a) => {
      const m = a.match(/^\*\*(.+)\*\*$/u);
      const captured = m?.[1];
      if (captured) return `<strong class="self">${escapeHtml(captured)}</strong>`;
      return escapeHtml(a);
    })
    .join('、');
}

/** 著者名表記から **マーカー** を取り除いた素のテキスト */
export function plainAuthorName(name: string): string {
  return name.replace(/^\*\*(.+)\*\*$/u, '$1');
}
