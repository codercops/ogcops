import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import discussion from '@/templates/github/discussion';
import { githubDiscussion } from '@/templates/github';
import { getTemplate } from '@/templates/registry';
import { hexToRgb } from '@/templates/utils';
import type { SatoriElement } from '@/templates/types';

function elements(node: unknown): SatoriElement[] {
  if (Array.isArray(node)) return node.flatMap(elements);
  if (node && typeof node === 'object' && 'props' in node) {
    const el = node as SatoriElement;
    return [el, ...elements(el.props.children)];
  }
  return [];
}

function texts(node: unknown): string[] {
  if (typeof node === 'string') return [node];
  if (Array.isArray(node)) return node.flatMap(texts);
  if (node && typeof node === 'object' && 'props' in node) return texts((node as SatoriElement).props.children);
  return [];
}

const tree = (overrides: Record<string, unknown> = {}) => discussion.render({ ...discussion.defaults, ...overrides });
const optional = ['category', 'description', 'upvotes', 'comments', 'siteName'];
const empty = Object.fromEntries(optional.map((key) => [key, '']));
const long = Object.fromEntries(['repoName', 'title', ...optional].map((key) => [key, 'W'.repeat(400)]));
const fonts = [
  ['Inter-Regular.woff', 'Inter', 400], ['Inter-SemiBold.woff', 'Inter', 600],
  ['Inter-Bold.woff', 'Inter', 700], ['JetBrainsMono-Regular.woff', 'JetBrains Mono', 400],
].map(([file, name, weight]) => ({
  name: String(name), weight: weight as 400 | 600 | 700,
  data: readFileSync(join(process.cwd(), 'public/fonts', String(file))), style: 'normal' as const,
}));

function contrast(a: string, b: string): number {
  const luminance = (hex: string) => {
    const { r, g, b } = hexToRgb(hex)!;
    const linear = [r, g, b].map((v) => v / 255 <= 0.04045 ? v / 255 / 12.92 : ((v / 255 + 0.055) / 1.055) ** 2.4);
    return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
  };
  const values = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (values[0] + 0.05) / (values[1] + 0.05);
}

describe('github-discussion', () => {
  it('is exported and registered with the requested fields and defaults', () => {
    expect(githubDiscussion).toBe(discussion);
    expect(getTemplate('github-discussion')).toBe(discussion);
    expect(discussion.fields.map((field) => field.key)).toEqual([
      'repoName', 'category', 'title', 'description', 'upvotes', 'comments', 'status', 'siteName', 'bgColor', 'accentColor', 'textColor',
    ]);
    expect(texts(tree())).toEqual([
      'acme/widgets', 'Ideas', discussion.defaults.title, discussion.defaults.description,
      '128 upvotes', '42 comments', 'Answered', 'github.com',
    ]);
    expect(tree().props.style).toMatchObject({ width: '1200px', height: '630px' });
  });

  it.each(['Open', 'unknown', '', 'answered'])('hides the status pill for %j', (status) => {
    expect(texts(tree({ status }))).not.toContain('Answered');
  });

  it.each(['', '   ', '\t\n'])('hides optional fields and empty containers for %j', (value) => {
    const overrides = Object.fromEntries(optional.map((key) => [key, value]));
    const result = tree({ ...overrides, repoName: value, status: 'Open' });
    expect(texts(result)).toEqual([discussion.defaults.title]);
    expect(elements(result)).toHaveLength(2);
  });

  it.each(optional)('hides %s independently', (key) => {
    expect(texts(tree({ [key]: '   ' }))).not.toContain(discussion.defaults[key]);
  });

  it('shrinks title and excerpt before truncating and bounds all other text', () => {
    const result = tree(long);
    const strings = texts(result);
    expect(strings.map((value) => Array.from(value).length)).toEqual([40, 20, 120, 100, 14, 14, 8, 16]);
    const title = elements(result).find((el) => el.props.children === strings[2])!;
    const excerpt = elements(result).find((el) => el.props.children === strings[3])!;
    expect(title.props.style.fontSize).toBe('44px');
    expect(excerpt.props.style.fontSize).toBe('18px');
    expect(strings[2].endsWith('…')).toBe(true);
    expect(strings[3].endsWith('…')).toBe(true);
    expect(texts(tree({ title: '   ' }))).toContain(discussion.defaults.title);
  });

  it.each(['#ffffff', '#0d1117'])('keeps category, status and accent text readable on %s', (bgColor) => {
    const result = tree({ bgColor, textColor: bgColor === '#ffffff' ? '#111111' : '#ffffff', accentColor: '#ffff00' });
    for (const el of elements(result).filter((el) => el.props.style?.borderRadius === '999px')) {
      expect(contrast(el.props.style.color, el.props.style.background)).toBeGreaterThanOrEqual(4.5);
    }
    const repo = elements(result).find((el) => el.props.children === 'acme/widgets')!;
    expect(contrast(repo.props.style.color, bgColor)).toBeGreaterThanOrEqual(4.5);
  });

  it.each([
    ['defaults', {}], ['empty', { ...empty, status: 'Open' }],
    ['long', long], ['light', { bgColor: '#ffffff', textColor: '#111111' }],
  ])('renders %s to SVG and a 1200x630 PNG without missing glyphs', async (_, overrides) => {
    const element = tree(overrides);
    const unresolved: string[] = [];
    const boxes: { top: number; left: number; width: number; height: number }[] = [];
    const svg = await satori(element as any, {
      width: 1200, height: 630, fonts,
      onNodeDetected: (node) => { boxes.push(node); },
      loadAdditionalAsset: async (_code, segment) => { unresolved.push(segment); return ''; },
    });
    expect(unresolved).toEqual([]);
    expect(boxes.every((box) => box.top >= 0 && box.left >= 0 && box.top + box.height <= 631 && box.left + box.width <= 1201)).toBe(true);
    for (const el of elements(element).filter((el) => el.type === 'div')) expect(el.props.style.display).toBe('flex');
    const png = new Resvg(svg).render();
    expect(png.width).toBe(1200);
    expect(png.height).toBe(630);
    expect(png.asPng().subarray(0, 8)).toEqual(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
    expect(tree(overrides)).toEqual(element);
  });
});
