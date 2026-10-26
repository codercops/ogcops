import { describe, it, expect } from 'vitest';
import shortcutTip from '@/templates/product/shortcut-tip';
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
  texts(shortcutTip.render({ ...shortcutTip.defaults, ...overrides }));

describe('product-shortcut-tip', () => {
  it('is registered in the product category', () => {
    expect(getTemplate('product-shortcut-tip')?.category).toBe('product');
  });

  it('draws two keys with the default Ctrl + K', () => {
    expect(render()).toEqual(expect.arrayContaining(['Ctrl', '+', 'K']));
    expect(render().filter((t) => t === '+')).toHaveLength(1);
  });

  it('adds a third key when key3 is set, and ignores a blank one', () => {
    const three = render({ key3: 'Shift' });
    expect(three.filter((t) => t === '+')).toHaveLength(2);
    expect(three).toContain('Shift');
    expect(render({ key3: '   ' }).filter((t) => t === '+')).toHaveLength(1);
  });

  it('falls back to Ctrl and K when the first two keys are empty', () => {
    expect(render({ key1: '', key2: '' })).toEqual(expect.arrayContaining(['Ctrl', 'K']));
  });

  it('shortens a very long key name', () => {
    // With the label hidden, the first string is the first keycap.
    const [key] = render({ label: '', key1: 'Escape-Escape-Escape' });
    expect(key).toBe('Escape-Es…');
  });

  it('hides the label pill when the label is empty', () => {
    expect(render()).toContain('Pro tip');
    expect(render({ label: '' })).not.toContain('Pro tip');
  });
});
