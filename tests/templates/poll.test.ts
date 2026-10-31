import { describe, expect, it } from 'vitest';
import newsletterPoll from '@/templates/newsletter/poll';
import { newsletterPoll as newsletterPollExport } from '@/templates/newsletter';
import { getTemplate, getTemplatesByCategory } from '@/templates/registry';
import type { SatoriElement } from '@/templates/types';

function walk(node: unknown, visit: (element: SatoriElement) => void): void {
  if (Array.isArray(node)) {
    node.forEach((child) => walk(child, visit));
    return;
  }
  if (!node || typeof node !== 'object' || !('type' in node)) return;

  const element = node as SatoriElement;
  visit(element);
  walk(element.props.children, visit);
}

function textContent(node: unknown): string[] {
  if (typeof node === 'string') return [node];
  if (Array.isArray(node)) return node.flatMap(textContent);
  if (node && typeof node === 'object' && 'props' in node) {
    return textContent((node as SatoriElement).props.children);
  }
  return [];
}

function allElements(node: unknown): SatoriElement[] {
  const found: SatoriElement[] = [];
  walk(node, (element) => found.push(element));
  return found;
}

const tree = (overrides: Record<string, unknown> = {}) =>
  newsletterPoll.render({ ...newsletterPoll.defaults, ...overrides });

describe('newsletter-poll', () => {
  it('is re-exported and registered exactly once in the newsletter category', () => {
    expect(newsletterPollExport).toBe(newsletterPoll);
    expect(getTemplate('newsletter-poll')).toBe(newsletterPoll);
    expect(getTemplatesByCategory('newsletter').filter((template) => template.id === 'newsletter-poll'))
      .toHaveLength(1);
  });

  it('renders the newsletter name, issue, label, question, and four answers in order', () => {
    expect(textContent(tree())).toEqual([
      'The Friday Diff',
      'Issue 42',
      'Reader poll',
      'How do you read this newsletter?',
      'On my phone',
      'On my laptop',
      'Printed out',
      'I skim the subject line',
    ]);
  });

  it('skips empty and whitespace-only answers while preserving order', () => {
    expect(textContent(tree({
      option1: '  On my phone ',
      option2: '   ',
      option3: 'On my tablet',
      option4: '',
    }))).toEqual([
      'The Friday Diff',
      'Issue 42',
      'Reader poll',
      'How do you read this newsletter?',
      'On my phone',
      'On my tablet',
    ]);
  });

  it('shrinks a long question before truncating it to the supported length', () => {
    const longQuestion = 'How do you decide when to read every newsletter issue from start to finish? '.repeat(3);
    const rendered = tree({ title: longQuestion });
    const question = allElements(rendered).find((element) => element.type === 'h1');

    expect(question?.props.style.fontSize).toBe('34px');
    expect(textContent(question)[0]).toHaveLength(140);
    expect(textContent(question)[0]).toMatch(/…$/);
  });

  it('truncates long answers within a single-line pill', () => {
    const rendered = tree({
      option1: 'MOSTLY ON MY PHONE DURING THE COMMUTE',
      option2: 'ON A BIG MONITOR AT WORK EVERY MORNING',
    });
    const answers = allElements(rendered).filter((element) =>
      element.type === 'span' && textContent(element).some((text) =>
        text.startsWith('MOSTLY ON MY PHONE') || text.startsWith('ON A BIG MONITOR')
      )
    );

    expect(answers).toHaveLength(2);
    for (const answer of answers) {
      expect(textContent(answer)[0]).toHaveLength(36);
      expect(textContent(answer)[0]).toMatch(/…$/);
      expect(answer.props.style.whiteSpace).toBe('nowrap');
      expect(answer.props.style.overflow).toBe('hidden');
      expect(answer.props.style.textOverflow).toBe('ellipsis');
    }
  });

  it('hides an empty issue and newsletter name cleanly', () => {
    const rendered = tree({ issue: '   ', siteName: '  ' });
    expect(textContent(rendered)).not.toContain('Issue 42');
    expect(textContent(rendered)).not.toContain('The Friday Diff');
    expect(textContent(rendered)).toContain('Reader poll');
  });

  it('uses outline circles for the answers and darkens the accent on a light canvas', () => {
    const rendered = tree({ bgColor: '#ffffff', textColor: '#111111', accentColor: '#fde047' });
    const circles = allElements(rendered).filter((element) =>
      element.type === 'div' && element.props.style?.borderRadius === '50%'
    );

    expect(circles).toHaveLength(4);
    expect(circles.every((circle) => circle.props.style.border?.includes('#8b7b27'))).toBe(true);
    expect(allElements(rendered).every((element) =>
      element.type !== 'div' || element.props.style?.display === 'flex'
    )).toBe(true);
  });
});
