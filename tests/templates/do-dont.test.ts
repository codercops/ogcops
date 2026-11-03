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

describe('tutorial-do-dont', () => {
  it('1. The template is registered under ID tutorial-do-dont and category tutorial', () => {
    expect(template.id).toBe('tutorial-do-dont');
    expect(template.name).toBe("Do's and Don'ts");
    expect(template.category).toBe('tutorial');
    expect(template).toBe(tutorialDoDont);
    expect(getTemplatesByCategory('tutorial')).toContain(template);
  });

  it('2. Default title and all six default items render', () => {
    const rendered = template.render(template.defaults);
    const serialized = JSON.stringify(rendered);

    expect(serialized).toContain('Git Commit Messages');
    expect(serialized).toContain('Use the imperative mood');
    expect(serialized).toContain('Keep the subject under 50 characters');
    expect(serialized).toContain('Explain why in the body');
    expect(serialized).toContain('End the subject with a period');
    expect(serialized).toContain('Mix unrelated changes');
    expect(serialized).toContain('Write fixed stuff');
    expect(serialized).toContain('Do');
    expect(serialized).toContain("Don't");
  });

  it('3. Whitespace-only items are omitted', () => {
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

  it('4. Remaining items preserve their order after empty items are removed', () => {
    const rendered = template.render({
      ...template.defaults,
      do1: 'First Do',
      do2: '   ',
      do3: 'Third Do',
      dont1: '   ',
      dont2: 'Second Dont',
      dont3: 'Third Dont',
    });
    const serialized = JSON.stringify(rendered);

    const firstDoIdx = serialized.indexOf('First Do');
    const thirdDoIdx = serialized.indexOf('Third Do');
    expect(firstDoIdx).toBeGreaterThan(-1);
    expect(thirdDoIdx).toBeGreaterThan(firstDoIdx);

    const secondDontIdx = serialized.indexOf('Second Dont');
    const thirdDontIdx = serialized.indexOf('Third Dont');
    expect(secondDontIdx).toBeGreaterThan(-1);
    expect(thirdDontIdx).toBeGreaterThan(secondDontIdx);
  });

  it("5. An empty Do column allows Don't to use the full comparison width", () => {
    const rendered = template.render({
      ...template.defaults,
      do1: '',
      do2: '   ',
      do3: '',
      dont1: 'Item A',
      dont2: 'Item B',
    });
    const serialized = JSON.stringify(rendered);

    expect(serialized).toContain("Don't");
    expect(serialized).not.toContain('"children":"Do"');
    expect(serialized).toContain('Item A');
    expect(serialized).toContain('Item B');

    // Find the comparison columns container: it should have only 1 child column
    const all = getAllElements(rendered);
    const colHeadings = all.filter(
      (el) => el.type === 'span' && (el.props.children === 'Do' || el.props.children === "Don't")
    );
    expect(colHeadings).toHaveLength(1);
    expect(colHeadings[0].props.children).toBe("Don't");
  });

  it("6. An empty Don't column allows Do to use the full comparison width", () => {
    const rendered = template.render({
      ...template.defaults,
      do1: 'Item 1',
      do2: 'Item 2',
      dont1: '',
      dont2: '   ',
      dont3: '',
    });
    const serialized = JSON.stringify(rendered);

    expect(serialized).toContain('Do');
    expect(serialized).not.toContain('"children":"Don\'t"');
    expect(serialized).toContain('Item 1');
    expect(serialized).toContain('Item 2');

    const all = getAllElements(rendered);
    const colHeadings = all.filter(
      (el) => el.type === 'span' && (el.props.children === 'Do' || el.props.children === "Don't")
    );
    expect(colHeadings).toHaveLength(1);
    expect(colHeadings[0].props.children).toBe('Do');
  });

  it('7. Both empty columns hide the comparison area', () => {
    const rendered = template.render({
      ...template.defaults,
      do1: '',
      do2: '   ',
      do3: '',
      dont1: '',
      dont2: '',
      dont3: '   ',
    });
    const serialized = JSON.stringify(rendered);

    expect(serialized).not.toContain('"children":"Do"');
    expect(serialized).not.toContain('"children":"Don\'t"');

    const all = getAllElements(rendered);
    const colHeadings = all.filter(
      (el) => el.type === 'span' && (el.props.children === 'Do' || el.props.children === "Don't")
    );
    expect(colHeadings).toHaveLength(0);
  });

  it('8. Long titles use the title sizing/truncation behavior', () => {
    const shortTitleRendered = template.render({
      ...template.defaults,
      title: 'Short',
    });
    const longTitleRendered = template.render({
      ...template.defaults,
      title: 'A'.repeat(120),
    });

    const shortElements = getAllElements(shortTitleRendered);
    const longElements = getAllElements(longTitleRendered);

    const shortH1 = shortElements.find((el) => el.type === 'h1');
    const longH1 = longElements.find((el) => el.type === 'h1');

    expect(shortH1?.props.style?.fontSize).toBe('52px');
    expect(longH1?.props.style?.fontSize).toBe('36px');
    expect(longH1?.props.children).toContain('…');
    expect(String(longH1?.props.children).length).toBeLessThanOrEqual(70);
  });

  it('9. Long item text is truncated with ellipsis, wrapped, and constrained without overflowing', async () => {
    const longText = 'A very long guideline text that extends beyond the normal length and must wrap cleanly across two lines at most without overflowing ' + 'extra '.repeat(30);
    const rendered = template.render({
      ...template.defaults,
      do1: longText,
    });

    const all = getAllElements(rendered);
    const itemContainer = all.find(
      (el) =>
        el.type === 'div' &&
        el.props.style?.maxHeight === '52px' &&
        el.props.style?.overflow === 'hidden'
    );

    expect(itemContainer).toBeDefined();
    expect(itemContainer?.props.style?.lineHeight).toBe(1.35);
    expect(itemContainer?.props.style?.overflowWrap).toBe('anywhere');

    // Verify 85-character truncation and proper Unicode ellipsis (\u2026) rather than mojibake (e.g. â€¦)
    const truncatedContent = String(itemContainer?.props.children);
    expect(truncatedContent.length).toBeLessThanOrEqual(85);
    expect(truncatedContent.endsWith('\u2026')).toBe(true);
    expect(truncatedContent).not.toContain('\u00e2\u20ac\u00a6'); // 'â€¦'
    expect(truncatedContent.codePointAt(truncatedContent.length - 1)).toBe(0x2026);

    // Verify successful Satori SVG rendering
    const svg = await satori(rendered as any, { width: 1200, height: 630, fonts });
    expect(svg).toMatch(/^<svg/);
  });

  it('10. Green and red headings and accent text are readable on a light background', () => {
    const lightRendered = template.render({
      ...template.defaults,
      bgColor: '#ffffff',
      accentColor: '#38bdf8',
      textColor: '#0f172a',
      siteName: 'mysite.com',
    });
    const serialized = JSON.stringify(lightRendered);

    // Readable dark green and dark red on white background
    expect(serialized).toContain('#15803d');
    expect(serialized).toContain('#b91c1c');

    // Accent text adapted for readability via mixColors on light backgrounds
    expect(serialized).not.toContain('"color":"#38bdf8"');
    expect(serialized).toContain('mysite.com');
  });

  it('11. The template renders valid Satori SVG using the project existing font setup', async () => {
    const rendered = template.render(template.defaults);
    await expect(satori(rendered as any, { width: 1200, height: 630, fonts })).resolves.toMatch(/^<svg/);

    const lightRendered = template.render({
      ...template.defaults,
      bgColor: '#f8fafc',
      siteName: 'example.com',
    });
    await expect(satori(lightRendered as any, { width: 1200, height: 630, fonts })).resolves.toMatch(/^<svg/);

    const singleColRendered = template.render({
      ...template.defaults,
      do1: '',
      do2: '',
      do3: '',
      siteName: '',
    });
    await expect(satori(singleColRendered as any, { width: 1200, height: 630, fonts })).resolves.toMatch(/^<svg/);

    const emptyRendered = template.render({
      ...template.defaults,
      do1: '',
      do2: '',
      do3: '',
      dont1: '',
      dont2: '',
      dont3: '',
      siteName: '',
    });
    await expect(satori(emptyRendered as any, { width: 1200, height: 630, fonts })).resolves.toMatch(/^<svg/);
  });
});
