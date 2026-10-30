import type { TemplateDefinition } from './types';

/**
 * Create a Satori-compatible inline star icon without relying on font glyphs.
 */
export function starIcon(size: number, color: string) {
  return {
    type: 'svg',
    props: {
      width: size,
      height: size,
      viewBox: '0 0 24 24',
      children: {
        type: 'path',
        props: {
          d: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
          fill: color,
        },
      },
    },
  };
}

/**
 * Create a Satori-compatible inline right arrow icon.
 */
export function arrowRightIcon(size: number, color: string) {
  return {
    type: 'svg',
    props: {
      width: size,
      height: size,
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: color,
      strokeWidth: '2.5',
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      children: {
        type: 'path',
        props: {
          d: 'M5 12h14M12 5l7 7-7 7',
        },
      },
    },
  };
}

/**
 * Create a Satori-compatible inline single musical note icon (♪).
 */
export function musicNoteIcon(size: number, color: string) {
  return {
    type: 'svg',
    props: {
      width: size,
      height: size,
      viewBox: '0 0 24 24',
      children: {
        type: 'path',
        props: {
          d: 'M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z',
          fill: color,
        },
      },
    },
  };
}

/**
 * Create a Satori-compatible inline beamed musical notes icon (♫).
 */
export function musicNotesIcon(size: number, color: string) {
  return {
    type: 'svg',
    props: {
      width: size,
      height: size,
      viewBox: '0 0 24 24',
      children: {
        type: 'path',
        props: {
          d: 'M9 3l10-2v13.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V6.73L9 8.73V17.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V3z',
          fill: color,
        },
      },
    },
  };
}

/**
 * Create a Satori-compatible inline play triangle icon (▶).
 */
export function playIcon(size: number, color: string, style?: Record<string, any>) {
  return {
    type: 'svg',
    props: {
      width: size,
      height: size,
      viewBox: '0 0 24 24',
      style: {
        ...(style || {}),
      },
      children: {
        type: 'path',
        props: {
          d: 'M8 5v14l11-7z',
          fill: color,
        },
      },
    },
  };
}

/**
 * Create a Satori-compatible inline lightning bolt icon (⚡).
 */
export function boltIcon(size: number, color: string) {
  return {
    type: 'svg',
    props: {
      width: size,
      height: size,
      viewBox: '0 0 24 24',
      children: {
        type: 'path',
        props: {
          d: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
          fill: color,
        },
      },
    },
  };
}

/**
 * Create a Satori-compatible inline hexagon icon (⬡).
 */
export function hexagonIcon(size: number, color: string) {
  return {
    type: 'svg',
    props: {
      width: size,
      height: size,
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: color,
      strokeWidth: '2',
      strokeLinejoin: 'round',
      children: {
        type: 'path',
        props: {
          d: 'M12 2l9 5v10l-9 5-9-5V7l9-5z',
        },
      },
    },
  };
}

/**
 * Create a Satori-compatible inline git fork icon (⑂).
 */
export function forkIcon(size: number, color: string) {
  return {
    type: 'svg',
    props: {
      width: size,
      height: size,
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: color,
      strokeWidth: '2',
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      children: [
        { type: 'circle', props: { cx: 12, cy: 18, r: 3 } },
        { type: 'circle', props: { cx: 6, cy: 6, r: 3 } },
        { type: 'circle', props: { cx: 18, cy: 6, r: 3 } },
        { type: 'path', props: { d: 'M18 9v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9' } },
        { type: 'path', props: { d: 'M12 12v3' } },
      ],
    },
  };
}

/**
 * Create a Satori-compatible inline alembic/flask icon (⚗).
 */
export function flaskIcon(size: number, color: string) {
  return {
    type: 'svg',
    props: {
      width: size,
      height: size,
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: color,
      strokeWidth: '2',
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      children: [
        { type: 'path', props: { d: 'M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2' } },
        { type: 'path', props: { d: 'M8.5 2h7' } },
        { type: 'path', props: { d: 'M7 16h10' } },
      ],
    },
  };
}

/**
 * Truncate text to a maximum number of Unicode code points, including ellipsis.
 */
export function truncate(text: string, maxLength: number): string {
  const characters = Array.from(text);
  if (characters.length <= maxLength) return text;
  return characters.slice(0, maxLength - 1).join('').trimEnd() + '…';
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
