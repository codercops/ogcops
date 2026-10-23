import { describe, expect, it } from 'vitest';
import goodFirstIssues, { parseIssues } from '../../src/templates/github/good-first-issues';

const render = (overrides: Record<string, unknown> = {}) => goodFirstIssues.render({ ...goodFirstIssues.defaults, ...overrides });
const serialized = (overrides: Record<string, unknown> = {}) => JSON.stringify(render(overrides));

describe('github-good-first-issues', () => {
  it('parses numbered and unnumbered issue lines', () => {
    expect(parseIssues('128 Add a feature\nNeeds triage')).toEqual([
      { number: '128', title: 'Add a feature' },
      { number: '', title: 'Needs triage' },
    ]);
  });

  it('caps rows at four and reports hidden issues', () => {
    const tree = serialized({ issues: '1 One\n2 Two\n3 Three\n4 Four\n5 Five\n6 Six' });
    expect(tree).toContain('+2 more');
    expect(tree).toContain('#1');
    expect(tree).toContain('#4');
    expect(tree).not.toContain('"children":"#5"');
  });

  it('truncates long titles and hides an empty footer', () => {
    const tree = serialized({ issues: '1 ' + 'A'.repeat(100), footer: '' });
    expect(tree).toContain('…');
    expect(tree).not.toContain('borderTop');
    expect(tree).toContain('"flex":1');
    expect(tree).toContain('"minWidth":0');
  });

  it('darkens accents further on light backgrounds', () => {
    const tree = serialized({ bgColor: '#ffffff', accentColor: '#FFD700' });
    expect(tree).toContain('"color":"#8c7600"');
  });
});
