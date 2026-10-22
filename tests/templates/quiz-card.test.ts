import { describe, expect, it } from 'vitest';
import tutorialQuizCard from '@/templates/tutorial/quiz-card';
import { tutorialQuizCard as tutorialQuizCardExport } from '@/templates/tutorial';
import { getTemplate, getTemplatesByCategory } from '@/templates/registry';
import { CustomizePanel } from '@/components/editor/CustomizePanel';
import { AIProvider } from '@/components/editor/AIContext';
import { parseEditorQueryParams } from '@/components/editor/EditorApp';
import { renderToString } from 'react-dom/server';
import React from 'react';

function walk(node: any, visit: (node: any) => void): void {
  if (!node || typeof node !== 'object') return;
  visit(node);
  const children = node.props?.children;
  if (Array.isArray(children)) children.forEach((child) => walk(child, visit));
  else walk(children, visit);
}

function textContent(element: any): string[] {
  const values: string[] = [];
  walk(element, (node) => {
    if (typeof node.props?.children === 'string') values.push(node.props.children);
  });
  return values;
}

function optionCards(element: any): any[] {
  const rootChildren = element.props.children;
  return rootChildren[2].props.children;
}

describe('tutorial-quiz-card', () => {
  it.each([
    ['missing', undefined, false],
    ['boolean false', false, false],
    ['string false', 'false', false],
    ['string zero', '0', false],
    ['other strings', 'yes', false],
    ['boolean true', true, true],
    ['string true', 'true', true],
    ['string one', '1', true],
  ])('reveals answer only for accepted showAnswer value: %s', (_label, showAnswer, revealed) => {
    const params = { ...tutorialQuizCard.defaults, showAnswer };
    const rendered = tutorialQuizCard.render(params);
    expect(textContent(rendered).includes('Correct')).toBe(revealed);
    expect(textContent(rendered).includes('Answer revealed')).toBe(revealed);
  });

  it.each(['A', 'B', 'C', 'D'])('highlights only selected option %s when revealed', (correctOption) => {
    const rendered = tutorialQuizCard.render({
      ...tutorialQuizCard.defaults,
      correctOption,
      showAnswer: true,
    });
    const cards = optionCards(rendered);
    expect(cards).toHaveLength(4);
    expect(cards.map((card) => card.props.style.backgroundColor === '#38bdf8')).toEqual(
      ['A', 'B', 'C', 'D'].map((letter) => letter === correctOption)
    );
    expect(cards.map((card) => textContent(card).includes('Correct'))).toEqual(
      ['A', 'B', 'C', 'D'].map((letter) => letter === correctOption)
    );
  });

  it('does not mark an option as correct while the answer is hidden', () => {
    const cards = optionCards(tutorialQuizCard.render({ ...tutorialQuizCard.defaults, showAnswer: false }));
    expect(cards.every((card) => card.props.style.backgroundColor !== '#38bdf8')).toBe(true);
    expect(cards.every((card) => !textContent(card).includes('Correct'))).toBe(true);
  });

  it('darkens accent text on light backgrounds while preserving the dark default', () => {
    const defaultRendered = tutorialQuizCard.render({ ...tutorialQuizCard.defaults, showAnswer: true });
    const defaultCards = optionCards(defaultRendered);
    const defaultLetter = defaultCards[1].props.children[0].props.children.props.style.color;
    const defaultReveal = defaultRendered.props.children[3].props.children[1].props.style.color;
    expect(defaultLetter).toBe(tutorialQuizCard.defaults.accentColor);
    expect(defaultReveal).toBe(tutorialQuizCard.defaults.accentColor);

    const lightRendered = tutorialQuizCard.render({
      ...tutorialQuizCard.defaults,
      bgColor: '#ffffff',
      textColor: '#111111',
      showAnswer: true,
    });
    const lightCards = optionCards(lightRendered);
    const lightLetter = lightCards[1].props.children[0].props.children.props.style.color;
    const lightReveal = lightRendered.props.children[3].props.children[1].props.style.color;
    expect(lightLetter).toBe('#1f6888');
    expect(lightReveal).toBe('#1f6888');

    const paleAccentRendered = tutorialQuizCard.render({
      ...tutorialQuizCard.defaults,
      bgColor: '#ffffff',
      textColor: '#111111',
      accentColor: '#fde047',
      showAnswer: true,
    });
    const paleAccentCards = optionCards(paleAccentRendered);
    expect(paleAccentCards[1].props.children[0].props.children.props.style.color).toBe('#8b7b27');
    expect(paleAccentRendered.props.children[3].props.children[1].props.style.color).toBe('#8b7b27');
  });

  it('handles editor query parameters and long questions', () => {
    const parsed = parseEditorQueryParams(
      '?template=tutorial-quiz-card&showAnswer=1',
      getTemplate('tutorial-course-card')!
    );
    expect(parsed.template).toBe(tutorialQuizCard);
    expect(parsed.params.showAnswer).toBe(true);
    const rendered = tutorialQuizCard.render({ ...tutorialQuizCard.defaults, ...parsed.params, title: 'A'.repeat(160) });
    expect(textContent(rendered)).toContain(`${'A'.repeat(109)}…`);
    expect(rendered.props.style).toMatchObject({ width: '1200px', height: '630px' });
    walk(rendered, (node) => {
      if (node.type === 'div') expect(node.props.style.display).toBe('flex');
    });
    expect(textContent(rendered)).toContain('Correct');
  });

  it('uses shared fields, exports and registers exactly once in Tutorial', () => {
    const registered = getTemplate('tutorial-quiz-card');
    expect(tutorialQuizCardExport).toBe(tutorialQuizCard);
    expect(registered).toBe(tutorialQuizCard);
    expect(getTemplatesByCategory('tutorial').filter((template) => template.id === 'tutorial-quiz-card')).toHaveLength(1);
    expect(tutorialQuizCard.defaults.showAnswer).toBe(false);
    for (const field of ['title', 'category', 'bgColor', 'accentColor', 'textColor']) {
      expect(tutorialQuizCard.fields.some((item) => item.key === field)).toBe(true);
    }
    expect(tutorialQuizCard.fields.find((field) => field.key === 'correctOption')?.options).toEqual([
      { label: 'A', value: 'A' },
      { label: 'B', value: 'B' },
      { label: 'C', value: 'C' },
      { label: 'D', value: 'D' },
    ]);
    expect(tutorialQuizCard.fields.find((field) => field.key === 'correctOption')?.defaultValue)
      .toBe(tutorialQuizCard.defaults.correctOption);
    expect(tutorialQuizCard.fields.find((field) => field.key === 'showAnswer')?.type).toBe('toggle');
  });

  it('renders the Show Answer toggle off in the existing customize panel', () => {
    const html = renderToString(React.createElement(AIProvider, null,
      React.createElement(CustomizePanel, {
        fields: tutorialQuizCard.fields,
        params: tutorialQuizCard.defaults,
        onParamChange: () => {},
        onReset: () => {},
        category: 'tutorial',
      })
    ));
    expect(html).toContain('Show Answer');
    expect(html).toContain('role="switch"');
    expect(html).toContain('aria-checked="false"');
  });
});
