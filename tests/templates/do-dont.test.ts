import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import satori from 'satori';
import { describe, expect, it } from 'vitest';
import { getTemplate, getTemplatesByCategory } from '@/templates/registry';
import { tutorialDoDont } from '@/templates/tutorial';
import type { SatoriElement } from '@/templates/types';

const template = getTemplate('tutorial-do-dont');
if (!template) throw new Error('Template not found: tutorial-do-dont');

const fonts = [
  {
    name: 'Inter',
    data: readFileSync(join(process.cwd(), 'public/fonts/Inter-Regular.woff')),
    weight: 400 as const,
    style: 'normal' as const,
  },
  {
    name: 'Inter',
    data: readFileSync(join(process.cwd(), 'public/fonts/Inter-Bold.woff')),
    weight: 700 as const,
    style: 'normal' as const,
  },
];

function isSatoriElement(value: unknown): value is SatoriElement {
  return typeof value === 'object' && value !== null && 'type' in value && 'props' in value;
}

function getChildren(element: SatoriElement): SatoriElement[] {
  const children = element.props.children;
  return Array.isArray(children) ? children.filter(isSatoriElement) : isSatoriElement(children) ? [children] : [];
}

function getAllElements(element: SatoriElement): SatoriElement[] {
  return [element, ...getChildren(element).flatMap(getAllElements)];
}

function getColumnHeadings(element: SatoriElement): string[] {
  return getAllElements(element)
    .filter(
      (child) =>
        child.type === 'span' &&
        (child.props.children === 'Do' || child.props.children === "Don't"),
    )
    .map((child) => String(child.props.children));
}

