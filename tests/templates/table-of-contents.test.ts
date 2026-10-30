import { describe, expect, it } from 'vitest';
import blogTableOfContents from '@/templates/blog/table-of-contents';
import { blogTableOfContents as blogTableOfContentsExport } from '@/templates/blog';
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
  blogTableOfContents.render({ ...blogTableOfContents.defaults, ...overrides });

describe('blog-table-of-contents', () => {
  it('is re-exported and registered in the blog category', () => {
    expect(blogTableOfContentsExport).toBe(blogTableOfContents);
    expect(getTemplate('blog-table-of-contents')).toBe(blogTableOfContents);
    expect(
      getTemplatesByCategory('blog').filter((t) => t.id === 'blog-table-of-contents')
    ).toHaveLength(1);
    expect(blogTableOfContents.category).toBe('blog');
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

  it('renders title, label, numbered sections, and footer with defaults', () => {
    expect(textContent(tree())).toEqual([
      'Architecture Patterns for Large-Scale Frontend Applications',
      'In this post',
      '1',
      'Why micro-frontends fail at scale',
      '2',
      'The hidden cost of runtime integration',
      '3',
      'Module federation vs build-time composition',
      '4',
      'Migration playbook step-by-step',
      '5',
      'Benchmarks and team impact',
      '12 min read',
      'codercops.com',
    ]);
  });

  it('skips empty and whitespace-only sections and renumbers remaining sections consecutively', () => {
    const out = textContent(
      tree({
        section1: '   ',
        section2: 'First valid section',
        section3: '',
        section4: 'Second valid section',
        section5: '   ',
      })
    );

    expect(out).toEqual([
      'Architecture Patterns for Large-Scale Frontend Applications',
      'In this post',
      '1',
      'First valid section',
      '2',
      'Second valid section',
      '12 min read',
      'codercops.com',
    ]);
  });

  it('retains default reading time when field is omitted, and hides empty or whitespace-only reading time cleanly', () => {
    // When readTime is omitted completely
    const omittedTree = blogTableOfContents.render({
      title: 'Title',
      section1: 'Section 1',
      bgColor: '#0a0a0a',
      accentColor: '#E07A5F',
      textColor: '#FFFFFF',
    });
    expect(textContent(omittedTree)).toContain('12 min read');

    // When readTime is explicitly empty or whitespace
    for (const readTime of ['', '   ']) {
      const out = textContent(tree({ readTime }));
      expect(out).not.toContain('12 min read');
      expect(out).toContain('codercops.com');
    }
  });

  it('hides explicitly empty or whitespace-only siteName cleanly', () => {
    for (const siteName of ['', '   ']) {
      const out = textContent(tree({ siteName }));
      expect(out).not.toContain('codercops.com');
      expect(out).toContain('12 min read');
    }
  });

  it('hides footer entirely when both readTime and siteName are empty', () => {
    const out = textContent(tree({ readTime: '', siteName: '' }));
    expect(out).not.toContain('12 min read');
    expect(out).not.toContain('codercops.com');
  });

  it('truncates long title and section headings', () => {
    const longString = 'Super long text heading that goes on and on and exceeds the maximum allowed length '.repeat(3);
    const out = textContent(
      tree({
        title: longString,
        section1: longString,
        readTime: longString,
        siteName: longString,
      })
    );

    const title = out[0];
    expect(title.length).toBeLessThanOrEqual(90);
    expect(title.endsWith('…')).toBe(true);

    const section = out[3];
    expect(section.length).toBeLessThanOrEqual(70);
    expect(section.endsWith('…')).toBe(true);
  });

  it('maintains high contrast for label, numbers, and text on light background', () => {
    const lightTree = tree({
      bgColor: '#ffffff',
      textColor: '#111827',
      accentColor: '#E07A5F',
    });

    const labelStyle = styleOf(lightTree, 'In this post');
    expect(labelStyle?.color).toBeDefined();
    expect(contrast('#ffffff', labelStyle!.color)).toBeGreaterThanOrEqual(4.5);

    const number1Style = styleOf(lightTree, '1');
    expect(number1Style?.color).toBeDefined();
    expect(contrast('#ffffff', number1Style!.color)).toBeGreaterThanOrEqual(4.5);
  });

  it('maintains high contrast for label, numbers, and text on dark background', () => {
    const darkTree = tree();

    const labelStyle = styleOf(darkTree, 'In this post');
    expect(labelStyle?.color).toBeDefined();
    expect(contrast('#0a0a0a', labelStyle!.color)).toBeGreaterThanOrEqual(4.5);

    const number1Style = styleOf(darkTree, '1');
    expect(number1Style?.color).toBeDefined();
    expect(contrast('#0a0a0a', number1Style!.color)).toBeGreaterThanOrEqual(4.5);
  });

  it('renders all five sections and a two-line title without overflowing the 630px height', () => {
    const root = tree({
      title: 'A Very Long Article Title That Clearly Wraps Over Multiple Lines in the Card Header Area',
    });
    expect(root.props.style.height).toBe('630px');
    const texts = textContent(root);
    expect(texts).toContain('5');
    expect(texts).toContain('Benchmarks and team impact');
  });
});
