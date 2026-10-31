import { describe, expect, it } from 'vitest';
import newsletterWelcome from '@/templates/newsletter/welcome';
import { newsletterWelcome as newsletterWelcomeExport } from '@/templates/newsletter';
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
  newsletterWelcome.render({ ...newsletterWelcome.defaults, ...overrides });

describe('newsletter-welcome', () => {
  it('is re-exported and registered in the newsletter category', () => {
    expect(newsletterWelcomeExport).toBe(newsletterWelcome);
    expect(getTemplate('newsletter-welcome')).toBe(newsletterWelcome);
    expect(
      getTemplatesByCategory('newsletter').filter((t) => t.id === 'newsletter-welcome')
    ).toHaveLength(1);
    expect(newsletterWelcome.category).toBe('newsletter');
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

  it('renders label, newsletter name, numbered items, and sign-off in order with defaults', () => {
    expect(textContent(tree())).toEqual([
      'Welcome to',
      'The Friday Brief',
      '1',
      'A 5-minute read every Friday',
      '2',
      'One deep dive a month',
      '3',
      'No ads, ever',
      'Priya, editor',
    ]);
  });

  it('skips empty and whitespace-only items and renumbers remaining items consecutively from 1', () => {
    const out = textContent(
      tree({
        item1: '   ',
        item2: 'Curated links weekly',
        item3: 'Original essays monthly',
      })
    );

    expect(out).toEqual([
      'Welcome to',
      'The Friday Brief',
      '1',
      'Curated links weekly',
      '2',
      'Original essays monthly',
      'Priya, editor',
    ]);
  });

  it('skips middle empty item and keeps numbering consecutive', () => {
    const out = textContent(
      tree({
        item1: 'First item',
        item2: '',
        item3: 'Second item',
      })
    );

    expect(out).toEqual([
      'Welcome to',
      'The Friday Brief',
      '1',
      'First item',
      '2',
      'Second item',
      'Priya, editor',
    ]);
  });

  it('renders only one item numbered 1 when only one item is provided', () => {
    const out = textContent(
      tree({
        item1: '',
        item2: '',
        item3: 'Single expectation',
      })
    );

    expect(out).toEqual([
      'Welcome to',
      'The Friday Brief',
      '1',
      'Single expectation',
      'Priya, editor',
    ]);
  });

  it('renders cleanly when all items are empty', () => {
    const out = textContent(
      tree({
        item1: '',
        item2: '  ',
        item3: '',
      })
    );

    expect(out).toEqual(['Welcome to', 'The Friday Brief', 'Priya, editor']);
  });

  it('hides empty or whitespace-only sign-off cleanly', () => {
    for (const signoff of ['', '   ']) {
      const out = textContent(tree({ signoff }));
      expect(out).not.toContain('Priya, editor');
      expect(out).toEqual([
        'Welcome to',
        'The Friday Brief',
        '1',
        'A 5-minute read every Friday',
        '2',
        'One deep dive a month',
        '3',
        'No ads, ever',
      ]);
    }
  });

  it('hides empty or whitespace-only label cleanly', () => {
    for (const label of ['', '   ']) {
      const out = textContent(tree({ label }));
      expect(out).not.toContain('Welcome to');
      expect(out).toEqual([
        'The Friday Brief',
        '1',
        'A 5-minute read every Friday',
        '2',
        'One deep dive a month',
        '3',
        'No ads, ever',
        'Priya, editor',
      ]);
    }
  });

  it('truncates long expectation items, label, newsletter name, and sign-off without overflowing', () => {
    const longText = 'A'.repeat(100);
    const rendered = tree({
      label: longText,
      siteName: longText,
      item1: longText,
      signoff: longText,
    });
    const texts = textContent(rendered);

    expect(texts[0].length).toBeLessThanOrEqual(32);
    expect(texts[0].endsWith('…')).toBe(true);

    expect(texts[1].length).toBeLessThanOrEqual(50);
    expect(texts[1].endsWith('…')).toBe(true);

    expect(texts[3].length).toBeLessThanOrEqual(70);
    expect(texts[3].endsWith('…')).toBe(true);

    expect(texts[texts.length - 1].length).toBeLessThanOrEqual(50);
    expect(texts[texts.length - 1].endsWith('…')).toBe(true);
  });

  it('keeps label and numbers readable on light backgrounds with sufficient contrast', () => {
    const lightTree = tree({
      bgColor: '#ffffff',
      textColor: '#000000',
      accentColor: '#E07A5F',
    });

    const labelStyle = styleOf(lightTree, 'Welcome to');
    expect(labelStyle?.color).toBeDefined();
    expect(contrast('#ffffff', labelStyle!.color)).toBeGreaterThanOrEqual(4.5);

    const number1Style = styleOf(lightTree, '1');
    expect(number1Style?.color).toBeDefined();
    expect(contrast('#ffffff', number1Style!.color)).toBeGreaterThanOrEqual(4.5);
  });

  it('maintains high contrast on default dark background', () => {
    const darkTree = tree();

    const labelStyle = styleOf(darkTree, 'Welcome to');
    expect(labelStyle?.color).toBeDefined();
    expect(contrast('#0a0a0a', labelStyle!.color)).toBeGreaterThanOrEqual(4.5);

    const number1Style = styleOf(darkTree, '1');
    expect(number1Style?.color).toBeDefined();
    expect(contrast('#0a0a0a', number1Style!.color)).toBeGreaterThanOrEqual(4.5);
  });
});
