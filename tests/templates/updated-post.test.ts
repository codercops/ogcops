import { describe, expect, it } from 'vitest';
import blogUpdatedPost from '@/templates/blog/updated-post';
import { blogUpdatedPost as blogUpdatedPostExport } from '@/templates/blog';
import { getTemplate, getTemplatesByCategory } from '@/templates/registry';
import { hexToRgb } from '@/templates/utils';
import type { SatoriElement } from '@/templates/types';

function walk(node: unknown, visit: (element: SatoriElement) => void): void {
  if (Array.isArray(node)) {
    node.forEach((child) => walk(child, visit));
    return;
  }
  if (!node || typeof node !== 'object' || !('type' in node)) return;

  const element = node as SatoriElement;
  visit(element);
  walk(element.props?.children, visit);
}

function textContent(node: unknown): string[] {
  if (typeof node === 'string') return [node];
  if (Array.isArray(node)) return node.flatMap(textContent);
  if (node && typeof node === 'object' && 'props' in node) {
    return textContent((node as SatoriElement).props.children);
  }
  return [];
}

function styleOf(node: unknown, text: string): Record<string, any> | undefined {
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

// The bullet before each "What changed" line.
function bullets(node: unknown): Record<string, any>[] {
  const found: Record<string, any>[] = [];
  walk(node, (element) => {
    if (element.props?.style?.borderRadius === '50%') found.push(element.props.style);
  });
  return found;
}

// The row wrapping each bullet, which carries the spacing between lines.
function bulletRows(node: unknown): Record<string, any>[] {
  const found: Record<string, any>[] = [];
  walk(node, (element) => {
    if (element.type !== 'div' || element.props?.style?.display !== 'flex') return;
    const children = element.props.children;
    if (!Array.isArray(children)) return;
    const hasBullet = children.some(
      (child) => child && typeof child === 'object' && child.props?.style?.borderRadius === '50%'
    );
    if (hasBullet) found.push(element.props.style);
  });
  return found;
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
  blogUpdatedPost.render({ ...blogUpdatedPost.defaults, ...overrides });

describe('blog-updated-post', () => {
  it('is re-exported and registered in the blog category', () => {
    expect(blogUpdatedPostExport).toBe(blogUpdatedPost);
    expect(getTemplate('blog-updated-post')).toBe(blogUpdatedPost);
    expect(
      getTemplatesByCategory('blog').filter((t) => t.id === 'blog-updated-post')
    ).toHaveLength(1);
    expect(blogUpdatedPost.category).toBe('blog');
  });

  it('renders root element with 1200x630 dimensions', () => {
    const root = tree();
    expect(root.props.style.width).toBe('1200px');
    expect(root.props.style.height).toBe('630px');
  });

  it('ensures every div in the tree uses flex display', () => {
    walk(tree(), (element) => {
      if (element.type === 'div') {
        expect(element.props.style?.display).toBe('flex');
      }
    });
  });

  it('renders the label, title, both dates, the changes and the site name with defaults', () => {
    expect(textContent(tree())).toEqual([
      'Updated',
      'A practical guide to React Server Components',
      'First published Mar 3, 2024',
      '·',
      'Updated Oct 27, 2026',
      'What changed',
      'Covers React 19',
      'New section on server actions',
      'Fixed the broken examples',
      'codercops.com',
    ]);
  });

  it('skips blank change lines with no gaps', () => {
    for (const blank of ['', '   ']) {
      const out = textContent(tree({ change1: blank, change3: blank }));
      expect(out).toContain('What changed');
      expect(out).toContain('New section on server actions');
      expect(out).not.toContain('Covers React 19');
      expect(out).not.toContain('Fixed the broken examples');

      // One bullet per rendered line, and the last one carries no trailing margin.
      const rows = bulletRows(tree({ change1: blank, change3: blank }));
      expect(rows).toHaveLength(1);
      expect(rows[0].marginBottom).toBe('0px');

      expect(bullets(tree({ change1: blank, change3: blank }))).toHaveLength(1);
    }
  });

  it('keeps a gap only between the lines that are rendered', () => {
    const rows = bulletRows(tree({ change2: '   ' }));
    expect(rows).toHaveLength(2);
    expect(rows[0].marginBottom).toBe('12px');
    expect(rows[1].marginBottom).toBe('0px');
  });

  it('hides the What changed heading when every change line is blank', () => {
    for (const blank of ['', '   ']) {
      const out = textContent(tree({ change1: blank, change2: blank, change3: blank }));
      expect(out).not.toContain('What changed');
      expect(bullets(tree({ change1: blank, change2: blank, change3: blank }))).toHaveLength(0);
      // The rest of the card is untouched.
      expect(out).toContain('A practical guide to React Server Components');
      expect(out).toContain('codercops.com');
    }
  });

  it('hides an empty or whitespace-only published date without a stray separator', () => {
    for (const published of ['', '   ']) {
      const out = textContent(tree({ published }));
      expect(out).not.toContain('First published Mar 3, 2024');
      expect(out).not.toContain('·');
      expect(out).toContain('Updated Oct 27, 2026');
    }
  });

  it('hides an empty or whitespace-only updated date without a stray separator', () => {
    for (const updated of ['', '   ']) {
      const out = textContent(tree({ updated }));
      expect(out).not.toContain('Updated Oct 27, 2026');
      expect(out).not.toContain('·');
      expect(out).toContain('First published Mar 3, 2024');
    }
  });

  it('hides the dates line entirely when both dates are empty', () => {
    for (const blank of ['', '   ']) {
      const out = textContent(tree({ published: blank, updated: blank }));
      expect(out).not.toContain('·');
      expect(out).toEqual([
        'Updated',
        'A practical guide to React Server Components',
        'What changed',
        'Covers React 19',
        'New section on server actions',
        'Fixed the broken examples',
        'codercops.com',
      ]);
    }
  });

  it('hides an empty or whitespace-only site name cleanly', () => {
    for (const siteName of ['', '   ']) {
      const out = textContent(tree({ siteName }));
      expect(out).not.toContain('codercops.com');
      expect(out).toContain('Covers React 19');
    }
  });

  it('shrinks a long title with autoFontSize and then truncates it', () => {
    const short = styleOf(tree({ title: 'Short' }), 'Short');
    expect(short?.fontSize).toBe('72px');

    const long = 'Super long post title that goes on and on and clearly exceeds the maximum length allowed on the card '.repeat(3);
    const out = textContent(tree({ title: long }));
    const title = out[1];

    expect(title.length).toBeLessThanOrEqual(84);
    expect(title.endsWith('…')).toBe(true);
    // Once truncated it sits at the smallest step rather than overflowing.
    expect(styleOf(tree({ title: long }), title)?.fontSize).toBe('34px');
  });

  it('truncates long change lines and the site name', () => {
    const long = 'A change line that is far too long to fit on the card and keeps going '.repeat(3);
    const out = textContent(tree({ change1: long, siteName: long }));

    const change = out.find((line) => line.endsWith('…'));
    expect(change).toBeDefined();
    expect(change!.length).toBeLessThanOrEqual(64);

    const site = out[out.length - 1];
    expect(site.length).toBeLessThanOrEqual(36);
    expect(site.endsWith('…')).toBe(true);
  });

  it('keeps the longest values on one line instead of overflowing the card', () => {
    const maxed = tree({
      title: 'M'.repeat(84),
      published: 'W'.repeat(40),
      updated: 'W'.repeat(40),
      change1: 'M'.repeat(64),
      change2: 'M'.repeat(64),
      change3: 'M'.repeat(64),
    });

    // Each change line is clipped with an ellipsis rather than wrapping into the footer.
    const out = textContent(maxed);
    const changes = out.filter((line) => line.length === 64);
    expect(changes).toHaveLength(3);
    for (const change of changes) {
      const style = styleOf(maxed, change);
      expect(style?.whiteSpace).toBe('nowrap');
      expect(style?.overflow).toBe('hidden');
      expect(style?.textOverflow).toBe('ellipsis');
    }

    // Both dates shrink together and clip, so neither runs past the right edge.
    const updatedStyle = styleOf(maxed, 'W'.repeat(40));
    expect(updatedStyle?.fontSize).toBe('18px');
    expect(updatedStyle?.textOverflow).toBe('ellipsis');
    expect(updatedStyle?.minWidth).toBe(0);

    // A single unbroken word wraps instead of running off the card.
    expect(styleOf(maxed, 'M'.repeat(84))?.overflowWrap).toBe('anywhere');
  });

  it('sizes the dates down as the line gets longer', () => {
    const size = (published: string, updated: string) =>
      styleOf(tree({ published, updated }), updated)?.fontSize;

    // Both dates share one line, so the size follows their combined length.
    expect(size('First published Mar 3, 2024', 'Updated Oct 27, 2026')).toBe('22px');
    expect(size('P'.repeat(40), 'U'.repeat(15))).toBe('20px');
    expect(size('P'.repeat(40), 'U'.repeat(40))).toBe('18px');
    // A single date is never pushed below the floor.
    expect(size('', 'U'.repeat(40))).toBe('22px');
  });

  it('keeps the label and accent text readable on a light background', () => {
    const lightTree = tree({
      bgColor: '#ffffff',
      textColor: '#111827',
      accentColor: '#E07A5F',
    });

    // The pill sets its own text color against the accent fill.
    const labelStyle = styleOf(lightTree, 'Updated');
    expect(labelStyle?.color).toBeDefined();
    expect(contrast('#E07A5F', labelStyle!.color)).toBeGreaterThanOrEqual(4.5);

    for (const text of ['What changed', 'Updated Oct 27, 2026']) {
      const style = styleOf(lightTree, text);
      expect(style?.color).toBeDefined();
      expect(contrast('#ffffff', style!.color)).toBeGreaterThanOrEqual(4.5);
    }
  });

  it('keeps the label and accent text readable on a dark background', () => {
    const darkTree = tree();

    const labelStyle = styleOf(darkTree, 'Updated');
    expect(contrast(blogUpdatedPost.defaults!.accentColor as string, labelStyle!.color)).toBeGreaterThanOrEqual(4.5);

    for (const text of ['What changed', 'Updated Oct 27, 2026']) {
      const style = styleOf(darkTree, text);
      expect(contrast(blogUpdatedPost.defaults!.bgColor as string, style!.color)).toBeGreaterThanOrEqual(4.5);
    }
  });
});
