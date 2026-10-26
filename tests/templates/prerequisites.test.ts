import { describe, expect, it } from 'vitest';
import prerequisites from '../../src/templates/tutorial/prerequisites';

const render = (overrides: Record<string, unknown> = {}) => prerequisites.render({ ...prerequisites.defaults, ...overrides });
const serialized = (overrides: Record<string, unknown> = {}) => JSON.stringify(render(overrides));

describe('tutorial-prerequisites', () => {
  it('renders the title, checklist, inline SVG checks, and duration', () => {
    const tree = serialized();
    expect(tree).toContain('BEFORE YOU START');
    expect(tree).toContain('Node 20 or newer');
    expect(tree).toContain('"type":"svg"');
    expect(tree).toContain('About 45 minutes');
  });

  it('skips empty items while preserving order and truncates long items', () => {
    const tree = serialized({ item1: 'First', item2: '   ', item3: 'A'.repeat(100) });
    expect(tree.indexOf('First')).toBeLessThan(tree.indexOf('A'.repeat(70)));
    expect(tree).toContain('…');
  });

  it('hides a whitespace-only duration and adapts accent text on light backgrounds', () => {
    const tree = serialized({ duration: '   ', bgColor: '#ffffff', accentColor: '#FFD700' });
    expect(tree).not.toContain('About 45 minutes');
    expect(tree).toContain('"color":"#8c7600"');
  });
});
