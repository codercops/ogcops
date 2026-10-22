import { describe, expect, it } from 'vitest';
import tutorialCheatSheet from '@/templates/tutorial/cheat-sheet';
import { tutorialCheatSheet as tutorialCheatSheetExport } from '@/templates/tutorial';
import { getTemplate, getTemplatesByCategory } from '@/templates/registry';
import { parseEditorQueryParams } from '@/components/editor/EditorApp';
import { CustomizePanel } from '@/components/editor/CustomizePanel';
import { AIProvider } from '@/components/editor/AIContext';
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

/** The rows container is the third child of the root element. */
function rows(element: any): any[] {
  return element.props.children[2].props.children;
}

describe('tutorial-cheat-sheet', () => {
  it('parses the default items into five rows of command and description', () => {
    const rendered = tutorialCheatSheet.render(tutorialCheatSheet.defaults);
    const cards = rows(rendered);
    expect(cards).toHaveLength(5);
    const text = textContent(rendered);
    expect(text).toContain('git status');
    expect(text).toContain('See what changed');
    expect(text).toContain('git log --oneline');
    expect(text).toContain('Short history');
  });

  it('skips blank lines, keeps only the first 5 rows, and splits on the first pipe', () => {
    const rendered = tutorialCheatSheet.render({
      ...tutorialCheatSheet.defaults,
      items: [
        'cmd one | does one',
        '',
        '   ',
        'cmd two | does two | with pipes',
        'cmd three',
        'cmd four | does four',
        'cmd five | does five',
        'cmd six | never shows',
      ].join('\n'),
    });
    const cards = rows(rendered);
    expect(cards).toHaveLength(5);
    const text = textContent(rendered);
    expect(text).toContain('cmd one');
    expect(text).toContain('does two | with pipes');
    // A line without a pipe becomes a command with no description.
    expect(text).toContain('cmd three');
    expect(text).not.toContain('cmd six');
  });

  it('truncates long commands and descriptions so every row stays on one line', () => {
    const rendered = tutorialCheatSheet.render({
      ...tutorialCheatSheet.defaults,
      items: `${'g'.repeat(40)} | ${'d'.repeat(70)}`,
    });
    const text = textContent(rendered);
    expect(text).toContain(`${'g'.repeat(31)}…`);
    expect(text).toContain(`${'d'.repeat(59)}…`);
  });

  it('hides the topic badge and site name when they are empty', () => {
    const rendered = tutorialCheatSheet.render({
      ...tutorialCheatSheet.defaults,
      topic: '',
      siteName: '',
    });
    const text = textContent(rendered);
    expect(text).not.toContain('Git');
    expect(text.join(' ')).not.toContain('yoursite');
  });

  it('darkens accent text on light backgrounds while preserving the dark default', () => {
    const defaultRendered = tutorialCheatSheet.render(tutorialCheatSheet.defaults);
    const defaultCommand = rows(defaultRendered)[0].props.children[0].props.children.props.style.color;
    expect(defaultCommand).toBe(tutorialCheatSheet.defaults.accentColor);

    const lightRendered = tutorialCheatSheet.render({
      ...tutorialCheatSheet.defaults,
      bgColor: '#ffffff',
      textColor: '#111111',
    });
    const lightCommand = rows(lightRendered)[0].props.children[0].props.children.props.style.color;
    expect(lightCommand).toBe('#7b4334');

    const paleAccentRendered = tutorialCheatSheet.render({
      ...tutorialCheatSheet.defaults,
      bgColor: '#ffffff',
      textColor: '#111111',
      accentColor: '#fde047',
    });
    const paleAccentCommand = rows(paleAccentRendered)[0].props.children[0].props.children.props.style.color;
    expect(paleAccentCommand).toBe('#8b7b27');
  });

  it('separates rows with thin lines except after the last', () => {
    const rendered = tutorialCheatSheet.render(tutorialCheatSheet.defaults);
    const cards = rows(rendered);
    expect(cards.map((card) => card.props.style.borderBottom)).toEqual([
      '1px solid #FFFFFF1F',
      '1px solid #FFFFFF1F',
      '1px solid #FFFFFF1F',
      '1px solid #FFFFFF1F',
      'none',
    ]);
  });

  it('handles editor query parameters and long titles', () => {
    const parsed = parseEditorQueryParams(
      '?template=tutorial-cheat-sheet&topic=Docker',
      getTemplate('tutorial-course-card')!
    );
    expect(parsed.template).toBe(tutorialCheatSheet);
    expect(parsed.params.topic).toBe('Docker');
    const rendered = tutorialCheatSheet.render({ ...tutorialCheatSheet.defaults, ...parsed.params, title: 'A'.repeat(100) });
    expect(textContent(rendered)).toContain(`${'A'.repeat(59)}…`);
    expect(rendered.props.style).toMatchObject({ width: '1200px', height: '630px' });
    walk(rendered, (node) => {
      if (node.type === 'div') expect(node.props.style.display).toBe('flex');
    });
  });

  it('uses shared fields, exports and registers exactly once in Tutorial', () => {
    const registered = getTemplate('tutorial-cheat-sheet');
    expect(tutorialCheatSheetExport).toBe(tutorialCheatSheet);
    expect(registered).toBe(tutorialCheatSheet);
    expect(getTemplatesByCategory('tutorial').filter((template) => template.id === 'tutorial-cheat-sheet')).toHaveLength(1);
    for (const field of ['title', 'topic', 'items', 'siteName', 'bgColor', 'accentColor', 'textColor']) {
      expect(tutorialCheatSheet.fields.some((item) => item.key === field)).toBe(true);
    }
    expect(tutorialCheatSheet.fields.find((field) => field.key === 'items')?.type).toBe('textarea');
    expect(tutorialCheatSheet.fields.find((field) => field.key === 'items')?.defaultValue)
      .toBe(tutorialCheatSheet.defaults.items);
  });

  it('renders the Items textarea in the existing customize panel', () => {
    const html = renderToString(React.createElement(AIProvider, null,
      React.createElement(CustomizePanel, {
        fields: tutorialCheatSheet.fields,
        params: tutorialCheatSheet.defaults,
        onParamChange: () => {},
        onReset: () => {},
        category: 'tutorial',
      })
    ));
    expect(html).toContain('Items');
    expect(html).toContain('editor-field-textarea');
  });
});
