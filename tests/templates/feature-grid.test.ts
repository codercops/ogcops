import { describe, expect, it } from 'vitest';
import template from '@/templates/product/feature-grid';
import type { SatoriElement } from '@/templates/types';

function textContent(node: unknown): string[] {
  if (typeof node === 'string') return [node];
  if (Array.isArray(node)) return node.flatMap(textContent);
  if (node && typeof node === 'object' && 'props' in node) {
    return textContent((node as SatoriElement).props.children);
  }
  return [];
}

const text = (params: Record<string, string>) => textContent(template.render({ ...template.defaults, ...params }));

describe('product-feature-grid', () => {
  it('shows every feature by default', () => {
    expect(text({})).toEqual(expect.arrayContaining(['Lightning Fast', 'Secure by Default', 'Easy Integration', 'Real-time Sync']));
  });

  it('leaves out a cleared feature', () => {
    const shown = text({ feature1: 'Offline mode', feature2: '', feature3: '', feature4: '' });

    expect(shown).toContain('Offline mode');
    expect(shown).not.toContain('Secure by Default');
    expect(shown).not.toContain('Real-time Sync');
  });
});
