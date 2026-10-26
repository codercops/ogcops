import { describe, it, expect } from 'vitest';
import stickyNote from '@/templates/quote/sticky-note';
import { getTemplate } from '@/templates/registry';
import type { SatoriElement } from '@/templates/types';

/** Every string rendered anywhere in the element tree, in order. */
function texts(node: unknown): string[] {
  if (typeof node === 'string') return [node];
  if (Array.isArray(node)) return node.flatMap(texts);
  if (node && typeof node === 'object' && 'props' in node) {
    return texts((node as SatoriElement).props.children);
  }
  return [];
}

const render = (overrides: Record<string, unknown> = {}) =>
  texts(stickyNote.render({ ...stickyNote.defaults, ...overrides }));

describe('quote-sticky-note', () => {
  it('is registered in the quote category', () => {
    expect(getTemplate('quote-sticky-note')?.category).toBe('quote');
  });

  it('renders the quote and signs the author', () => {
    expect(render()).toEqual(['\u201CSimplicity is prerequisite for reliability.\u201D', '\u2014 Edsger W. Dijkstra']);
  });

  it('hides the author line when the author is empty', () => {
    expect(render({ author: '' })).toHaveLength(1);
  });

  it('shortens a quote longer than 200 characters', () => {
    const [quote] = render({ quote: 'a'.repeat(300) });
    expect(quote.length).toBeLessThanOrEqual(202);
  });
});
