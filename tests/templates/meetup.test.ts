import { describe, expect, it } from 'vitest';
import meetup from '@/templates/event/meetup';
import type { SatoriElement } from '@/templates/types';

function textContent(node: unknown): string[] {
  if (typeof node === 'string') return [node];
  if (Array.isArray(node)) return node.flatMap(textContent);
  if (node && typeof node === 'object' && 'props' in node) {
    return textContent((node as SatoriElement).props.children);
  }
  return [];
}

const badge = (date: string) => textContent(meetup.render({ ...meetup.defaults, date })).slice(0, 2);

describe('event-meetup', () => {
  it('shows the day and month in the date badge', () => {
    expect(badge('Feb 20')).toEqual(['20', 'Feb']);
    expect(badge('Jan 1, 2026')).toEqual(['1', 'Jan']);
  });

  it('shows a date without a space once', () => {
    expect(badge('2026-02-20')).toEqual(['2026-02-20', '']);
  });
});
