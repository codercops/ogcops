/**
 * Truncate text to a max length with ellipsis.
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 1).trimEnd() + '…';
}

/**
 * Auto-size font based on text length.
 */
export function autoFontSize(
  text: string,
  breakpoints: { maxLen: number; size: number }[]
): number {
  for (const bp of breakpoints) {
    if (text.length <= bp.maxLen) return bp.size;
  }
  return breakpoints[breakpoints.length - 1].size;
}

/**
 * Parse hex color, supporting both with and without #.
 */
export function parseColor(color: string): string {
  const c = color.replace(/^#/, '');
  return `#${c}`;
}

/**
 * Create a gradient CSS string.
 */
export function linearGradient(angle: number, ...stops: string[]): string {
  return `linear-gradient(${angle}deg, ${stops.join(', ')})`;
}

/**
 * Mix two hex colors by a ratio (0–1).
 */
export function mixColors(color1: string, color2: string, ratio: number): string {
  const c1 = hexToRgb(parseColor(color1));
  const c2 = hexToRgb(parseColor(color2));
  if (!c1 || !c2) return color1;
  const r = Math.round(c1.r + (c2.r - c1.r) * ratio);
  const g = Math.round(c1.g + (c2.g - c1.g) * ratio);
  const b = Math.round(c1.b + (c2.b - c1.b) * ratio);
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
    : null;
}

/**
 * Determine if a color is light or dark (for contrast text).
 */
export function isLightColor(hex: string): boolean {
  const rgb = hexToRgb(parseColor(hex));
  if (!rgb) return false;
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  return luminance > 0.5;
}

/**
 * Get contrasting text color for a background.
 */
export function contrastText(bgHex: string): string {
  return isLightColor(bgHex) ? '#000000' : '#FFFFFF';
}

/**
 * Common field definitions reused across templates.
 */
export const commonFields = {
  title: {
    key: 'title',
    label: 'Title',
    type: 'text' as const,
    defaultValue: 'Your Title Here',
    placeholder: 'Enter your title...',
    required: true,
    group: 'Content' as const,
  },
  description: {
    key: 'description',
    label: 'Description',
    type: 'textarea' as const,
    defaultValue: '',
    placeholder: 'Enter a description...',
    group: 'Content' as const,
  },
  author: {
    key: 'author',
    label: 'Author',
    type: 'text' as const,
    defaultValue: '',
    placeholder: 'Author name',
    group: 'Content' as const,
  },
  date: {
    key: 'date',
    label: 'Date',
    type: 'text' as const,
    defaultValue: '',
    placeholder: 'Jan 1, 2026',
    group: 'Content' as const,
  },
  category: {
    key: 'category',
    label: 'Category',
    type: 'text' as const,
    defaultValue: '',
    placeholder: 'Category name',
    group: 'Content' as const,
  },
  siteName: {
    key: 'siteName',
    label: 'Site Name',
    type: 'text' as const,
    defaultValue: '',
    placeholder: 'yoursite.com',
    group: 'Brand' as const,
  },
  bgColor: {
    key: 'bgColor',
    label: 'Background',
    type: 'color' as const,
    defaultValue: '#0a0a0a',
    group: 'Style' as const,
  },
  accentColor: {
    key: 'accentColor',
    label: 'Accent Color',
    type: 'color' as const,
    defaultValue: '#E07A5F',
    group: 'Style' as const,
  },
  textColor: {
    key: 'textColor',
    label: 'Text Color',
    type: 'color' as const,
    defaultValue: '#FFFFFF',
    group: 'Style' as const,
  },
};
