import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import specSheet from '@/templates/product/spec-sheet';
import { productSpecSheet } from '@/templates/product';
import { getTemplate } from '@/templates/registry';
import type { SatoriElement } from '@/templates/types';

const fontFiles: [file: string, name: string, weight: 400 | 500 | 600 | 700][] = [
  ['Inter-Regular.woff', 'Inter', 400],
  ['Inter-Medium.woff', 'Inter', 500],
  ['Inter-SemiBold.woff', 'Inter', 600],
  ['Inter-Bold.woff', 'Inter', 700],
];

const fonts = fontFiles.map(([file, name, weight]) => ({
  name,
  data: readFileSync(join(process.cwd(), 'public/fonts', file)),
  weight,
  style: 'normal' as const,
}));

const renderToSvg = (element: unknown) =>
  satori(element as any, { width: 1200, height: 630, fonts });

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

function countNodes(node: unknown, predicate: (element: SatoriElement) => boolean): number {
  if (!node || typeof node !== 'object') return 0;
  let count = 0;
  if ('props' in node) {
    const el = node as SatoriElement;
    if (predicate(el)) count++;
    const children = el.props.children;
    if (Array.isArray(children)) {
      for (const child of children) {
        count += countNodes(child, predicate);
      }
    } else if (children && typeof children === 'object') {
      count += countNodes(children, predicate);
    }
  }
  return count;
}

const render = (overrides: Record<string, unknown> = {}) =>
  specSheet.render({ ...specSheet.defaults, ...overrides });

