import { describe, expect, it } from 'vitest';
import template from '@/templates/github/release-notes';
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

describe('github-release-notes', () => {
  it('shows all three changes by default', () => {
    expect(text({})).toEqual(
      expect.arrayContaining(['New plugin system', 'Performance improvements', 'Breaking: Updated API']),
    );
  });

  it('leaves out a cleared change', () => {
    const shown = text({ change1: 'Fix login redirect', change2: '', change3: '' });

    expect(shown).toContain('Fix login redirect');
    expect(shown).not.toContain('Performance improvements');
    expect(shown).not.toContain('Breaking: Updated API');
  });
});
