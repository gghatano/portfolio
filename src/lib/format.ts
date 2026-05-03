/** YYYY-MM 表示。`present` は「現在」 */
export function formatYearMonth(value: string | undefined): string {
  if (!value) return '';
  if (value === 'present') return '現在';
  const [y, m] = value.split('-');
  return `${y}年${Number(m)}月`;
}

/** YYYY-MM-DD → YYYY.MM.DD */
export function formatDate(value: string): string {
  return value.replaceAll('-', '.');
}

/** YYYY-MM-DD から年だけを抜く */
export function yearOf(value: string): string {
  const head = value.slice(0, 4);
  return head;
}
