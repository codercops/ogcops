import { describe, expect, it } from 'vitest';
import maintainersWanted from '@/templates/github/maintainers-wanted';
import { getTemplate } from '@/templates/registry';
import { isLightColor, mixColors } from '@/templates/utils';
import type { SatoriElement } from '@/templates/types';

function elements(node: unknown): SatoriElement[] {
  if (Array.isArray(node)) return node.flatMap(elements);
  if (!node || typeof node !== 'object' || !('type' in node)) return [];

  const element = node as SatoriElement;
  return [element, ...elements(element.props.children)];
}

function texts(node: unknown): string[] {
  if (typeof node === 'string') return [node];
  if (Array.isArray(node)) return node.flatMap(texts);
  if (node && typeof node === 'object' && 'props' in node) {
    return texts((node as SatoriElement).props.children);
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

const tree = (overrides: Record<string, unknown> = {}) =>
  maintainersWanted.render({ ...maintainersWanted.defaults, ...overrides });

const render = (overrides: Record<string, unknown> = {}) => texts(tree(overrides));

describe('github-maintainers-wanted', () => {
  it('is registered in the github category and re-exported', async () => {
    expect(getTemplate('github-maintainers-wanted')?.category).toBe('github');
    const exports = await import('@/templates/github');
    expect(exports.githubMaintainersWanted.id).toBe('github-maintainers-wanted');
  });

  it('has the fields the issue asks for, with the defaults it names', () => {
    expect(maintainersWanted.fields.map((field) => field.key)).toEqual([
      'title',
      'description',
      'stars',
      'openIssues',
      'help1',
      'help2',
      'help3',
      'siteName',
      'bgColor',
      'accentColor',
      'textColor',
    ]);
    expect(maintainersWanted.defaults).toMatchObject({
      title: 'acme/csv-stream',
      description: 'A streaming CSV parser for Node',
      stars: '4.2k stars',
      openIssues: '38 open issues',
      help1: 'Review pull requests',
      help2: 'Triage new issues',
      help3: 'Cut releases',
      siteName: 'github.com/acme/csv-stream',
      bgColor: '#0d1117',
      accentColor: '#58a6ff',
      textColor: '#e6edf3',
    });
  });

  it('renders a 1200x630 card and every div is flex', () => {
    const root = tree();
    expect(root.props.style).toMatchObject({ width: '1200px', height: '630px' });
    for (const el of elements(root).filter((e) => e.type === 'div')) {
      expect(el.props.style?.display).toBe('flex');
    }
  });

  it('renders with its defaults in order', () => {
    expect(render()).toEqual([
      'Maintainers wanted',
      'acme/csv-stream',
      'A streaming CSV parser for Node',
      '4.2k stars',
      '38 open issues',
      'Review pull requests',
      'Triage new issues',
      'Cut releases',
      'github.com/acme/csv-stream',
    ]);
  });

  it('shrinks long repository name with autoFontSize and truncates', () => {
    const normalTitle = 'acme/csv-stream';
    const longTitle = 'acme-corporation/ultra-fast-streaming-csv-parser-and-serializer-for-nodejs';

    const normalStyle = styleOf(tree({ title: normalTitle }), normalTitle);
    const longTree = tree({ title: longTitle });
    const renderedTexts = texts(longTree);
    const truncatedTitle = renderedTexts.find((t) => t.startsWith('acme-corporation/'));
    expect(truncatedTitle).toBeDefined();
    expect(truncatedTitle?.length).toBeLessThanOrEqual(60);

    const longStyle = styleOf(longTree, truncatedTitle!);
    const normalSize = parseInt(String(normalStyle?.fontSize), 10);
    const longSize = parseInt(String(longStyle?.fontSize), 10);
    expect(longSize).toBeLessThan(normalSize);
  });

  it('shrinks long pitch with autoFontSize and truncates', () => {
    const normalPitch = 'A streaming CSV parser for Node';
    const longPitch =
      'A high-performance streaming CSV parser and serializer designed specifically for enterprise Node.js environments with custom delimiters, asynchronous pipelines, and schema validation.';

    const normalStyle = styleOf(tree({ description: normalPitch }), normalPitch);
    const longTree = tree({ description: longPitch });
    const renderedTexts = texts(longTree);
    const truncatedPitch = renderedTexts.find((t) => t.startsWith('A high-performance'));
    expect(truncatedPitch).toBeDefined();
    expect(truncatedPitch?.length).toBeLessThanOrEqual(140);

    const longStyle = styleOf(longTree, truncatedPitch!);
    const normalSize = parseInt(String(normalStyle?.fontSize), 10);
    const longSize = parseInt(String(longStyle?.fontSize), 10);
    expect(longSize).toBeLessThan(normalSize);
  });

  it('skips blank help lines with no gaps', () => {
    const withBlankMiddle = render({
      help1: 'Review pull requests',
      help2: '   ',
      help3: 'Cut releases',
    });
    expect(withBlankMiddle).toEqual([
      'Maintainers wanted',
      'acme/csv-stream',
      'A streaming CSV parser for Node',
      '4.2k stars',
      '38 open issues',
      'Review pull requests',
      'Cut releases',
      'github.com/acme/csv-stream',
    ]);

    const withOnlyOneHelp = render({
      help1: '   ',
      help2: 'Triage new issues',
      help3: '',
    });
    expect(withOnlyOneHelp).toEqual([
      'Maintainers wanted',
      'acme/csv-stream',
      'A streaming CSV parser for Node',
      '4.2k stars',
      '38 open issues',
      'Triage new issues',
      'github.com/acme/csv-stream',
    ]);
  });

  it('hides an empty pitch, stars, openIssues or site name (or only spaces) cleanly', () => {
    expect(render({ description: '' })).not.toContain('A streaming CSV parser for Node');
    expect(render({ description: '   ' })).not.toContain('A streaming CSV parser for Node');

    expect(render({ stars: '' })).not.toContain('4.2k stars');
    expect(render({ stars: '  ' })).not.toContain('4.2k stars');

    expect(render({ openIssues: '' })).not.toContain('38 open issues');
    expect(render({ openIssues: '  ' })).not.toContain('38 open issues');

    expect(render({ siteName: '' })).not.toContain('github.com/acme/csv-stream');
    expect(render({ siteName: '   ' })).not.toContain('github.com/acme/csv-stream');

    const allOptionalCleared = render({
      description: '',
      stars: '  ',
      openIssues: '',
      help1: '',
      help2: ' ',
      help3: '',
      siteName: '',
    });
    expect(allOptionalCleared).toEqual(['Maintainers wanted', 'acme/csv-stream']);
  });

  it('keeps the label and accent text readable on a light background', () => {
    const lightTree = tree({ bgColor: '#ffffff', accentColor: '#58a6ff' });
    const labelStyle = styleOf(lightTree, 'Maintainers wanted');
    const labelColor = String(labelStyle?.color);

    expect(labelColor).toBe(mixColors('#58a6ff', '#000000', 0.45));
    expect(isLightColor(labelColor)).toBe(false);
  });

  it('gives the help list a top margin when the stats row is hidden', () => {
    const defaultElements = elements(tree());
    const helpContainerWithStats = defaultElements.find((el) =>
      Array.isArray(el.props.children) &&
      el.props.children.length === 3 &&
      el.props.style?.gap === '10px'
    );
    expect(helpContainerWithStats?.props.style?.marginTop).toBe('0px');

    const noStatsElements = elements(tree({ stars: '', openIssues: '' }));
    const helpContainerWithoutStats = noStatsElements.find((el) =>
      Array.isArray(el.props.children) &&
      el.props.children.length === 3 &&
      el.props.style?.gap === '10px'
    );
    expect(helpContainerWithoutStats?.props.style?.marginTop).toBe('24px');
  });
});