describe('tutorial-do-dont', () => {
  it('is registered as a Tutorial template', () => {
    expect(template.id).toBe('tutorial-do-dont');
    expect(template.name).toBe("Do's and Don'ts");
    expect(template.category).toBe('tutorial');
    expect(template).toBe(tutorialDoDont);
    expect(getTemplatesByCategory('tutorial')).toContain(template);
  });

  it('renders the default title, headings, and all six items', () => {
    const serialized = JSON.stringify(template.render(template.defaults));

    expect(serialized).toContain('Git Commit Messages');
    expect(serialized).toContain('Use the imperative mood');
    expect(serialized).toContain('Keep the subject under 50 characters');
    expect(serialized).toContain('Explain why in the body');
    expect(serialized).toContain('End the subject with a period');
    expect(serialized).toContain('Mix unrelated changes');
    expect(serialized).toContain('Write fixed stuff');
    expect(serialized).toContain('"children":"Do"');
    expect(serialized).toContain('"children":"Don\'t"');
  });

  it('skips blank and whitespace-only items without leaving gaps', () => {
    const rendered = template.render({
      ...template.defaults,
      do1: '   ',
      do2: 'Keep the subject under 50 characters',
      do3: '\t\n ',
      dont1: '   ',
      dont2: 'Mix unrelated changes',
      dont3: '',
    });
    const serialized = JSON.stringify(rendered);

    expect(serialized).not.toContain('Use the imperative mood');
    expect(serialized).toContain('Keep the subject under 50 characters');
    expect(serialized).not.toContain('Explain why in the body');
    expect(serialized).not.toContain('End the subject with a period');
    expect(serialized).toContain('Mix unrelated changes');
    expect(serialized).not.toContain('Write fixed stuff');
  });

  it('preserves item order after blank items are removed', () => {
    const serialized = JSON.stringify(
      template.render({
        ...template.defaults,
        do1: 'First Do',
        do2: '   ',
        do3: 'Third Do',
        dont1: '   ',
        dont2: 'Second Dont',
        dont3: 'Third Dont',
      }),
    );

    expect(serialized.indexOf('First Do')).toBeGreaterThan(-1);
    expect(serialized.indexOf('Third Do')).toBeGreaterThan(serialized.indexOf('First Do'));
    expect(serialized.indexOf('Second Dont')).toBeGreaterThan(-1);
    expect(serialized.indexOf('Third Dont')).toBeGreaterThan(serialized.indexOf('Second Dont'));
  });

  it("gives the Don't column the full width when the Do column is empty", () => {
    const rendered = template.render({
      ...template.defaults,
      do1: '',
      do2: '   ',
      do3: '',
      dont1: 'Item A',
      dont2: 'Item B',
    });

    expect(getColumnHeadings(rendered)).toEqual(["Don't"]);
    expect(JSON.stringify(rendered)).toContain('Item A');
    expect(JSON.stringify(rendered)).toContain('Item B');
  });

  it('gives the Do column the full width when the Don\'t column is empty', () => {
    const rendered = template.render({
      ...template.defaults,
      do1: 'Item 1',
      do2: 'Item 2',
      dont1: '',
      dont2: '   ',
      dont3: '',
    });

    expect(getColumnHeadings(rendered)).toEqual(['Do']);
    expect(JSON.stringify(rendered)).toContain('Item 1');
    expect(JSON.stringify(rendered)).toContain('Item 2');
  });

  it('hides the comparison area when both columns are empty', () => {
    const rendered = template.render({
      ...template.defaults,
      do1: '',
      do2: '   ',
      do3: '',
      dont1: '',
      dont2: '',
      dont3: '   ',
    });

    expect(getColumnHeadings(rendered)).toEqual([]);
  });

  it('shrinks and truncates long titles', () => {
    const shortTitle = getAllElements(
      template.render({ ...template.defaults, title: 'Short' }),
    ).find((element) => element.type === 'h1');
    const longTitle = getAllElements(
      template.render({ ...template.defaults, title: 'A'.repeat(120) }),
    ).find((element) => element.type === 'h1');

    expect(shortTitle?.props.style?.fontSize).toBe('52px');
    expect(longTitle?.props.style?.fontSize).toBe('36px');
    expect(String(longTitle?.props.children).endsWith('\u2026')).toBe(true);
    expect(String(longTitle?.props.children).length).toBeLessThanOrEqual(70);
  });

  it('wraps long items to at most two lines and truncates them inside the column', () => {
    const rendered = template.render({
      ...template.defaults,
      do1:
        'A very long guideline text that extends beyond the normal length and must wrap cleanly across two lines at most without overflowing ' +
        'extra '.repeat(30),
    });

    const item = getAllElements(rendered).find(
      (element) =>
        element.type === 'div' &&
        element.props.style?.fontSize === '25px' &&
        element.props.style?.maxHeight === '65px' &&
        element.props.style?.overflow === 'hidden',
    );

    expect(item).toBeDefined();
    expect(item?.props.style?.lineHeight).toBe(1.3);
    expect(item?.props.style?.overflowWrap).toBe('anywhere');
    expect(item?.props.style?.display).toBe('flex');

    const content = String(item?.props.children);
    expect(content.length).toBeLessThanOrEqual(70);
    expect(content.endsWith('\u2026')).toBe(true);
    expect(content.codePointAt(content.length - 1)).toBe(0x2026);
  });

  it('keeps green, red, and accent text readable on a light background', () => {
    const serialized = JSON.stringify(
      template.render({
        ...template.defaults,
        bgColor: '#ffffff',
        accentColor: '#38bdf8',
        textColor: '#0f172a',
        siteName: 'mysite.com',
      }),
    );

    expect(serialized).toContain('#15803d');
    expect(serialized).toContain('#b91c1c');
    expect(serialized).not.toContain('"color":"#38bdf8"');
    expect(serialized).toContain('mysite.com');
  });

  it('keeps the site name at the bottom when columns are shown or hidden', () => {
    const withColumns = template.render({ ...template.defaults, siteName: 'example.com' });
    const withColumnsChildren = getChildren(withColumns);

    expect(getChildren(withColumns).length).toBeGreaterThan(0);
    expect(withColumns.props.style?.justifyContent).toBe('space-between');
    expect(JSON.stringify(withColumnsChildren[0])).not.toContain('example.com');
    expect(JSON.stringify(withColumnsChildren.at(-1))).toContain('example.com');

    const withoutColumns = template.render({
      ...template.defaults,
      do1: '',
      do2: '',
      do3: '',
      dont1: '',
      dont2: '',
      dont3: '',
      siteName: 'example.com',
    });
    const withoutColumnsChildren = getChildren(withoutColumns);

    expect(withoutColumnsChildren).toHaveLength(2);
    expect(JSON.stringify(withoutColumnsChildren[0])).not.toContain('example.com');
    expect(JSON.stringify(withoutColumnsChildren.at(-1))).toContain('example.com');
  });

  it('renders a valid Satori SVG from the default state', async () => {
    await expect(
      satori(template.render(template.defaults) as any, { width: 1200, height: 630, fonts }),
    ).resolves.toMatch(/^<svg/);
  });
});
