import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import satori from 'satori';
import { describe, expect, it } from 'vitest';
import { getTemplate, getTemplatesByCategory } from '@/templates/registry';
import type { SatoriElement } from '@/templates/types';

const template = getTemplate('tutorial-before-after');
if (!template) throw new Error('Template not found: tutorial-before-after');

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
  {
    name: 'JetBrains Mono',
    data: readFileSync(join(process.cwd(), 'public/fonts/JetBrainsMono-Regular.woff')),
    weight: 400 as const,
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

function getCodeLines(element: SatoriElement): string[] {
  return getAllElements(element)
    .filter(
      (child) =>
        child.type === 'span' &&
        child.props.style?.whiteSpace === 'pre' &&
        child.props.style?.lineHeight === '28px',
    )
    .map((line) => String(line.props.children));
}

describe('tutorial-before-after', () => {
  it('is registered as a Tutorial template', () => {
    expect(template.category).toBe('tutorial');
    expect(getTemplatesByCategory('tutorial')).toContain(template);
  });

  it('keeps the default before snippet within six lines and includes its closing brace', () => {
    const beforeLines = String(template.defaults.beforeCode).split('\n');

    expect(beforeLines.length).toBeLessThanOrEqual(6);
    expect(beforeLines.at(-1)).toBe('}');
    expect(getCodeLines(template.render(template.defaults)).slice(0, beforeLines.length)).toEqual(beforeLines);
  });

  it('renders a Satori image when optional text fields are empty or omitted', async () => {
    const element = template.render({
      ...template.defaults,
      beforeCode: '',
      afterCode: '',
      language: '',
      beforeLabel: '',
      afterLabel: '',
    });

    await expect(satori(element as any, { width: 1200, height: 630, fonts })).resolves.toMatch(/^<svg/);
    expect(getCodeLines(element)).toEqual(Array(12).fill(' '));
  });

  it('renders when optional fields are omitted', async () => {
    const element = template.render({ title: 'Small refactor' });

    await expect(satori(element as any, { width: 1200, height: 630, fonts })).resolves.toMatch(/^<svg/);
    expect(getCodeLines(element)).toHaveLength(12);
  });

  it('limits each panel to six truncated code rows while preserving indentation', () => {
    const element = template.render({
      ...template.defaults,
      beforeCode: `  ${'a'.repeat(100)}\n  second\n  third\n  fourth\n  fifth\n  sixth\n  ignored`,
      afterCode: '  one\n  two',
    });
    const codeLines = getCodeLines(element);

    expect(codeLines).toHaveLength(12);
    expect(codeLines[0]).toMatch(/^  a+…$/);
    expect(codeLines[0].length).toBeLessThanOrEqual(48);
    expect(codeLines.slice(6)).toEqual(['  one', '  two', ' ', ' ', ' ', ' ']);
  });

  it('gives both comparison panels the same fixed height', () => {
    const element = template.render({
      ...template.defaults,
      beforeCode: 'one\ntwo\nthree',
      afterCode: 'one',
    });
    const panels = getAllElements(element).filter(
      (child) => child.type === 'div' && child.props.style?.height === '356px',
    );

    expect(panels).toHaveLength(2);
    expect(panels[0].props.style.height).toBe(panels[1].props.style.height);
  });

  it('uses flex display on every div for Satori compatibility', () => {
    const element = template.render(template.defaults);

    expect(
      getAllElements(element)
        .filter((child) => child.type === 'div')
        .every((child) => child.props.style?.display === 'flex'),
    ).toBe(true);
  });
});
