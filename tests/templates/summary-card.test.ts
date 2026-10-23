import { describe, it, expect } from 'vitest';
import summaryCard from '@/templates/blog/summary-card';
import { getTemplate } from '@/templates/registry';
import type { SatoriElement } from '@/templates/types';

/** Every element in the tree, in order. */
function elements(node: unknown): SatoriElement[] {
  if (Array.isArray(node)) return node.flatMap(elements);
  if (node && typeof node === 'object' && 'props' in node) {
    const el = node as SatoriElement;
    return [el, ...elements(el.props.children)];
  }
  return [];
}

/** Every string rendered anywhere in the element tree, in order. */
function texts(node: unknown): string[] {
  if (typeof node === 'string') return [node];
  if (Array.isArray(node)) return node.flatMap(texts);
  if (node && typeof node === 'object' && 'props' in node) {
    return texts((node as SatoriElement).props.children);
  }
  return [];
}

const tree = (overrides: Record<string, unknown> = {}) => summaryCard.render({ ...summaryCard.defaults, ...overrides });
const render = (overrides: Record<string, unknown> = {}) => texts(tree(overrides));
/** The text inside the author's initials circle, or undefined when there is no circle. */
const initialsOf = (author: string) => {
  const circle = elements(tree({ author })).find((el) => el.props.style?.borderRadius === '50%');
  return circle ? texts(circle).join('') : undefined;
};
const excerptBox = (description: string) => elements(tree({ description })).find((el) => el.type === 'p');

const DEFAULT_TITLE = 'How we cut our build times in half with incremental caching';

describe('blog-summary-card', () => {
  it('is registered in the blog category', () => {
    expect(getTemplate('blog-summary-card')?.category).toBe('blog');
  });

  it('draws the cover, the pill, the title, the excerpt and the footer', () => {
    expect(render()).toEqual([
      'Engineering',
      'codercops.com',
      'Engineering',
      DEFAULT_TITLE,
      'The cache keys we picked, the invalidation bugs we hit, and the numbers before and after.',
      'PS',
      'Priya Sharma · Oct 21, 2026',
      '6 min read',
    ]);
  });

  it('is 1200x630 with a cover panel over the left 38% of the card', () => {
    const root = tree();
    expect(root.props.style.width).toBe('1200px');
    expect(root.props.style.height).toBe('630px');
    const card = root.props.children as SatoriElement;
    const [cover] = card.props.children as SatoriElement[];
    expect(parseInt(cover.props.style.width) / parseInt(card.props.style.width)).toBeCloseTo(0.38, 2);
    expect(cover.props.style.backgroundImage).toMatch(/^linear-gradient\(/);
  });

  it('computes the initials from the author name', () => {
    expect(initialsOf('Priya Sharma')).toBe('PS');
    expect(initialsOf('ada')).toBe('A');
    expect(initialsOf('mary jane watson')).toBe('MW');
    expect(initialsOf('  Grace   Hopper  ')).toBe('GH');
  });

  it('hides the initials circle when the author is empty, and keeps the date', () => {
    expect(initialsOf('')).toBeUndefined();
    expect(initialsOf('   ')).toBeUndefined();
    const out = render({ author: '' });
    expect(out).toContain('Oct 21, 2026');
    expect(out).not.toContain('PS');
  });

  it('truncates the excerpt and clips it to two lines, so it never pushes the footer off the card', () => {
    const box = excerptBox('word '.repeat(80))!;
    const [text] = texts(box);
    expect(text.length).toBeLessThanOrEqual(96);
    expect(text.endsWith('…')).toBe(true);
    expect(box.props.style.maxHeight).toBe('60px');
    expect(box.props.style.overflow).toBe('hidden');
    // The footer still comes last.
    const out = render({ description: 'word '.repeat(80) });
    expect(out[out.length - 1]).toBe('6 min read');
  });

  it('hides every optional part cleanly when its field is empty', () => {
    const empty = { description: '', author: '', date: '', category: '', readTime: '', siteName: '' };
    expect(render(empty)).toEqual([DEFAULT_TITLE]);
    expect(excerptBox('')).toBeUndefined();
    expect(render({ category: '' })).not.toContain('Engineering');
    expect(render({ readTime: '' })).not.toContain('6 min read');
    expect(render({ siteName: '' })).not.toContain('codercops.com');
  });

  it('shortens long text and falls back to the default title', () => {
    const long = render({ title: 'x'.repeat(200), category: 'c'.repeat(40) });
    expect(long).toContain(`${'x'.repeat(79)}…`);
    expect(long).toContain(`${'c'.repeat(23)}…`);
    expect(render({ title: '' })).toContain(DEFAULT_TITLE);
  });
});
