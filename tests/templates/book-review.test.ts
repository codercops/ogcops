import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import satori from 'satori';
import bookReview from '@/templates/blog/book-review';
import { blogBookReview } from '@/templates/blog';
import { getTemplate, getTemplatesByCategory } from '@/templates/registry';
import { hexToRgb } from '@/templates/utils';
import type { SatoriElement } from '@/templates/types';

const fontFiles: [file: string, name: string, weight: 400 | 500 | 600 | 700][] = [
  ['Inter-Regular.woff', 'Inter', 400],
  ['Inter-Medium.woff', 'Inter', 500],
  ['Inter-SemiBold.woff', 'Inter', 600],
  ['Inter-Bold.woff', 'Inter', 700],
  ['PlayfairDisplay-Regular.woff', 'Playfair Display', 400],
  ['PlayfairDisplay-Bold.woff', 'Playfair Display', 700],
];

const fonts = fontFiles.map(([file, name, weight]) => ({
  name,
  data: readFileSync(join(process.cwd(), 'public/fonts', file)),
  weight,
  style: 'normal' as const,
}));

function textContent(node: unknown): string[] {
  if (typeof node === 'string') return [node];
  if (Array.isArray(node)) return node.flatMap(textContent);
  if (node && typeof node === 'object' && 'props' in node) {
    return textContent((node as SatoriElement).props.children);
  }
  return [];
}

function elements(node: unknown): SatoriElement[] {
  if (Array.isArray(node)) return node.flatMap(elements);
  if (node && typeof node === 'object' && 'type' in node) {
    const element = node as SatoriElement;
    return [element, ...elements(element.props.children)];
  }
  return [];
}

function styleOf(node: unknown, text: string): Record<string, any> | undefined {
  return elements(node).find((element) => element.props?.children === text)?.props?.style;
}

