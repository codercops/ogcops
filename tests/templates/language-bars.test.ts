import { describe, expect, it } from 'vitest';
import languageBars from '@/templates/github/language-bars';
import type { SatoriElement } from '@/templates/types';

function textContent(node: unknown): string[] {
  if (typeof node === 'string') return [node];
  if (Array.isArray(node)) return node.flatMap(textContent);
  if (node && typeof node === 'object' && 'props' in node) {
    return textContent((node as SatoriElement).props.children);
  }
  return [];
}

const text = (params: Record<string, string>) => textContent(languageBars.render({ ...languageBars.defaults, ...params }));

describe('github-language-bars', () => {
  it('shows all four languages by default', () => {
    expect(text({})).toEqual(expect.arrayContaining(['TypeScript', 'Rust', 'CSS', 'Other']));
  });

  it('leaves out a language whose name is cleared', () => {
    const shown = text({ lang1: 'Go', pct1: '81.0%', lang2: 'Shell', pct2: '19.0%', lang3: '', pct3: '', lang4: '', pct4: '' });

    expect(shown).toEqual(expect.arrayContaining(['Go', '81.0%', 'Shell', '19.0%']));
    expect(shown).not.toContain('CSS');
    expect(shown).not.toContain('Other');
  });
});
