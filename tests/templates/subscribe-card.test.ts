import { describe, it, expect } from 'vitest';
import subscribeCard from '@/templates/newsletter/subscribe-card';
import { getTemplate } from '@/templates/registry';
import { hexToRgb } from '@/templates/utils';
import type { SatoriElement } from '@/templates/types';

/** Every string rendered anywhere in the element tree, in order. */
function texts(node: unknown): string[] {
  if (typeof node === 'string') return [node];
  if (Array.isArray(node)) return node.flatMap(texts);
  if (node && typeof node === 'object' && 'props' in node) {
    return texts((node as SatoriElement).props.children);
  }
  return [];
}

/** The style of the element that directly holds this text. */
function styleOf(node: unknown, text: string): Record<string, string> | undefined {
  if (Array.isArray(node)) {
    for (const child of node) {
      const found = styleOf(child, text);
      if (found) return found;
    }
    return undefined;
  }
  if (node && typeof node === 'object' && 'props' in node) {
    const { style, children } = (node as SatoriElement).props;
    if (children === text) return style;
    return styleOf(children, text);
  }
  return undefined;
}

function luminance(hex: string): number {
  const rgb = hexToRgb(hex);
  if (!rgb) throw new Error(`not a hex color: ${hex}`);
  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

const tree = (overrides: Record<string, unknown> = {}) =>
  subscribeCard.render({ ...subscribeCard.defaults, ...overrides });
const render = (overrides: Record<string, unknown> = {}) => texts(tree(overrides));

describe('newsletter-subscribe-card', () => {
  it('is registered in the newsletter category', () => {
    expect(getTemplate('newsletter-subscribe-card')?.category).toBe('newsletter');
  });

  it('shows the pill, name, pitch, form and reader line with its defaults', () => {
    expect(render()).toEqual([
      'Every Friday',
      'The Friday Brief',
      'One email a week with the best of web development.',
      'you@example.com',
      'Subscribe',
      'Join 12,400 readers',
    ]);
  });

  it('hides the reader line when the subscriber count is empty or blank', () => {
    for (const subscriberCount of ['', '   ']) {
      const out = render({ subscriberCount });
      expect(out.some((t) => t.startsWith('Join '))).toBe(false);
    }
  });

  it('draws four overlapping circles beside the reader line, and none without it', () => {
    const circles = (node: unknown): number => {
      if (Array.isArray(node)) return node.reduce((n: number, child) => n + circles(child), 0);
      if (node && typeof node === 'object' && 'props' in node) {
        const { style, children } = (node as SatoriElement).props;
        const round = style?.borderRadius === '50%' ? 1 : 0;
        return round + circles(children);
      }
      return 0;
    };
    expect(circles(tree())).toBe(4);
    expect(circles(tree({ subscriberCount: '' }))).toBe(0);
  });

  it('hides the pill when the frequency is empty', () => {
    expect(render()).toContain('Every Friday');
    expect(render({ frequency: '' })).not.toContain('Every Friday');
  });

  it('falls back to Subscribe when the button text is empty', () => {
    expect(render({ ctaText: '' })).toContain('Subscribe');
    expect(render({ ctaText: 'Join now' })).toContain('Join now');
  });

  it('shows the site name only when it is set', () => {
    expect(render({ siteName: 'friday.example.com' }).at(-1)).toBe('friday.example.com');
    expect(render()).not.toContain('friday.example.com');
  });

  it('shortens very long text', () => {
    const out = render({
      title: 'T'.repeat(80),
      frequency: 'F'.repeat(60),
      subscriberCount: '9'.repeat(40),
      ctaText: 'C'.repeat(40),
    });
    expect(out.every((t) => t.length <= 60)).toBe(true);
    expect(out.join('')).toContain('…');
  });

  describe.each([
    ['the dark default', {}],
    ['white with dark text', { bgColor: '#ffffff', textColor: '#111827', accentColor: '#4f46e5' }],
    ['white with a pale accent', { bgColor: '#ffffff', textColor: '#111827', accentColor: '#fde68a' }],
    ['cream with a dark accent', { bgColor: '#faf5ea', textColor: '#1c1917', accentColor: '#7c2d12' }],
    ['dark with a dark accent', { bgColor: '#0a0a0a', textColor: '#ffffff', accentColor: '#1e3a8a' }],
  ])('on %s', (_name, colors) => {
    const params: Record<string, string | number | boolean> = { ...subscribeCard.defaults, ...colors };
    const bg = String(params.bgColor);
    const root = subscribeCard.render(params);

    it('keeps the name, pitch and reader line readable', () => {
      for (const text of [params.title, params.description, `Join ${params.subscriberCount} readers`]) {
        const color = styleOf(root, String(text))?.color;
        expect(color, String(text)).toBeTruthy();
        expect(contrast(String(color), bg), String(text)).toBeGreaterThanOrEqual(4.5);
      }
    });

    it('keeps the button text readable on the accent', () => {
      const color = styleOf(root, 'Subscribe')?.color;
      expect(contrast(String(color), String(params.accentColor))).toBeGreaterThanOrEqual(4.5);
    });

    it('keeps the frequency pill readable', () => {
      const color = styleOf(root, 'Every Friday')?.color;
      expect(contrast(String(color), bg)).toBeGreaterThanOrEqual(3);
    });
  });
});
