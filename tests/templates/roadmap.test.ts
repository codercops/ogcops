import { describe, expect, it } from 'vitest';
import roadmap from '../../src/templates/saas/roadmap';

const render = (overrides: Record<string, unknown> = {}) => roadmap.render({ ...roadmap.defaults, ...overrides });
const serialized = (overrides: Record<string, unknown> = {}) => JSON.stringify(render(overrides));

describe('saas-roadmap', () => {
  it('renders all roadmap columns', () => {
    const tree = serialized();
    expect(tree).toContain('Now');
    expect(tree).toContain('Team billing');
    expect(tree).toContain('Offline sync');
  });

  it('hides whitespace-only columns and keeps remaining columns flexible', () => {
    const tree = serialized({ next: '   ' });
    expect(tree).not.toContain('Team billing');
    expect(tree).toContain('"flex":1');
    expect(tree).toContain('"minWidth":0');
  });

  it('truncates very long items and adapts accent text on light backgrounds', () => {
    const tree = serialized({ later: 'A'.repeat(100), bgColor: '#ffffff', accentColor: '#FFD700' });
    expect(tree).toContain('…');
    expect(tree).toContain('"color":"#8c7600"');
  });
});
