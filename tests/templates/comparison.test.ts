import { describe, expect, it } from 'vitest';
import template from '@/templates/saas/comparison';
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

describe('saas-comparison', () => {
  it('shows every item by default', () => {
    expect(text({})).toEqual(expect.arrayContaining(['Manual processes', 'No visibility', 'Fully automated', 'Real-time insights']));
  });

  it('leaves out a cleared item', () => {
    const shown = text({ beforeItem1: 'Spreadsheets', beforeItem2: '', beforeItem3: '', afterItem1: 'One dashboard', afterItem2: '', afterItem3: '' });

    expect(shown).toContain('Spreadsheets');
    expect(shown).toContain('One dashboard');
    expect(shown).not.toContain('Slow deployments');
    expect(shown).not.toContain('10x faster shipping');
  });
});
