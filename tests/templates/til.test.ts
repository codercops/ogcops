import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import satori from 'satori';
import { describe, expect, it } from 'vitest';
import til from '@/templates/tutorial/til';
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
  til.render({ ...til.defaults, ...overrides });
const serialized = (overrides: Record<string, unknown> = {}) => JSON.stringify(render(overrides));

describe('tutorial-til', () => {
  it('is registered in tutorial category and re-exported', async () => {
    expect(getTemplate('tutorial-til')?.category).toBe('tutorial');
    expect(getTemplatesByCategory('tutorial')).toContain(til);
    const exports = await import('@/templates/tutorial');
    expect(exports.tutorialTil.id).toBe('tutorial-til');
  });

  it('renders default label, tag pill, title, code command, date, and site name', () => {
    const rendered = texts(render());
    expect(rendered).toContain('Today I learned');
    expect(rendered).toContain('git');
    expect(rendered).toContain('git switch - takes you back to the branch you were just on');
    expect(rendered).toContain('git switch -');
    expect(rendered).toContain('Oct 27, 2026');
    expect(rendered).toContain('codercops.com');
  });

  it('hides empty code, tag, date, and site name cleanly when empty or only spaces', () => {
    const tree = serialized({
      title: 'A useful shortcut for switching branches',
      code: '   ',
      tag: '   ',
      date: '',
      siteName: '   ',
    });
    expect(tree).not.toContain('git switch -');
    expect(tree).not.toContain('Oct 27, 2026');
    expect(tree).not.toContain('codercops.com');
    const all = getAllElements(render({ code: '  ', tag: '  ', date: '', siteName: '' }));
    expect(all.some((el) => el.type === 'span' && el.props.children === 'git')).toBe(false);
  });

  it('shrinks long title with autoFontSize and truncates cleanly', () => {
    const longTitle =
      'In Python 3.10 and newer you can use pattern matching with match-case statements to cleanly destructure complex nested dictionaries and tuples in one go';
    const element = render({ title: longTitle });
    const all = getAllElements(element);
    const titleEl = all.find((el) => el.type === 'h1');
    expect(titleEl).toBeDefined();
    expect(titleEl?.props.style?.fontSize).toBe('30px');
    const content = String(titleEl?.props.children);
    expect(content).toContain('…');
    expect(content.length).toBeLessThanOrEqual(130);
  });

  it('truncates long commands inside its box without running off', () => {
    const longCode =
      'git log --graph --pretty=format:"%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset" --abbrev-commit';
    const element = render({ code: longCode });
    const all = getAllElements(element);
    const codeBox = all.find(
      (el) =>
        el.type === 'div' &&
        el.props.style?.fontFamily === undefined &&
        el.props.style?.borderRadius === '12px' &&
        el.props.style?.maxWidth === '1050px',
    );
    expect(codeBox).toBeDefined();

    const codeSpan = all.find(
      (el) =>
        el.type === 'span' &&
        el.props.style?.fontFamily === 'JetBrains Mono, monospace' &&
        el.props.style?.fontSize === '22px',
    );
    expect(codeSpan).toBeDefined();
    const content = String(codeSpan?.props.children);
    expect(content).toContain('…');
    expect(content.length).toBeLessThanOrEqual(75);
  });

  it('stays readable on a light background with appropriate text and accent colors', () => {
    const lightTree = render({
      bgColor: '#ffffff',
      textColor: '#111827',
      accentColor: '#38bdf8',
    });
    const all = getAllElements(lightTree);

    const labelSpan = all.find(
      (el) => el.type === 'span' && el.props.children === 'Today I learned',
    );
    expect(labelSpan?.props.style?.color).toBe('#1f6888');

    const codeSpan = all.find(
      (el) =>
        el.type === 'span' &&
        el.props.style?.fontFamily === 'JetBrains Mono, monospace' &&
        el.props.style?.fontSize === '22px',
    );
    expect(codeSpan?.props.style?.color).toBe('#1f6888');
  });

  it('uses flex display on every div for Satori compatibility', () => {
    const element = render(til.defaults);
    const divs = getAllElements(element).filter((child) => child.type === 'div');
    expect(divs.every((child) => child.props.style?.display === 'flex')).toBe(true);
  });

  it('renders a valid SVG image via Satori', async () => {
    const element = render(til.defaults);
    await expect(satori(element as any, { width: 1200, height: 630, fonts })).resolves.toMatch(/^<svg/);
  });
});
