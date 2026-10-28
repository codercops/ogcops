import { describe, expect, it } from 'vitest';
import { quoteInterview } from '@/templates/quote';
import interview from '@/templates/quote/interview';
import { getTemplate, getTemplatesByCategory } from '@/templates/registry';
import { mixColors } from '@/templates/utils';
import type { SatoriElement } from '@/templates/types';

function elements(node: unknown): SatoriElement[] {
  if (Array.isArray(node)) return node.flatMap(elements);
  if (!node || typeof node !== 'object' || !('type' in node)) return [];

  const element = node as SatoriElement;
  return [element, ...elements(element.props.children)];
}

function textContent(node: unknown): string[] {
  if (typeof node === 'string') return [node];
  if (Array.isArray(node)) return node.flatMap(textContent);
  if (node && typeof node === 'object' && 'props' in node) {
    return textContent((node as SatoriElement).props.children);
  }
  return [];
}

const render = (overrides: Record<string, unknown> = {}) =>
  interview.render({ ...interview.defaults, ...overrides });

describe('quote-interview', () => {
  it('is re-exported and registered once in the Quote category', () => {
    expect(quoteInterview).toBe(interview);
    expect(getTemplate('quote-interview')).toBe(interview);
    expect(getTemplatesByCategory('quote').filter(({ id }) => id === 'quote-interview')).toHaveLength(1);
  });

  it('renders the question, answer, person, role, and site name', () => {
    expect(textContent(render())).toEqual([
      'Q',
      'What would you tell yourself on day one?',
      'A',
      'Ship the small version first, then listen.',
      'Priya Raman',
      'Staff Engineer at Acme',
      'THE BUILDER NOTES',
    ]);
  });

  it('hides whitespace-only question, author, role, and site name, including the Q mark', () => {
    const tree = render({ question: '   ', author: ' ', role: '\t', siteName: '  ' });
    expect(textContent(tree)).toEqual(['A', 'Ship the small version first, then listen.']);
  });

  it('removes the answer divider when the question is blank', () => {
    const answer = elements(render({ question: ' ' })).find((element) =>
      element.type === 'div' && element.props.style?.flex === 1
    );

    expect(answer?.props.style.borderTop).toBe('none');
  });

  it('keeps normal site names intact and lets the footer columns shrink when all are long', () => {
    const longSiteName = 'THE WONDERFUL WEEKLY BUILDER NOTES MAGAZINE OK';
    const longFooter = render({
      author: 'A'.repeat(48),
      role: 'R'.repeat(64),
      siteName: longSiteName,
    });
    const domain = 'newsletter.codercops.com';
    const regularSiteNames = [
      { value: 'THE BUILDER NOTES', tree: render() },
      { value: domain, tree: render({ siteName: domain }) },
    ];
    const siteName = elements(longFooter).find((element) => textContent(element)[0] === longSiteName);
    const author = elements(longFooter).find((element) =>
      element.type === 'div' && element.props.style?.flexDirection === 'column'
      && textContent(element)[0] === 'A'.repeat(48) && textContent(element).length === 2
    );

    for (const { value, tree } of regularSiteNames) {
      expect(textContent(tree)).toContain(value);
    }
    expect(author?.props.style).toMatchObject({ flex: '1 1 auto', minWidth: 0 });
    expect(siteName?.props.style).toMatchObject({
      flexShrink: 1,
      minWidth: 0,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    });
    expect(siteName?.props.style.flex).toBeUndefined();
    const footer = elements(longFooter).find((element) =>
      element.type === 'div' && element.props.style?.justifyContent === 'space-between'
    );
    expect(footer).toBeDefined();
  });

  it('shrinks long questions and answers before truncating them', () => {
    const tree = render({
      question: 'What would you tell yourself on day one? '.repeat(5),
      answer: 'Ship the small version first, then listen. '.repeat(10),
    });
    const all = elements(tree);
    const question = all.find((element) => element.type === 'span' && textContent(element)[0]?.startsWith('What would'));
    const answer = all.find((element) => element.type === 'span' && textContent(element)[0]?.startsWith('Ship the small'));

    expect(textContent(question)[0].length).toBeLessThanOrEqual(160);
    expect(textContent(question)[0]).toMatch(/…$/);
    expect(question?.props.style.fontSize).toBe('24px');
    expect(textContent(answer)[0].length).toBeLessThanOrEqual(300);
    expect(textContent(answer)[0]).toMatch(/…$/);
    expect(answer?.props.style.fontSize).toBe('32px');
  });

  it('darkens accent text on a light background and keeps default white text readable', () => {
    const tree = render({ bgColor: '#ffffff', accentColor: '#fde047' });
    const accentInk = mixColors('#fde047', '#000000', 0.45);
    const all = elements(tree);
    const question = all.find((element) =>
      element.type === 'span' && textContent(element)[0]?.startsWith('What would')
    );
    const questionMark = all.find((element) => element.type === 'div' && textContent(element).join('') === 'Q');
    const answer = all.find((element) =>
      element.type === 'span' && textContent(element)[0]?.startsWith('Ship the small')
    );

    expect(question?.props.style.color).toBe(accentInk);
    expect(questionMark?.props.style.color).toBe(accentInk);
    expect(answer?.props.style.color).toBe('#111111');
  });

  it('uses a 1200 by 630 flex layout', () => {
    const all = elements(render());
    expect(all[0].props.style.width).toBe('1200px');
    expect(all[0].props.style.height).toBe('630px');
    expect(all.every((element) => element.type !== 'div' || element.props.style?.display === 'flex')).toBe(true);
  });
});
