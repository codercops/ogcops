import type { TemplateDefinition } from './types';

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
  if (typeof color !== 'string') return '';
  const c = color.replace(/^#/, '');
  return `#${c}`;
}

/**
 * Normalize a hex color value to lowercase #rrggbb format.
 * Accepts RGB, #RGB, RRGGBB, and #RRGGBB.
 * Returns normalized lowercase #rrggbb, or fallback for invalid/incomplete input.
 */
export function normalizeHexColor(value: unknown, fallback: string): string {
  if (typeof value !== 'string') return fallback;
  const trimmed = value.trim();
  const hex = trimmed.startsWith('#') ? trimmed.slice(1) : trimmed;
  if (/^[0-9a-fA-F]{3}$/.test(hex)) {
    const [r, g, b] = hex;
    return `#${r}${r}${g}${g}${b}${b}`.toLowerCase();
  }
  if (/^[0-9a-fA-F]{6}$/.test(hex)) {
    return `#${hex.toLowerCase()}`;
  }
  return fallback;
}

/**
 * Normalizes every `type: 'color'` field in params using its template default as fallback.
 */
export function normalizeColorFields(
  template: Pick<TemplateDefinition, 'fields' | 'defaults'>,
  params: Record<string, any>
): Record<string, any> {
  if (!template || !template.fields) return { ...params };

  const normalized = { ...params };
  for (const field of template.fields) {
    if (field.type === 'color') {
      const fallback = normalizeHexColor(
        template.defaults?.[field.key] ?? field.defaultValue,
        '#000000'
      );
      normalized[field.key] = normalizeHexColor(normalized[field.key], fallback);
    }
  }
  return normalized;
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

export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  if (typeof hex !== 'string') return null;
  const clean = hex.trim().replace(/^#/, '');
  if (/^[a-f\d]{3}$/i.test(clean)) {
    return {
      r: parseInt(clean[0] + clean[0], 16),
      g: parseInt(clean[1] + clean[1], 16),
      b: parseInt(clean[2] + clean[2], 16),
    };
  }
  const match = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(clean);
  if (match) {
    return {
      r: parseInt(match[1], 16),
      g: parseInt(match[2], 16),
      b: parseInt(match[3], 16),
    };
  }
  return null;
}

/**
 * Determine if a color is light or dark (for contrast text).
 */
export function isLightColor(hex: string): boolean {
  if (typeof hex !== 'string') return false;
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
