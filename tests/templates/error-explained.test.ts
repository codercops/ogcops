import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import satori from 'satori';
import { describe, expect, it } from 'vitest';
import errorExplained from '@/templates/tutorial/error-explained';
import { getTemplate, getTemplatesByCategory } from '@/templates/registry';
import type { SatoriElement } from '@/templates/types';

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

function texts(node: unknown): string[] {
  if (typeof node === 'string') return [node];
  if (Array.isArray(node)) return node.flatMap(texts);
  if (node && typeof node === 'object' && 'props' in node) {
    return texts((node as SatoriElement).props.children);
  }
  return [];
}

const render = (overrides: Record<string, unknown> = {}) =>
  errorExplained.render({ ...errorExplained.defaults, ...overrides });
const serialized = (overrides: Record<string, unknown> = {}) => JSON.stringify(render(overrides));

describe('tutorial-error-explained', () => {
  it('is registered in tutorial category and re-exported', async () => {
    expect(getTemplate('tutorial-error-explained')?.category).toBe('tutorial');
    expect(getTemplatesByCategory('tutorial')).toContain(errorExplained);
    const exports = await import('@/templates/tutorial');
    expect(exports.tutorialErrorExplained.id).toBe('tutorial-error-explained');
  });

  it('renders default error message, language pill, meaning, and fix', () => {
    const rendered = texts(render());
    expect(rendered).toContain('Error explained');
    expect(rendered).toContain('JavaScript');
    expect(rendered).toContain("TypeError: Cannot read properties of undefined (reading 'map')");
    expect(rendered).toContain('Meaning');
    expect(rendered).toContain("You called .map() on something that isn't an array yet");
    expect(rendered).toContain('Fix');
    expect(rendered).toContain('Start the state as [] or check before mapping');
  });

  it('renders site name when provided', () => {
    const tree = serialized({ siteName: 'codercops.com' });
    expect(tree).toContain('codercops.com');
  });

  it('hides empty language, meaning, fix, and site name cleanly when empty or only spaces', () => {
    const tree = serialized({
      language: '   ',
      meaning: '   ',
      fix: '',
      siteName: '   ',
    });
    expect(tree).not.toContain('JavaScript');
    expect(tree).not.toContain('Meaning');
    expect(tree).not.toContain('Fix');
    expect(tree).not.toContain('codercops.com');
  });

  it('shrinks long error messages with autoFontSize and truncates inside the box', () => {
    const longError =
      'Uncaught TypeError: Failed to execute fetch on Window: Failed to parse URL from /api/v1/users/undefined/preferences/notifications?enabled=true';
    const element = render({ title: longError });
    const all = getAllElements(element);
    const errorSpan = all.find(
      (el) => el.type === 'span' && el.props.style?.wordBreak === 'break-word',
    );

    expect(errorSpan).toBeDefined();
    expect(errorSpan?.props.style?.fontSize).toBe('21px');
    const content = String(errorSpan?.props.children);
    expect(content).toContain('…');
    expect(content.length).toBeLessThanOrEqual(120);
  });

  it('stays readable on a light background with appropriate text and box colors', () => {
    const lightTree = render({
      bgColor: '#ffffff',
      textColor: '#111827',
      accentColor: '#38bdf8',
    });
    const all = getAllElements(lightTree);

    const errorSpan = all.find(
      (el) => el.type === 'span' && el.props.style?.wordBreak === 'break-word',
    );
    expect(errorSpan?.props.style?.color).toBe('#991b1b');

    const labelSpan = all.find(
      (el) => el.type === 'span' && el.props.children === 'Error explained',
    );
    expect(labelSpan?.props.style?.color).toBe('#1f6888');
  });

  it('uses flex display on every div for Satori compatibility', () => {
    const element = render(errorExplained.defaults);
    const divs = getAllElements(element).filter((child) => child.type === 'div');
    expect(divs.every((child) => child.props.style?.display === 'flex')).toBe(true);
  });

  it('aligns explanation labels with the first line using flex-start', () => {
    const element = render({
      meaning:
        'You called .map() on a value that is still undefined, usually because the data has not loaded yet',
    });
    const all = getAllElements(element);
    const meaningLabel = all.find(
      (el) => el.type === 'span' && el.props.children === 'Meaning',
    );
    expect(meaningLabel?.props.style?.marginTop).toBe('4px');

    const rows = all.filter(
      (el) =>
        el.type === 'div' &&
        el.props.style?.gap === '20px' &&
        el.props.style?.alignItems === 'flex-start',
    );
    expect(rows.length).toBe(2);
  });

  it('renders a valid SVG image via Satori', async () => {
    const element = render(errorExplained.defaults);
    await expect(satori(element as any, { width: 1200, height: 630, fonts })).resolves.toMatch(/^<svg/);
  });
});
