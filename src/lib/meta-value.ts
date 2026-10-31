/** Limit metadata values to 200 Unicode code points without adding an ellipsis. */
export function truncateMetaValue(value: unknown): string {
  return Array.from(String(value)).slice(0, 200).join('');
}
