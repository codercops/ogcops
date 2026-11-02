import { describe, expect, it } from 'vitest';
import template from '@/templates/saas/social-proof';
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

describe('saas-social-proof', () => {
  it('shows every company by default', () => {
    expect(text({})).toEqual(expect.arrayContaining(['Stripe', 'Vercel', 'Linear', 'Notion', 'Figma']));
  });

  it('leaves out a cleared company', () => {
    const shown = text({ company1: 'Acme', company2: 'Orbit', company3: '', company4: '', company5: '' });

    expect(shown).toContain('Acme');
    expect(shown).toContain('Orbit');
    expect(shown).not.toContain('Linear');
    expect(shown).not.toContain('Figma');
  });
});
