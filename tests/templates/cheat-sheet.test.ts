import { describe, expect, it } from 'vitest';
import tutorialCheatSheet from '@/templates/tutorial/cheat-sheet';
import { tutorialCheatSheet as tutorialCheatSheetExport } from '@/templates/tutorial';
import { getTemplate, getTemplatesByCategory } from '@/templates/registry';
import type { SatoriElement } from '@/templates/types';

function texts(node: unknown): string[] {
  if (typeof node === 'string') return [node];
  if (Array.isArray(node)) return node.flatMap(texts);
  if (node && typeof node === 'object' && 'props' in node) {
    return texts((node as SatoriElement).props.children);
  }
  return [];
}

function walk(node: unknown, visit: (node: SatoriElement) => void): void {
  if (!node || typeof node !== 'object') return;
  const element = node as SatoriElement;
  if (!('props' in element)) return;
  visit(element);
  const children = element.props.children;
  if (Array.isArray(children)) children.forEach((child) => walk(child, visit));
  else walk(children, visit);
}

const render = (overrides: Record<string, unknown> = {}) =>
  tutorialCheatSheet.render({ ...tutorialCheatSheet.defaults, ...overrides });

const output = (overrides: Record<string, unknown> = {}) => texts(render(overrides));

describe('tutorial-cheat-sheet', () => {
  it('is registered and exported from the Tutorial section', () => {
    const registered = getTemplate('tutorial-cheat-sheet');
    expect(registered).toBe(tutorialCheatSheet);
    expect(tutorialCheatSheetExport).toBe(tutorialCheatSheet);
    expect(registered?.category).toBe('tutorial');
    expect(getTemplatesByCategory('tutorial').filter((template) => template.id === 'tutorial-cheat-sheet'))
      .toHaveLength(1);
  });

  it('uses the shared fields and 4-6 relevant tags', () => {
    for (const key of ['title', 'topic', 'items', 'siteName', 'bgColor', 'accentColor', 'textColor']) {
      expect(tutorialCheatSheet.fields.some((field) => field.key === key)).toBe(true);
    }
    expect(tutorialCheatSheet.tags.length).toBeGreaterThanOrEqual(4);
    expect(tutorialCheatSheet.tags.length).toBeLessThanOrEqual(6);
    expect(tutorialCheatSheet.description).toBeTruthy();
  });

  it('renders the five default commands with descriptions', () => {
    const values = output();
    expect(values).toEqual(expect.arrayContaining([
      'Git Commands Cheat Sheet',
      'Git',
      'git status',
      'See what changed',
      'git add -p',
      'Stage changes piece by piece',
      'git commit --amend',
      'Fix the last commit',
      'git switch -c name',
      'Create a branch and switch to it',
      'git log --oneline',
      'Short history',
    ]));
  });

  it('skips blank lines and renders only the first five nonblank rows', () => {
    const values = output({
      items: '\n\none | first\n   \ntwo | second\nthree | third\nfour | fourth\nfive | fifth\nsix | sixth\n',
    });
    expect(values).toContain('one');
    expect(values).toContain('five');
    expect(values).not.toContain('six');
    expect(values.filter((value) => value === 'first')).toHaveLength(1);
  });

  it('splits on the first separator and treats a line without one as a command', () => {
    const values = output({
      items: 'echo a | b | c\nplain command',
    });
    expect(values).toContain('echo a');
    expect(values).toContain('b | c');
    expect(values).toContain('plain command');
  });

  it('truncates long commands and descriptions', () => {
    const values = output({
      items: `${'c'.repeat(90)} | ${'d'.repeat(120)}`,
    });
    expect(values).toContain(`${'c'.repeat(33)}…`);
    expect(values).toContain(`${'d'.repeat(51)}…`);
    expect(values).not.toContain('d'.repeat(120));
  });

  it('keeps every row on one line and every div flex', () => {
    const element = render({
      items: 'git status | See what changed\nlong | description',
    });
    walk(element, (node) => {
      if (node.type === 'div') expect(node.props.style.display).toBe('flex');
    });
    expect(output({ items: 'git status | See what changed' })).not.toContain('See what\nchanged');
  });

  it('hides empty topic and site name', () => {
    const values = output({ topic: '', siteName: '' });
    expect(values).not.toContain('Git');
    expect(values).not.toContain('ogcops.com');
  });

  it('remains readable on a light background', () => {
    const values = output({ bgColor: '#ffffff', textColor: '#111111', accentColor: '#fde047' });
    expect(values).toContain('Git Commands Cheat Sheet');
    expect(values).toContain('git status');
  });
});
