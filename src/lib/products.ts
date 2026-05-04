/** name の先頭文字をフォールバックのアイコン文字として返す。 */
export function defaultProductIcon(name: string): string {
  const ch = name.trim().charAt(0);
  return ch || '?';
}
