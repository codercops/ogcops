import { describe, it, expect } from 'vitest';
import milestone from '@/templates/github/milestone';
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

/** First style matching a predicate (used for the bar, which has no text). */
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
  milestone.render({ ...milestone.defaults, ...overrides });
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

describe('github-milestone', () => {
  it('is registered in the github category', () => {
    expect(getTemplate('github-milestone')?.category).toBe('github');
  });

  it('renders repo, milestone, counts, percentage and due date with its defaults', () => {
    expect(render()).toEqual([
      'codercops/ogcops',
      'v2.0',
      '34 of 42 issues closed',
      '81%',
      'Due Nov 30',
    ]);
  });

  it('fills the bar to the same percentage it prints', () => {
    const bar = findStyle(tree({ closed: 21, total: 42 }), (s) => typeof s.width === 'string' && s.width.endsWith('%'));
    expect(bar?.width).toBe('50%');
    expect(render({ closed: 21, total: 42 })).toContain('50%');
  });

  it('never divides by zero: total 0 or negative becomes 1', () => {
    expect(render({ total: 0, closed: 5 })).toEqual(
      expect.arrayContaining(['1 of 1 issues closed', '100%'])
    );
    expect(render({ total: -7, closed: 0 })).toEqual(
      expect.arrayContaining(['0 of 1 issues closed', '0%'])
    );
  });

  it('clamps closed into 0..total', () => {
    expect(render({ closed: 99, total: 42 })).toEqual(
      expect.arrayContaining(['42 of 42 issues closed', '100%'])
    );
    expect(render({ closed: -5, total: 42 })).toEqual(
      expect.arrayContaining(['0 of 42 issues closed', '0%'])
    );
  });

  it('survives non-numeric input by falling back to the defaults', () => {
    expect(render({ closed: 'abc', total: 'abc' })).toEqual(
      expect.arrayContaining(['34 of 42 issues closed', '81%'])
    );
    expect(render({ closed: '', total: '' })).toEqual(
      expect.arrayContaining(['34 of 42 issues closed', '81%'])
    );
  });

  it('rounds the percentage and keeps bar and text in sync', () => {
    // 1/3 -> 33.33% -> 33%
    expect(render({ closed: 1, total: 3 })).toEqual(expect.arrayContaining(['33%']));
    const bar = findStyle(tree({ closed: 1, total: 3 }), (s) => typeof s.width === 'string' && s.width.endsWith('%'));
    expect(bar?.width).toBe('33%');
    // 2/3 -> 66.67% -> 67%
    expect(render({ closed: 2, total: 3 })).toEqual(expect.arrayContaining(['67%']));
  });

  it('hides the due date when it is empty or blank', () => {
    for (const dueDate of ['', '   ']) {
      expect(render({ dueDate })).not.toContain('Due');
    }
  });

  it('hides the repo line when it is empty', () => {
    expect(render({ repoName: '' })).not.toContain('codercops/ogcops');
  });

  it('shrinks long milestone names instead of overflowing', () => {
    const shortSize = Number(styleOf(tree({ title: 'v2.0' }), 'v2.0')!.fontSize.replace('px', ''));
    const longTitle = 'Version 2.0 — the everything bagel release with a very long name';
    const longSize = Number(styleOf(tree({ title: longTitle }), longTitle)!.fontSize.replace('px', ''));
    expect(longSize).toBeLessThan(shortSize);
    expect(longSize).toBeGreaterThanOrEqual(40);
  });

  it('truncates absurdly long names rather than letting them run off the card', () => {
    const huge = 'x'.repeat(200);
    const [rendered] = render({ title: huge }).filter((t) => t.startsWith('x'));
    expect(rendered.length).toBeLessThanOrEqual(80);
    expect(rendered.endsWith('…')).toBe(true);
  });

  it('darkens the percentage on a light background so it stays readable', () => {
    const style = styleOf(tree({ bgColor: '#ffffff', textColor: '#111111' }), '81%')!;
    expect(contrast(style.color, '#ffffff')).toBeGreaterThanOrEqual(4.5);
  });

  it('leaves the accent untouched on a dark background', () => {
    expect(styleOf(tree(), '81%')!.color).toBe('#58a6ff');
  });
});
