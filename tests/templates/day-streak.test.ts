import { describe, expect, it } from 'vitest';
import dayStreak from '../../src/templates/developer/day-streak';

const render = (overrides: Record<string, unknown> = {}) =>
  dayStreak.render({ ...dayStreak.defaults, ...overrides });

const text = (node: unknown): string[] => {
  if (typeof node === 'string') return [node];
  if (!node || typeof node !== 'object') return [];
  const value = node as { props?: { children?: unknown } };
  const children = value.props?.children;
  return Array.isArray(children) ? children.flatMap(text) : text(children);
};

describe('developer-day-streak', () => {
  it('uses the defaults and renders all days', () => {
    const tree = render();
    expect(text(tree)).toContain('Day 42');
    expect(text(tree)).toContain('of 100');
    expect(JSON.stringify(tree)).toContain('"width":"18px"');
    expect(JSON.stringify(tree)).toContain('"color":"#E07A5F"');
  });

  it('defensively parses and clamps day values', () => {
    expect(text(render({ currentDay: 'not-a-number', totalDays: '30' }))).toContain('Day 30');
    expect(text(render({ currentDay: 99, totalDays: 7 }))).toContain('Day 7');
    expect(text(render({ currentDay: 0, totalDays: 0 }))).toContain('Day 1');
    expect(text(render({ currentDay: 12, totalDays: 200 }))).toContain('Day 12');
  });

  it('does not use Satori-incompatible centered grid content alignment', () => {
    expect(JSON.stringify(render())).not.toContain('alignContent');
  });
});
