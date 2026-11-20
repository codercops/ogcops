import { describe, expect, it } from 'vitest';
import newsletterMailbag from '@/templates/newsletter/mailbag';
import { newsletterMailbag as newsletterMailbagExport } from '@/templates/newsletter';
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
  newsletterMailbag.render({ ...newsletterMailbag.defaults, ...overrides });

describe('newsletter-mailbag', () => {
  it('is re-exported and registered exactly once in the newsletter category', () => {
    expect(newsletterMailbagExport).toBe(newsletterMailbag);
    expect(getTemplate('newsletter-mailbag')).toBe(newsletterMailbag);
    expect(
      getTemplatesByCategory('newsletter').filter((t) => t.id === 'newsletter-mailbag'),
    ).toHaveLength(1);
  });

  it('renders the defaults with site name, issue, Mailbag pill, title, and three question rows with askers', () => {
    const rendered = tree();
    const texts = textContent(rendered);

    expect(texts).toContain('The Friday Diff');
    expect(texts).toContain('Issue 58');
    expect(texts).toContain('Mailbag');
    expect(texts).toContain('Your questions about going freelance');
    expect(texts).toContain('How did you find your first client?');
    expect(texts).toContain('Sam, Lisbon');
    expect(texts).toContain('What do you charge for a small project?');
    expect(texts).toContain('Priya');
    expect(texts).toContain('Do you still take full-time offers?');
    expect(texts).toContain('A reader in Toronto');

    // Check for 3 'Q' circles
    const qCircles = allElements(rendered).filter(
      (el) => el.type === 'div' && el.props.children === 'Q',
    );
    expect(qCircles).toHaveLength(3);
  });

  it('drops a question row completely when its question is blank, closing up remaining rows', () => {
    const rendered = tree({
      question2: '   ',
      asker2: 'Should Be Dropped',
    });
    const texts = textContent(rendered);

    expect(texts).toContain('How did you find your first client?');
    expect(texts).toContain('Sam, Lisbon');
    expect(texts).not.toContain('What do you charge for a small project?');
    expect(texts).not.toContain('Should Be Dropped');
    expect(texts).toContain('Do you still take full-time offers?');
    expect(texts).toContain('A reader in Toronto');

    // Only 2 Q circles remain
    const qCircles = allElements(rendered).filter(
      (el) => el.type === 'div' && el.props.children === 'Q',
    );
    expect(qCircles).toHaveLength(2);
  });

  it('drops the question list completely when all three questions are blank', () => {
    const rendered = tree({
      question1: '',
      question2: '',
      question3: '',
      asker1: 'Asker 1',
      asker2: 'Asker 2',
      asker3: 'Asker 3',
    });
    const texts = textContent(rendered);

    expect(texts).toContain('The Friday Diff');
    expect(texts).toContain('Issue 58');
    expect(texts).toContain('Mailbag');
    expect(texts).toContain('Your questions about going freelance');
    expect(texts).not.toContain('Asker 1');
    expect(texts).not.toContain('Asker 2');
    expect(texts).not.toContain('Asker 3');

    // 0 Q circles remain
    const qCircles = allElements(rendered).filter(
      (el) => el.type === 'div' && el.props.children === 'Q',
    );
    expect(qCircles).toHaveLength(0);
  });

  it('lets the question use the full row width when its asker is blank', () => {
    const rendered = tree({
      asker1: '',
    });
    const texts = textContent(rendered);
    expect(texts).not.toContain('Sam, Lisbon');

    // Find the row for question 1
    const rows = allElements(rendered).filter(
      (el) => el.type === 'div' && el.props.style?.borderRadius === '14px',
    );
    expect(rows).toHaveLength(3);

    // First row should have 2 children: [Q circle, questionSpan], no askerSpan
    const row1Children = rows[0].props.children as SatoriElement[];
    expect(row1Children).toHaveLength(2);
    expect(row1Children[1].props.style?.flex).toBe(1);
  });

  it('shrinks a long title with autoFontSize() and caps at two lines', () => {
    const longTitle = 'An Exceptionally Long Newsletter Mailbag Edition Title About Launching Your Solo Consulting Practice';
    const shortTitle = 'Mailbag';

    const longRendered = tree({ title: longTitle });
    const shortRendered = tree({ title: shortTitle });

    const longH1 = allElements(longRendered).find((el) => el.type === 'h1');
    const shortH1 = allElements(shortRendered).find((el) => el.type === 'h1');

    const longSize = parseInt(String(longH1?.props.style?.fontSize ?? '0'), 10);
    const shortSize = parseInt(String(shortH1?.props.style?.fontSize ?? '0'), 10);

    expect(shortSize).toBeGreaterThan(longSize);
    expect(longH1?.props.style?.overflow).toBe('hidden');
    expect(longH1?.props.style?.lineClamp).toBe(2);
    expect(longH1?.props.style?.display).toBe('block');
    expect(longH1?.props.style?.whiteSpace).toBeUndefined();
  });

  it('truncates a long question on one line with an ellipsis before reaching the asker', () => {
    const longQuestion = 'How exactly did you manage to get your first paying client when you had zero previous portfolio items or testimonials? '.repeat(2);
    const rendered = tree({ question1: longQuestion });

    const qSpan = allElements(rendered).find(
      (el) => el.type === 'span' && textContent(el).some((t) => t.startsWith('How exactly did you manage')),
    );
    expect(qSpan).toBeDefined();
    expect(qSpan?.props.style?.whiteSpace).toBe('nowrap');
    expect(qSpan?.props.style?.overflow).toBe('hidden');
    expect(qSpan?.props.style?.textOverflow).toBe('ellipsis');
    expect(qSpan?.props.style?.flex).toBe(1);
    expect(textContent(qSpan)[0].length).toBeLessThanOrEqual(120);
    expect(textContent(qSpan)[0]).toMatch(/…$/);
  });

  it('truncates a long asker on one line while keeping most of the row for the question', () => {
    const longAsker = 'Alexander Montgomery-Fitzgerald the Third, VP of Engineering';
    const rendered = tree({ asker1: longAsker });

    const askerSpan = allElements(rendered).find(
      (el) => el.type === 'span' && textContent(el).some((t) => t.startsWith('Alexander')),
    );
    expect(askerSpan).toBeDefined();
    expect(askerSpan?.props.style?.maxWidth).toBe('320px');
    expect(askerSpan?.props.style?.overflow).toBe('hidden');
    expect(askerSpan?.props.style?.textOverflow).toBe('ellipsis');
    expect(askerSpan?.props.style?.whiteSpace).toBe('nowrap');
    expect(textContent(askerSpan)[0]).toHaveLength(40);
    expect(textContent(askerSpan)[0]).toMatch(/…$/);
  });

  it('omits siteName or issue cleanly without leaving an awkward gap', () => {
    const noSite = tree({ siteName: '' });
    const noIssue = tree({ issue: '' });
    const noHeader = tree({ siteName: '', issue: '' });

    expect(textContent(noSite)).not.toContain('The Friday Diff');
    expect(textContent(noSite)).toContain('Issue 58');

    expect(textContent(noIssue)).toContain('The Friday Diff');
    expect(textContent(noIssue)).not.toContain('Issue 58');

    expect(textContent(noHeader)).not.toContain('The Friday Diff');
    expect(textContent(noHeader)).not.toContain('Issue 58');
  });

  it('renders cleanly on a light background with readable pill, Q circles, and askers', () => {
    const rendered = tree({
      bgColor: '#ffffff',
      textColor: '#111827',
      accentColor: '#e07a5f',
    });

    // Pill color
    const pillSpan = allElements(rendered).find(
      (el) => el.type === 'span' && el.props.children === 'Mailbag',
    );
    expect(pillSpan).toBeDefined();
    const pillColor = String(pillSpan?.props.style?.color ?? '').toLowerCase();
    expect(pillColor).not.toBe('#ffffff');
    expect(pillColor).not.toBe('#fff');

    // Q circle border & text color
    const qCircle = allElements(rendered).find(
      (el) => el.type === 'div' && el.props.children === 'Q',
    );
    expect(qCircle).toBeDefined();
    const qColor = String(qCircle?.props.style?.color ?? '').toLowerCase();
    expect(qColor).not.toBe('#ffffff');
    expect(qColor).not.toBe('#fff');

    // Asker color
    const askerSpan = allElements(rendered).find(
      (el) => el.type === 'span' && textContent(el).includes('Sam, Lisbon'),
    );
    expect(askerSpan).toBeDefined();
    const askerColor = String(askerSpan?.props.style?.color ?? '').toLowerCase();
    expect(askerColor).not.toBe('#ffffff');
    expect(askerColor).not.toBe('#fff');
  });
});