describe('product-spec-sheet template', () => {
  it('is registered and re-exported properly', () => {
    const registered = getTemplate('product-spec-sheet');
    expect(registered).toBe(specSheet);
    expect(productSpecSheet).toBe(specSheet);
    expect(registered?.category).toBe('product');
    expect(registered?.name).toBe('Spec Sheet');
  });

  it('has valid description and 4 to 6 relevant tags', () => {
    expect(specSheet.description).toBeTruthy();
    expect(specSheet.tags.length).toBeGreaterThanOrEqual(4);
    expect(specSheet.tags.length).toBeLessThanOrEqual(6);
  });

  it('contains all required field definitions', () => {
    const fieldKeys = specSheet.fields.map((f) => f.key);
    expect(fieldKeys).toEqual(
      expect.arrayContaining([
        'title',
        'pitch',
        'priceLine',
        'label1',
        'value1',
        'label2',
        'value2',
        'label3',
        'value3',
        'label4',
        'value4',
        'label5',
        'value5',
        'siteName',
        'bgColor',
        'accentColor',
        'textColor',
      ]),
    );
  });

  it('renders default values for title, pitch, priceLine, spec rows, and siteName', () => {
    const texts = textContent(render());
    expect(texts).toContain('Field Recorder Pro');
    expect(texts).toContain('Studio-grade audio recording anywhere you go');
    expect(texts).toContain('$299');
    expect(texts).toContain('Recording');
    expect(texts).toContain('32-bit float, 192 kHz');
    expect(texts).toContain('Battery');
    expect(texts).toContain('18 hours');
    expect(texts).toContain('Storage');
    expect(texts).toContain('128 GB + microSD');
    expect(texts).toContain('Weight');
    expect(texts).toContain('140 g');
    expect(texts).toContain('Connection');
    expect(texts).toContain('USB-C, Bluetooth');
    expect(texts).toContain('acmeaudio.io');
  });

  it('skips blank value rows with no gap', () => {
    // Blank value row in the middle (row 2)
    const element = render({
      label2: 'Battery',
      value2: '',
    });
    const texts = textContent(element);
    expect(texts).toContain('32-bit float, 192 kHz');
    expect(texts).not.toContain('Battery');
    expect(texts).not.toContain('18 hours');
    expect(texts).toContain('128 GB + microSD');

    // With 4 remaining rows, exactly 3 dividers should exist
    const dividers = countNodes(
      element,
      (node) =>
        node.props?.style?.borderBottom !== undefined &&
        node.props?.style?.borderBottom !== 'none',
    );
    expect(dividers).toBe(3);
  });

  it('skips multiple blank value rows leaving only active rows', () => {
    const element = render({
      value2: '',
      value3: '   ',
      value5: '',
    });
    const texts = textContent(element);
    expect(texts).toContain('32-bit float, 192 kHz');
    expect(texts).not.toContain('18 hours');
    expect(texts).not.toContain('128 GB + microSD');
    expect(texts).toContain('140 g');
    expect(texts).not.toContain('USB-C, Bluetooth');

    // 2 active rows (rows 1 and 4) -> exactly 1 divider
    const dividers = countNodes(
      element,
      (node) =>
        node.props?.style?.borderBottom !== undefined &&
        node.props?.style?.borderBottom !== 'none',
    );
    expect(dividers).toBe(1);
  });

  it('shows value on its own when value is present but label is blank', () => {
    const element = render({
      label1: '',
      value1: 'All-inclusive standalone spec',
    });
    const texts = textContent(element);
    expect(texts).toContain('All-inclusive standalone spec');
    expect(texts).not.toContain('Recording');

    const renderedElements = elements(element);
    // Find the row containing the standalone spec value
    const rowEl = renderedElements.find(
      (el) =>
        el.type === 'div' &&
        Array.isArray(el.props?.children) &&
        el.props.children.some(
          (c: any) => c?.props?.children === 'All-inclusive standalone spec',
        ),
    );
    expect(rowEl).toBeDefined();
    // Only 1 child (value span) instead of 2 children (label span + value span)
    expect(rowEl?.props?.children).toHaveLength(1);
  });

  it('makes left side take full width when all rows are blank', () => {
    const element = render({
      value1: '',
      value2: '',
      value3: '',
      value4: '',
      value5: '',
    });

    // Root container has only 1 child (the left column), not 2
    expect(element.props.children).toHaveLength(1);

    // Left column takes 100% width
    const leftCol = element.props.children[0];
    expect(leftCol.props.style.width).toBe('100%');

    // Title and pitch still render
    const texts = textContent(element);
    expect(texts).toContain('Field Recorder Pro');
    expect(texts).toContain('Studio-grade audio recording anywhere you go');
  });

  it('shrinks font size via autoFontSize and truncates long product titles', () => {
    const longTitle = 'HyperSonic Ultra Portable Modular Multi-Track Audio Interface Hardware Pro';
    const element = render({ title: longTitle });
    const renderedElements = elements(element);
    const h1 = renderedElements.find((item) => item.type === 'h1');

    expect(h1).toBeDefined();
    expect(h1?.props.style.fontSize).toBe('28px');
    const renderedTitle = textContent(h1)[0];
    expect(renderedTitle.length).toBeLessThanOrEqual(60);
    expect(renderedTitle).toMatch(/…$/);
  });

  it('truncates long labels and values to keep columns aligned', () => {
    const longLabel = 'ExtraordinarilyLongSpecificationCategoryLabel';
    const longValue = 'SuperHighPrecisionFrequencyResponseRangeCoveringAllHumanAndNonHumanHearingSpectrum';
    const element = render({
      label1: longLabel,
      value1: longValue,
    });
    const renderedElements = elements(element);

    const labelSpan = renderedElements.find(
      (el) => el.type === 'span' && el.props?.style?.width === '150px',
    );
    expect(labelSpan).toBeDefined();
    expect(labelSpan?.props.style.width).toBe('150px');
    expect(labelSpan?.props.style.flexShrink).toBe(0);
    expect(textContent(labelSpan)[0]).toMatch(/…$/);
    expect(textContent(labelSpan)[0].length).toBeLessThanOrEqual(20);

    const texts = textContent(element);
    expect(texts.some((t) => t.includes('…'))).toBe(true);
  });

  it('ensures display: flex on every div element', () => {
    const element = render();
    const nonFlexDivs = countNodes(
      element,
      (node) => node.type === 'div' && node.props?.style?.display !== 'flex',
    );
    expect(nonFlexDivs).toBe(0);
  });

  it('renders correctly on a light background', () => {
    const element = render({
      bgColor: '#FFFFFF',
      textColor: '#111827',
      accentColor: '#2563EB',
    });
    expect(element.props.style.backgroundColor).toBe('#FFFFFF');

    const renderedElements = elements(element);
    const labelSpan = renderedElements.find(
      (el) => el.type === 'span' && el.props?.style?.width === '150px',
    );
    // Label color should be mixed for light background readability
    expect(labelSpan?.props.style.color).toBeDefined();
    expect(labelSpan?.props.style.color).not.toBe('#FFFFFF');
  });

  it('renders valid SVG and PNG for defaults, light theme, and all-blank', async () => {
    // Default render
    const svgDefault = await renderToSvg(render());
    expect(svgDefault).toMatch(/^<svg/);
    const pngDefault = new Resvg(svgDefault).render().asPng();
    expect(pngDefault[0]).toBe(0x89);
    expect(pngDefault[1]).toBe(0x50); // P
    expect(pngDefault[2]).toBe(0x4e); // N
    expect(pngDefault[3]).toBe(0x47); // G

    // Light background render
    const svgLight = await renderToSvg(
      render({ bgColor: '#FFFFFF', textColor: '#111827', accentColor: '#2563EB' }),
    );
    expect(svgLight).toMatch(/^<svg/);
    const pngLight = new Resvg(svgLight).render().asPng();
    expect(pngLight[0]).toBe(0x89);

    // All rows blank (full width) render
    const svgBlank = await renderToSvg(
      render({ value1: '', value2: '', value3: '', value4: '', value5: '' }),
    );
    expect(svgBlank).toMatch(/^<svg/);
    const pngBlank = new Resvg(svgBlank).render().asPng();
    expect(pngBlank[0]).toBe(0x89);
  });
});
