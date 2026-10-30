import { describe, it, expect } from 'vitest';
import sponsorsGoal from '@/templates/github/sponsors-goal';
import { getTemplate } from '@/templates/registry';
import { hexToRgb } from '@/templates/utils';
import type { SatoriElement } from '@/templates/types';

function texts(node: unknown): string[] {
  if (typeof node === 'string') return [node];
  if (Array.isArray(node)) return node.flatMap(texts);
  if (node && typeof node === 'object' && 'props' in node) {
    return texts((node as SatoriElement).props.children);
  }
  return [];
}

function elements(node: unknown): SatoriElement[] {
  if (Array.isArray(node)) return node.flatMap(elements);
  if (!node || typeof node !== 'object' || !('type' in node)) return [];
  const element = node as SatoriElement;
  return [element, ...elements(element.props.children)];
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

function findStyle(node: unknown, match: (style: Record<string, any>) => boolean): Record<string, any> | undefined {
  if (Array.isArray(node)) {
    for (const child of node) {
      const found = findStyle(child, match);
      if (found) return found;
    }
    return undefined;
  }
  if (node && typeof node === 'object' && 'props' in node) {
    const { style, children } = (node as SatoriElement).props;
    if (style && match(style)) return style;
    return findStyle(children, match);
  }
  return undefined;
}

const tree = (overrides: Record<string, unknown> = {}) =>
  sponsorsGoal.render({ ...sponsorsGoal.defaults, ...overrides });
const render = (overrides: Record<string, unknown> = {}) => texts(tree(overrides));

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

describe('github-sponsors-goal', () => {
  it('is registered in the github category and re-exported', async () => {
    expect(getTemplate('github-sponsors-goal')?.category).toBe('github');
    const exports = await import('@/templates/github');
    expect(exports.githubSponsorsGoal.id).toBe('github-sponsors-goal');
  });

  it('renders label, title, pitch, progress amounts, percentage, sponsors and site name with defaults', () => {
    expect(render()).toEqual([
      'Sponsor',
      'codercops/toolbelt',
      'Free developer tools that run in your browser',
      '$420 of $1,000 a month',
      '42%',
      '37 sponsors',
      'github.com/sponsors/codercops',
    ]);
  });

  it('fills the bar to the same percentage it prints when below goal', () => {
    const bar = findStyle(tree({ raised: 500, goal: 1000 }), (s) => typeof s.width === 'string' && s.width.endsWith('%'));
    expect(bar?.width).toBe('50%');
    expect(render({ raised: 500, goal: 1000 })).toContain('50%');
  });

  it('stops the bar at 100% when goal is passed while showing real amounts and percentage', () => {
    const rendered = render({ raised: 1260, goal: 1000 });
    expect(rendered).toContain('$1,260 of $1,000 a month');
    expect(rendered).toContain('126%');

    const bar = findStyle(tree({ raised: 1260, goal: 1000 }), (s) => typeof s.width === 'string' && s.width.endsWith('%'));
    expect(bar?.width).toBe('100%');
  });

  it('counts a goal below 1 as 1', () => {
    expect(render({ goal: 0, raised: 5 })).toEqual(
      expect.arrayContaining(['$5 of $1 a month', '500%'])
    );
    expect(render({ goal: -10, raised: 0 })).toEqual(
      expect.arrayContaining(['$0 of $1 a month', '0%'])
    );
    expect(render({ goal: 'abc', raised: 2 })).toEqual(
      expect.arrayContaining(['$2 of $1 a month', '200%'])
    );
  });

  it('counts negative or non-numeric raised as 0', () => {
    expect(render({ raised: -5, goal: 1000 })).toEqual(
      expect.arrayContaining(['$0 of $1,000 a month', '0%'])
    );
    expect(render({ raised: '-10', goal: 1000 })).toEqual(
      expect.arrayContaining(['$0 of $1,000 a month', '0%'])
    );
    expect(render({ raised: 'abc', goal: 1000 })).toEqual(
      expect.arrayContaining(['$0 of $1,000 a month', '0%'])
    );
    expect(render({ raised: '', goal: 1000 })).toEqual(
      expect.arrayContaining(['$0 of $1,000 a month', '0%'])
    );
    expect(render({ raised: '   ', goal: 1000 })).toEqual(
      expect.arrayContaining(['$0 of $1,000 a month', '0%'])
    );
  });

  it('formats amounts with thousands separators', () => {
    expect(render({ raised: 15000, goal: 20000 })).toEqual(
      expect.arrayContaining(['$15,000 of $20,000 a month'])
    );
    expect(render({ raised: 1000000, goal: 2500000 })).toEqual(
      expect.arrayContaining(['$1,000,000 of $2,500,000 a month'])
    );
  });

  it('supports custom currency', () => {
    expect(render({ currency: '€', raised: 500, goal: 1000 })).toEqual(
      expect.arrayContaining(['€500 of €1,000 a month'])
    );
    expect(render({ currency: '', raised: 500, goal: 1000 })).toEqual(
      expect.arrayContaining(['500 of 1,000 a month'])
    );
  });

  it('hides period cleanly when empty or whitespace', () => {
    expect(render({ period: '' })).toEqual(
      expect.arrayContaining(['$420 of $1,000'])
    );
    expect(render({ period: '   ' })).toEqual(
      expect.arrayContaining(['$420 of $1,000'])
    );
    expect(render({ period: '' })).not.toContain('$420 of $1,000 a month');
  });

  it('hides description cleanly when empty or whitespace', () => {
    for (const emptyDesc of ['', '   ']) {
      expect(render({ description: emptyDesc })).not.toContain('Free developer tools that run in your browser');
      const nodes = elements(tree({ description: emptyDesc }));
      expect(nodes.some((n) => n.type === 'p')).toBe(false);
    }
  });

  it('hides sponsors and site name cleanly when empty or whitespace', () => {
    expect(render({ sponsors: '', siteName: '' })).toEqual([
      'Sponsor',
      'codercops/toolbelt',
      'Free developer tools that run in your browser',
      '$420 of $1,000 a month',
      '42%',
    ]);

    expect(render({ sponsors: '   ' })).not.toContain('37 sponsors');
    expect(render({ siteName: '   ' })).not.toContain('github.com/sponsors/codercops');
  });

  it('shrinks long maintainer names and pitches with autoFontSize and truncates them', () => {
    const longTitle = 'codercops-open-source-foundation-and-extended-toolbelt-project';
    const longPitch = 'Free, privacy-friendly, high-performance developer tools running completely client-side in modern web browsers without telemetry';
    const nodes = elements(tree({ title: longTitle, description: longPitch }));

    const heading = nodes.find((n) => n.type === 'h1');
    expect(heading?.props.style?.fontSize).toBe('40px');
    const [renderedTitle] = texts(heading);
    expect(renderedTitle.length).toBeLessThanOrEqual(60);
    expect(renderedTitle.endsWith('…')).toBe(true);

    const pitch = nodes.find((n) => n.type === 'p');
    expect(pitch?.props.style?.fontSize).toBe('20px');
    const [renderedPitch] = texts(pitch);
    expect(renderedPitch.length).toBeLessThanOrEqual(100);
    expect(renderedPitch.endsWith('…')).toBe(true);
  });

  it('darkens the accent text on a light background for contrast', () => {
    const light = tree({ bgColor: '#ffffff', textColor: '#111111' });
    const percentStyle = styleOf(light, '42%')!;
    expect(contrast(percentStyle.color, '#ffffff')).toBeGreaterThanOrEqual(4.5);

    const labelStyle = styleOf(light, 'Sponsor')!;
    expect(contrast(labelStyle.color, '#ffffff')).toBeGreaterThanOrEqual(4.5);
  });

  it('leaves the accent color untouched on a dark background', () => {
    const dark = tree();
    expect(styleOf(dark, '42%')!.color).toBe('#ea4aaa');
    expect(styleOf(dark, 'Sponsor')!.color).toBe('#ea4aaa');
  });
});
