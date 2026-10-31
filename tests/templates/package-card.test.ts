import { describe, expect, it } from 'vitest';
import packageCard from '@/templates/github/package-card';
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
  packageCard.render({ ...packageCard.defaults, ...overrides });

const render = (overrides: Record<string, unknown> = {}) => texts(tree(overrides));

describe('github-package-card', () => {
  it('is registered in the github category and re-exported', async () => {
    expect(getTemplate('github-package-card')?.category).toBe('github');
    const exports = await import('@/templates/github');
    expect(exports.githubPackageCard.id).toBe('github-package-card');
  });

  it('has the fields the issue asks for, with the defaults it names', () => {
    expect(packageCard.fields.map((field) => field.key)).toEqual([
      'title',
      'description',
      'registry',
      'version',
      'downloads',
      'license',
      'install',
      'siteName',
      'bgColor',
      'accentColor',
      'textColor',
    ]);
    expect(packageCard.defaults).toMatchObject({
      title: '@acme/csv-stream',
      description: 'A streaming CSV parser for Node',
      registry: 'npm',
      version: 'v2.4.1',
      downloads: '182k weekly downloads',
      license: 'MIT',
      install: 'npm i @acme/csv-stream',
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
      'npm package',
      '@acme/csv-stream',
      'v2.4.1',
      'A streaming CSV parser for Node',
      '182k weekly downloads',
      'MIT',
      '$',
      'npm i @acme/csv-stream',
      'github.com/acme/csv-stream',
    ]);
  });

  it('formats custom registry names cleanly', () => {
    expect(render({ registry: 'PyPI' })).toContain('PyPI package');
    expect(render({ registry: 'crates.io' })).toContain('crates.io package');
    expect(render({ registry: 'npm package' })).toContain('npm package');
  });

  it('shrinks long package name with autoFontSize and truncates', () => {
    const normalTitle = '@acme/csv-stream';
    const longTitle = '@acme-enterprise/ultra-resilient-high-throughput-csv-streaming-engine';

    const normalStyle = styleOf(tree({ title: normalTitle }), normalTitle);
    const longTree = tree({ title: longTitle });
    const renderedTexts = texts(longTree);
    const truncatedTitle = renderedTexts.find((t) => t.startsWith('@acme-enterprise/'));
    expect(truncatedTitle).toBeDefined();
    expect(truncatedTitle?.length).toBeLessThanOrEqual(55);

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

  it('truncates a long install command inside its box', () => {
    const longInstall = 'npm install @acme-enterprise/ultra-resilient-high-throughput-csv-streaming-engine-with-all-plugins-enabled --save-exact';
    const longTree = tree({ install: longInstall });
    const renderedTexts = texts(longTree);
    const truncatedInstall = renderedTexts.find((t) => t.startsWith('npm install'));
    expect(truncatedInstall).toBeDefined();
    expect(truncatedInstall?.length).toBeLessThanOrEqual(70);
  });

  it('hides an empty pitch, registry, version, downloads, license, install or site name (or only spaces) cleanly', () => {
    expect(render({ registry: '' })).not.toContain('npm package');
    expect(render({ registry: '   ' })).not.toContain('npm package');

    expect(render({ version: '' })).not.toContain('v2.4.1');
    expect(render({ version: '  ' })).not.toContain('v2.4.1');

    expect(render({ description: '' })).not.toContain('A streaming CSV parser for Node');
    expect(render({ description: '   ' })).not.toContain('A streaming CSV parser for Node');

    expect(render({ downloads: '' })).not.toContain('182k weekly downloads');
    expect(render({ downloads: '  ' })).not.toContain('182k weekly downloads');

    expect(render({ license: '' })).not.toContain('MIT');
    expect(render({ license: '   ' })).not.toContain('MIT');

    expect(render({ install: '' })).not.toContain('npm i @acme/csv-stream');
    expect(render({ install: '   ' })).not.toContain('npm i @acme/csv-stream');

    expect(render({ siteName: '' })).not.toContain('github.com/acme/csv-stream');
    expect(render({ siteName: '   ' })).not.toContain('github.com/acme/csv-stream');

    const allOptionalCleared = render({
      registry: '',
      version: ' ',
      description: '',
      downloads: '  ',
      license: '',
      install: '   ',
      siteName: '',
    });
    expect(allOptionalCleared).toEqual(['@acme/csv-stream']);
  });

  it('keeps the label, version pill and accent text readable on a light background', () => {
    const lightTree = tree({ bgColor: '#ffffff', accentColor: '#58a6ff' });
    const labelStyle = styleOf(lightTree, 'npm package');
    const labelColor = String(labelStyle?.color);

    const expectedColor = mixColors('#58a6ff', '#000000', 0.45);
    expect(labelColor).toBe(expectedColor);
    expect(isLightColor(labelColor)).toBe(false);

    const versionStyle = styleOf(lightTree, 'v2.4.1');
    expect(versionStyle?.color).toBe(expectedColor);
  });
});