function luminance(hex: string): number {
  const rgb = hexToRgb(hex);
  if (!rgb) throw new Error(`not a hex color: ${hex}`);
  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map((value) => {
    const channel = value / 255;
    return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

const render = (overrides: Record<string, unknown> = {}) =>
  bookReview.render({ ...bookReview.defaults, ...overrides });

const renderToSvg = (element: unknown) =>
  satori(element as any, { width: 1200, height: 630, fonts });

describe('blog-book-review', () => {
  it('is re-exported and registered in the blog category', () => {
    expect(blogBookReview).toBe(bookReview);
    expect(getTemplate('blog-book-review')).toBe(bookReview);
    expect(getTemplatesByCategory('blog').filter((template) => template.id === 'blog-book-review')).toHaveLength(1);
    expect(bookReview.category).toBe('blog');
  });

  it('defines the fields requested for the template', () => {
    expect(bookReview.fields.map((field) => field.key)).toEqual([
      'title',
      'bookAuthor',
      'rating',
      'verdict',
      'genre',
      'author',
      'coverColor',
      'siteName',
      'bgColor',
      'accentColor',
      'textColor',
    ]);
    expect(bookReview.description).toBeTruthy();
    expect(bookReview.tags.length).toBeGreaterThanOrEqual(4);
    expect(bookReview.tags.length).toBeLessThanOrEqual(6);
  });

  it('renders the default cover, review copy, rating, and footer', () => {
    expect(textContent(render())).toEqual([
      'The Quiet Codebase',
      'Mira Okafor',
      'Software craft',
      'The Quiet Codebase',
      'by Mira Okafor',
      '“The best book on maintenance I\'ve read in years”',
      'Reviewed by Ari Chen',
      'codercops.com',
    ]);

    const svgFillCount = JSON.stringify(render()).split('#F5C518').length - 1;
    expect(svgFillCount).toBe(4);
  });

  it('uses the normalized whole-star rating for numeric, string, invalid, and out-of-range input', () => {
    const filledStars = (rating: unknown) => JSON.stringify(render({ rating })).split('#F5C518').length - 1;

    expect(filledStars(0)).toBe(1);
    expect(filledStars(7)).toBe(5);
    expect(filledStars(3.6)).toBe(4);
    expect(filledStars('abc')).toBe(4);
    expect(filledStars('2')).toBe(2);
    expect(JSON.stringify(render())).not.toContain('★');
  });

  it('skips a blank genre, verdict, or reviewer without leaving placeholder content', () => {
    const element = render({ genre: '', verdict: '', author: '' });
    const out = textContent(element);

    expect(out).not.toContain('Software craft');
    expect(out).not.toContain('“The best book on maintenance I\'ve read in years”');
    expect(out).not.toContain('Reviewed by Ari Chen');
    expect(out).toContain('The Quiet Codebase');
    expect(out).toContain('codercops.com');

    const rightColumn = element.props.children[1];
    const mainColumn = rightColumn.props.children[0];
    expect(mainColumn.props.children[0].type).toBe('h1');

    const footer = rightColumn.props.children[1];
    expect(footer.props.style.justifyContent).toBe('flex-end');
    expect(textContent(footer)).toEqual(['codercops.com']);
  });

  it('omits the footer entirely when both reviewer and site name are blank', () => {
    const element = render({ author: '', siteName: '' });
    const rightColumn = element.props.children[1];
    expect(rightColumn.props.children).toHaveLength(1);
    expect(textContent(element)).not.toContain('Reviewed by');
    expect(textContent(element)).not.toContain('codercops.com');
  });

  it('shrinks and then truncates a long book title on the card and cover', () => {
    const longTitle = 'A very long book title about software maintenance that keeps going far beyond the space available '.repeat(2);
    const element = render({ title: longTitle });
    const all = elements(element);
    const titleElement = all.find((element) => element.type === 'h1');
    const coverTitleElement = all.find((element) => element.type === 'h2');

    expect(titleElement?.props.style.fontSize).toBe('32px');
    expect(textContent(titleElement)[0].length).toBeLessThanOrEqual(88);
    expect(textContent(titleElement)[0].endsWith('…')).toBe(true);

    expect(coverTitleElement?.props.style.fontSize).toBe('22px');
    expect(textContent(coverTitleElement)[0].length).toBeLessThanOrEqual(68);
    expect(textContent(coverTitleElement)[0].endsWith('…')).toBe(true);
  });

  it('truncates long supporting text so each line stays in its lane', () => {
    const long = 'A very long piece of supporting text that should not overrun the card '.repeat(3);
    const out = textContent(render({
      bookAuthor: long,
      verdict: long,
      genre: long,
      author: long,
      siteName: long,
    }));

    expect(out.find((text) => text.startsWith('by '))!.length).toBeLessThanOrEqual(45);
    expect(out.find((text) => text.startsWith('“'))!.length).toBeLessThanOrEqual(94);
    expect(out.find((text) => text.startsWith('Reviewed by '))!.length).toBeLessThanOrEqual(46);
    expect(out.includes(long)).toBe(false);
  });

  it('uses readable ink on a light book cover', () => {
    const element = render({ coverColor: '#F5E6C8' });
    const coverTitle = elements(element).find((element) => element.type === 'h2');
    const coverAuthor = elements(element).find((element) => element.props?.children === 'Mira Okafor');

    expect(coverTitle?.props.style.color).toBe('#000000');
    expect(contrast('#F5E6C8', coverTitle!.props.style.color)).toBeGreaterThanOrEqual(4.5);
    expect(contrast('#F5E6C8', coverAuthor!.props.style.color)).toBeGreaterThanOrEqual(4.5);
  });

  it('keeps body and muted text readable on a light background', () => {
    const element = render({ bgColor: '#ffffff', textColor: '#111111' });
    expect(element.props.style.backgroundColor).toBe('#ffffff');

    const title = elements(element).find((item) => item.type === 'h1');
    expect(title?.props.style.color).toBeDefined();
    expect(contrast('#ffffff', title!.props.style.color)).toBeGreaterThanOrEqual(4.5);

    for (const text of ['by Mira Okafor', 'Reviewed by Ari Chen']) {
      const style = styleOf(element, text);
      expect(style?.color).toBeDefined();
      expect(contrast('#ffffff', style!.color)).toBeGreaterThanOrEqual(4.5);
    }
  });

  it('uses display flex on every div', () => {
    for (const element of elements(render())) {
      if (element.type === 'div') {
        expect(element.props.style?.display).toBe('flex');
      }
    }
  });

  it('renders valid SVG for defaults, light colors, and blank optional fields', async () => {
    await expect(renderToSvg(render())).resolves.toMatch(/^<svg/);
    await expect(renderToSvg(render({ bgColor: '#ffffff', textColor: '#111111', coverColor: '#F5E6C8' }))).resolves.toMatch(/^<svg/);
    await expect(renderToSvg(render({ genre: '', verdict: '', author: '', siteName: '' }))).resolves.toMatch(/^<svg/);
  });
});
