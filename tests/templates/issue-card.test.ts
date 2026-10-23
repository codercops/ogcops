import { describe, it, expect } from 'vitest';
import issueCard from '@/templates/github/issue-card';
import { getTemplate } from '@/templates/registry';
import type { SatoriElement } from '@/templates/types';
import { isLightColor, mixColors } from '@/templates/utils';

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

const tree = (overrides: Record<string, unknown> = {}) => issueCard.render({ ...issueCard.defaults, ...overrides });
const render = (overrides: Record<string, unknown> = {}) => texts(tree(overrides));
/** The border color of each label chip, in order. */
const chipColors = (overrides: Record<string, unknown> = {}) =>
  elements(tree(overrides))
    .map((el) => /^1px solid (#[0-9a-f]{6})$/.exec(String(el.props.style?.border ?? ''))?.[1])
    .filter(Boolean);

describe('github-issue-card', () => {
  it('is registered in the github category', () => {
    expect(getTemplate('github-issue-card')?.category).toBe('github');
  });

  it('draws the repo, the title with its number, the status, the labels and the footer', () => {
    expect(render()).toEqual([
      'codercops/ogcops',
      'Add dark mode to the editor',
      '#42',
      'Open',
      'good first issue',
      'hacktoberfest',
      'octocat opened this issue · 12 comments',
    ]);
  });

  it('is a 1200x630 card', () => {
    const { style } = tree().props;
    expect(style.width).toBe('1200px');
    expect(style.height).toBe('630px');
  });

  it('shows a green Open pill or a purple Closed one, whatever the casing', () => {
    const pill = (status: string) => elements(tree({ status })).find((el) => el.props.style?.borderRadius === '999px')!;
    expect(pill('open').props.style.background).toBe('#238636');
    expect(texts(pill('open'))).toEqual(['Open']);
    expect(pill('closed').props.style.background).toBe('#8957e5');
    expect(texts(pill('Closed'))).toEqual(['Closed']);
    // Anything else counts as open.
    expect(texts(pill('weird'))).toEqual(['Open']);
  });

  it('colors label chips from a fixed palette by position', () => {
    const labels = 'a, b, c, d';
    expect(chipColors({ labels })).toEqual(['#7057ff', '#0e8a16', '#d93f0b', '#1d76db']);
    // Same input, same colors, and the first chip is always the first color.
    expect(chipColors({ labels })).toEqual(chipColors({ labels }));
    expect(chipColors({ labels: 'docs' })).toEqual(['#7057ff']);
  });

  it('shows at most four labels and skips blank ones', () => {
    const out = render({ labels: 'one, , two,three,  four, five' });
    expect(out).toEqual(expect.arrayContaining(['one', 'two', 'three', 'four']));
    expect(out).not.toContain('five');
    expect(chipColors({ labels: ' , ,' })).toEqual([]);
  });

  it('hides the repo, number, labels and footer when they are empty', () => {
    expect(render({ repoName: '', issueNumber: '', labels: '', author: '', comments: '' })).toEqual([
      'Add dark mode to the editor',
      'Open',
    ]);
  });

  it('writes the footer with only what it has, and counts one comment as singular', () => {
    expect(render({ comments: '' })).toContain('octocat opened this issue');
    expect(render({ author: '' })).toContain('12 comments');
    expect(render({ comments: '1' })).toContain('octocat opened this issue · 1 comment');
    expect(render({ comments: '1.2k' })).toContain('octocat opened this issue · 1.2k comments');
  });

  it('takes the issue number with or without a leading #', () => {
    expect(render({ issueNumber: '#7' })).toContain('#7');
    expect(render({ issueNumber: '#7' })).not.toContain('##7');
  });

  it('shortens long text and falls back to the default title', () => {
    const [, title] = render({ title: 'x'.repeat(200) });
    expect(title).toHaveLength(90);
    expect(title.endsWith('…')).toBe(true);
    expect(render({ title: '' })).toContain('Add dark mode to the editor');
    const long = render({ labels: 'a-really-long-label-name-that-keeps-going' });
    expect(long).toContain('a-really-long-label-name-th…');
  });

  it('shortens a long issue number and comment count', () => {
    expect(render({ issueNumber: '#12345678901234' })).toContain('#123456789…');
    expect(render({ comments: '12345678901234567' })).toContain('octocat opened this issue · 12345678901… comments');
  });

  it('keeps label text readable on light and dark backgrounds', () => {
    const labelText = (bgColor: string) =>
      elements(tree({ bgColor, labels: 'docs' })).find((el) => el.props.style?.fontSize === '20px')!.props.style.color;
    // Dark default: the palette color mixed toward white.
    expect(labelText('#0d1117')).toBe(mixColors('#7057ff', '#ffffff', 0.45));
    expect(isLightColor(labelText('#0d1117'))).toBe(true);
    // Light background: mixed toward black instead, so it stays dark.
    expect(labelText('#ffffff')).toBe(mixColors('#7057ff', '#000000', 0.45));
    expect(isLightColor(labelText('#ffffff'))).toBe(false);
  });
});
