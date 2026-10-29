import { describe, expect, it } from 'vitest';
import benchmark from '@/templates/blog/benchmark';
import { blogBenchmark } from '@/templates/blog';
import { getTemplate, getTemplatesByCategory } from '@/templates/registry';
import { mixColors } from '@/templates/utils';
import type { SatoriElement } from '@/templates/types';

function elements(node: unknown): SatoriElement[] {
  if (Array.isArray(node)) return node.flatMap(elements);
  if (!node || typeof node !== 'object' || !('type' in node)) return [];

  const element = node as SatoriElement;
  return [element, ...elements(element.props.children)];
}

function textContent(node: unknown): string[] {
  if (typeof node === 'string') return [node];
  if (Array.isArray(node)) return node.flatMap(textContent);
  if (node && typeof node === 'object' && 'props' in node) {
    return textContent((node as SatoriElement).props.children);
  }
  return [];
}

const render = (overrides: Record<string, unknown> = {}) =>
  benchmark.render({ ...benchmark.defaults, ...overrides });
const rows = (tree: unknown) => elements(tree).filter((element) => element.type === 'div' && element.props.style?.minHeight === '68px');

describe('blog-benchmark', () => {
  it('is re-exported and registered once in the Blog category', () => {
    expect(blogBenchmark).toBe(benchmark);
    expect(getTemplate('blog-benchmark')).toBe(benchmark);
    expect(getTemplatesByCategory('blog').filter(({ id }) => id === 'blog-benchmark')).toHaveLength(1);
  });

  it('renders the label, title, optional note, ordered rows, and formatted values', () => {
    const tree = render();
    const text = textContent(tree);

    expect(text).toContain('Benchmark');
    expect(text).toContain('Bun vs Deno vs Node: HTTP throughput');
    expect(text).toContain('Requests per second, higher is better');
    expect(text).toContain('112,000 req/s');
    expect(text).toContain('71,000 req/s');
    expect(text).toContain('48,000 req/s');
    expect(text).toContain('codercops.com');
    expect(rows(tree)).toHaveLength(3);
    expect(rows(tree).map((row) => textContent((row.props.children as SatoriElement[])[0])[0]))
      .toEqual(['Bun', 'Deno', 'Node']);
  });

  it('scales every bar to the largest value and highlights only the first largest row', () => {
    const tree = render({ value1: '500', value2: '250', value3: '125' });
    const rowElements = rows(tree);
    const fills = rowElements.map((row) => (row.props.children as SatoriElement[])[1].props.children[0] as SatoriElement);

    expect(fills.map(({ props }) => props.style.width)).toEqual(['100%', '50%', '25%']);
    expect(fills[0].props.style.backgroundColor).toBe('#E07A5F');
    expect(fills[1].props.style.backgroundColor).not.toBe('#E07A5F');
    expect(fills[2].props.style.backgroundColor).not.toBe('#E07A5F');
  });

  it('skips blank names and invalid, negative, or blank values without gaps', () => {
    const tree = render({
      name1: '  ', value1: '100',
      name2: 'Valid', value2: '25',
      name3: 'Negative', value3: '-1',
      name4: 'Not a number', value4: 'abc',
    });

    expect(rows(tree)).toHaveLength(1);
    expect(textContent(rows(tree)[0])).toEqual(['Valid', '25 req/s']);
  });

  it('draws empty bars for all-zero values without dividing by zero', () => {
    const tree = render({ value1: 0, value2: '0', value3: 0 });
    const fills = rows(tree).map((row) => (row.props.children as SatoriElement[])[1].props.children[0] as SatoriElement);

    expect(fills.map(({ props }) => props.style.width)).toEqual(['0%', '0%', '0%']);
    expect(JSON.stringify(tree)).not.toContain('NaN');
  });

  it('hides the chart when every row is skipped and hides an empty note', () => {
    const tree = render({
      description: ' ',
      name1: '', value1: 10,
      name2: 'Invalid', value2: 'Infinity',
      name3: 'Negative', value3: -1,
      name4: 'Blank', value4: '',
    });
    const allText = textContent(tree);

    expect(rows(tree)).toHaveLength(0);
    expect(allText).not.toContain(' ');
    expect(allText).not.toContain('10 req/s');
  });

  it('shrinks and truncates long titles, notes, and names', () => {
    const tree = render({
      title: 'Benchmark title '.repeat(10),
      description: 'Benchmark note '.repeat(12),
      name1: 'A very long benchmark name '.repeat(5),
    });
    const all = elements(tree);
    const title = all.find((element) => element.type === 'h1');
    const note = all.find((element) => element.type === 'span' && textContent(element)[0]?.startsWith('Benchmark note'));
    const name = all.find((element) => element.type === 'span' && textContent(element)[0]?.startsWith('A very long benchmark'));

    expect(textContent(title)[0]).toHaveLength(120);
    expect(textContent(title)[0]).toMatch(/…$/);
    expect(title?.props.style.fontSize).toBe('28px');
    expect(textContent(note)[0]).toHaveLength(120);
    expect(note?.props.style.fontSize).toBe('15px');
    expect(textContent(name)[0]).toHaveLength(80);
    expect(textContent(name)[0]).toMatch(/…$/);
    expect(name?.props.style.fontSize).toBe('14px');
  });

  it('darkens the label and largest bar accent on a light background', () => {
    const tree = render({ bgColor: '#ffffff', accentColor: '#fde047' });
    const accentInk = mixColors('#fde047', '#000000', 0.45);
    const all = elements(tree);
    const label = all.find((element) => element.type === 'span' && textContent(element)[0] === 'Benchmark');
    const title = all.find((element) => element.type === 'h1');
    const name = rows(tree)[0].props.children[0] as SatoriElement;
    const value = rows(tree)[0].props.children[2] as SatoriElement;
    const largestFill = (rows(tree)[0].props.children as SatoriElement[])[1].props.children[0] as SatoriElement;

    expect(label?.props.style.color).toBe(accentInk);
    expect(largestFill.props.style.backgroundColor).toBe(accentInk);
    expect(title?.props.style.color).toBe('#111111');
    expect(name.props.style.color).toBe('#111111');
    expect(value.props.style.color).toBe('#111111');
  });

  it('omits the unit when it is blank and trims number formatting', () => {
    const tree = render({ value1: '1000', unit: ' ' });
    expect(textContent(rows(tree)[0])).toContain('1,000');
    expect(textContent(rows(tree)[0])).not.toContain('1,000 ');
  });

  it('sizes and truncates long value labels so they stay inside their column', () => {
    const tree = render({ value1: '123456789.125', unit: 'requests per second '.repeat(5) });
    const values = rows(tree).map((row) => row.props.children[2] as SatoriElement);

    expect(textContent(values[0])[0]).toMatch(/^123,456,789\.125 requests per second/);
    expect(textContent(values[0])[0]).toMatch(/…$/);
    expect(textContent(values[0])[0]).toHaveLength(36);
    expect(values.map(({ props }) => props.style.width)).toEqual(['360px', '360px', '360px']);
    expect(values.map(({ props }) => props.style.fontSize)).toEqual(['14px', '14px', '14px']);
    for (const value of values) {
      expect(value.props.style.overflow).toBe('hidden');
      expect(value.props.style.textOverflow).toBe('ellipsis');
      expect(value.props.style.whiteSpace).toBe('nowrap');
    }
  });

  it('uses the longest value label to size one shared column without truncating shorter rows', () => {
    const tree = render({ unit: 'requests per second' });
    const values = rows(tree).map((row) => row.props.children[2] as SatoriElement);

    expect(values.map(({ props }) => props.style.width)).toEqual(['353px', '353px', '353px']);
    expect(values.map(({ props }) => props.style.fontSize)).toEqual(['14px', '14px', '14px']);
    expect(values.map((value) => textContent(value)[0])).toEqual([
      '112,000 requests per second',
      '71,000 requests per second',
      '48,000 requests per second',
    ]);
  });
});
