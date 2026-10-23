import { describe, it, expect } from 'vitest';
import pullRequest from '@/templates/github/pull-request';
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

/** The first element whose style has this exact value for the key. */
function findByStyle(node: unknown, key: string, value: string): SatoriElement | undefined {
  if (Array.isArray(node)) {
    for (const child of node) {
      const found = findByStyle(child, key, value);
      if (found) return found;
    }
    return undefined;
  }
  if (node && typeof node === 'object' && 'props' in node) {
    const element = node as SatoriElement;
    if (element.props.style?.[key] === value) return element;
    return findByStyle(element.props.children, key, value);
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
  pullRequest.render({ ...pullRequest.defaults, ...overrides });
const render = (overrides: Record<string, unknown> = {}) => texts(tree(overrides));

/** The widths (flex-grow) of the bar's segments, from additions then deletions. */
function barSegments(overrides: Record<string, unknown> = {}): number[] {
  const bar = findByStyle(tree(overrides), 'height', '14px');
  expect(bar).toBeDefined();
  const children = bar!.props.children as SatoriElement[];
  return children.map((segment) => Number(segment.props.style.flexGrow));
}

describe('github-pull-request', () => {
  it('is registered in the github category', () => {
    expect(getTemplate('github-pull-request')?.category).toBe('github');
  });

  it('shows the repo, state, title, branches, counts and footer with its defaults', () => {
    expect(render()).toEqual([
      'codercops/ogcops',
      'Merged #123',
      'Add dark mode to the editor',
      'feature/dark-mode into main',
      '+128',
      '-42',
      '6 files changed · by octocat',
    ]);
  });

  describe('state', () => {
    it.each([
      ['merged', 'Merged #123', '#8957e5'],
      ['open', 'Open #123', '#238636'],
      ['closed', 'Closed #123', '#da3633'],
    ])('shows %s as "%s" in its color', (state, label, color) => {
      const out = tree({ state });
      expect(texts(out)).toContain(label);
      expect(findByStyle(out, 'background', color)).toBeDefined();
    });

    it.each(['', 'banana', 'MERGE', undefined])('falls back to merged for %j', (state) => {
      expect(render({ state })).toContain('Merged #123');
    });

    it('accepts any letter case and surrounding spaces', () => {
      expect(render({ state: ' OPEN ' })).toContain('Open #123');
    });

    it('leaves the number out when there is none, and drops a leading #', () => {
      expect(render({ prNumber: '' })).toContain('Merged');
      expect(render({ prNumber: '#77' })).toContain('Merged #77');
    });
  });

  describe('counts', () => {
    it('reads numbers that arrive as strings, and keeps big ones whole', () => {
      const out = render({ additions: '123456', deletions: '7', filesChanged: '12' });
      expect(out).toContain('+123,456');
      expect(out).toContain('-7');
      expect(out.at(-1)).toBe('12 files changed · by octocat');
    });

    it.each([
      ['nope'],
      [''],
      ['-5'],
      [-5],
      [Number.NaN],
      [undefined],
      [null],
      ['1e999'],
    ])('treats %j as 0', (value) => {
      const out = render({ additions: value, deletions: value });
      expect(out).toContain('+0');
      expect(out).toContain('-0');
    });

    it('rounds a fraction down and ignores spaces around the number', () => {
      const out = render({ additions: ' 12.9 ', deletions: '3.2' });
      expect(out).toContain('+12');
      expect(out).toContain('-3');
    });

    it('says "1 file" for one file, and hides the files text for none', () => {
      expect(render({ filesChanged: 1 }).at(-1)).toBe('1 file changed · by octocat');
      expect(render({ filesChanged: 0 }).at(-1)).toBe('by octocat');
      expect(render({ filesChanged: 0, author: '' }).at(-1)).toBe('-42');
    });
  });

  describe('the additions and deletions bar', () => {
    it('is split by the ratio of additions to deletions', () => {
      expect(barSegments()).toEqual([128, 42]);
      expect(barSegments({ additions: '300', deletions: '100' })).toEqual([300, 100]);
    });

    it('is all one color when only one side has changes', () => {
      expect(barSegments({ additions: 50, deletions: 0 })).toEqual([50]);
      expect(barSegments({ additions: 0, deletions: 50 })).toEqual([50]);
    });

    it('is an empty bar, and still renders, when both are 0', () => {
      expect(barSegments({ additions: 0, deletions: 0 })).toEqual([]);
      expect(render({ additions: 0, deletions: 0 })).toContain('+0');
    });

    it('keeps the ratio for very big numbers', () => {
      expect(barSegments({ additions: '123456', deletions: '7' })).toEqual([123456, 7]);
    });
  });

  describe('branches', () => {
    it('hides the branches line without a head branch', () => {
      const out = render({ headBranch: '' });
      expect(out.some((t) => t.includes(' into '))).toBe(false);
    });

    it('uses main when the base branch is empty', () => {
      expect(render({ baseBranch: '' })).toContain('feature/dark-mode into main');
    });

    it('uses the word "into" and no arrow', () => {
      expect(render({ baseBranch: 'release' })).toContain('feature/dark-mode into release');
    });
  });

  it('hides the author when it is empty', () => {
    expect(render({ author: '' }).at(-1)).toBe('6 files changed');
  });

  it('shortens very long text', () => {
    const out = render({
      repoName: 'r'.repeat(100),
      title: 'T'.repeat(200),
      headBranch: 'b'.repeat(100),
      baseBranch: 'c'.repeat(100),
      author: 'a'.repeat(100),
    });
    expect(out.every((t) => t.length <= 100)).toBe(true);
    expect(out.join('')).toContain('…');
  });

  it('draws only characters the bundled fonts have (no arrows or icons)', () => {
    const fontSafe = (text: string) => [...text].every((ch) => ch.codePointAt(0)! <= 0xff || ch === '…');
    expect(render().every(fontSafe)).toBe(true);
    expect(render({ state: 'open', additions: '1234567' }).every(fontSafe)).toBe(true);
  });

  describe.each([
    ['the dark default', {}],
    ['white with dark text', { bgColor: '#ffffff', textColor: '#1f2328', accentColor: '#0969da' }],
    ['white with a pale accent', { bgColor: '#ffffff', textColor: '#1f2328', accentColor: '#fde68a' }],
    ['cream with a dark accent', { bgColor: '#faf5ea', textColor: '#1c1917', accentColor: '#7c2d12' }],
    ['dark with a dark accent', { bgColor: '#0d1117', textColor: '#e6edf3', accentColor: '#1e3a8a' }],
  ])('on %s', (_name, colors) => {
    const params: Record<string, string | number | boolean> = { ...pullRequest.defaults, ...colors };
    const bg = String(params.bgColor);
    const root = pullRequest.render(params);

    it('keeps the title readable', () => {
      const color = styleOf(root, 'Add dark mode to the editor')?.color;
      expect(contrast(String(color), bg)).toBeGreaterThanOrEqual(4.5);
    });

    it('keeps the branches and footer readable', () => {
      for (const text of ['feature/dark-mode into main', '6 files changed · by octocat']) {
        const color = styleOf(root, text)?.color;
        expect(contrast(String(color), bg), text).toBeGreaterThanOrEqual(4.5);
      }
    });

    it('keeps the repo name readable', () => {
      const color = styleOf(root, 'codercops/ogcops')?.color;
      expect(contrast(String(color), bg)).toBeGreaterThanOrEqual(3);
    });

    it('keeps the additions and deletions readable', () => {
      for (const text of ['+128', '-42']) {
        const color = styleOf(root, text)?.color;
        expect(contrast(String(color), bg), text).toBeGreaterThanOrEqual(3);
      }
    });

    it('keeps the pill text readable on the state color', () => {
      const color = styleOf(root, 'Merged #123')?.color;
      expect(contrast(String(color), '#8957e5')).toBeGreaterThanOrEqual(3);
    });
  });
});
