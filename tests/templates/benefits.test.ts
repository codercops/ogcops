import { describe, expect, it } from 'vitest';
import benefits from '@/templates/job/benefits';
import { getTemplate } from '@/templates/registry';
import type { SatoriElement } from '@/templates/types';

function elements(node: unknown): SatoriElement[] {
  if (Array.isArray(node)) return node.flatMap(elements);
  if (!node || typeof node !== 'object' || !('type' in node)) return [];

  const element = node as SatoriElement;
  return [element, ...elements(element.props.children)];
}

function textContent(node: unknown): string[] {
  if (typeof node === 'string') return [node];
  if (Array.isArray(node)) return node.flatMap(textContent);
  if (node && typeof node === 'object' && 'props' in node) {
    return textContent((node as SatoriElement).props.children);
  }
  return [];
}

const render = (overrides: Record<string, unknown> = {}) =>
  benefits.render({ ...benefits.defaults, ...overrides });

describe('job-benefits', () => {
  it('is registered in the job category and re-exported', async () => {
    expect(getTemplate('job-benefits')?.category).toBe('job');
    const exports = await import('@/templates/job');
    expect(exports.jobBenefits.id).toBe('job-benefits');
  });

  it('renders company, title, and the four perks in order', () => {
    expect(textContent(render())).toEqual([
      'Northstar',
      'Why people stay',
      'Remote first',
      '$1,500 learning budget',
      '4-day weeks in August',
      'Health cover for your family',
    ]);
  });

  it('skips empty and whitespace-only perks without changing the remaining order', () => {
    expect(textContent(render({
      perk1: '  Remote first  ',
      perk2: ' ',
      perk3: 'Learning budget',
      perk4: '',
    }))).toEqual(['Northstar', 'Why people stay', 'Remote first', 'Learning budget']);
  });

  it('truncates long perks while allowing their text to wrap within its card', () => {
    const longPerk = 'A generous annual learning budget for courses conferences and books and professional development opportunities for every employee';
    const rendered = render({ perk1: longPerk });
    const perkText = elements(rendered).find((element) => element.type === 'span' &&
      textContent(element).some((text) => text.startsWith('A generous annual')));

    expect(textContent(perkText)[0]).toHaveLength(72);
    expect(textContent(perkText)[0]).toMatch(/^A generous annual learning budget/);
    expect(textContent(perkText)[0]).toMatch(/…$/);
    expect(perkText?.props.style?.overflowWrap).toBe('anywhere');
    expect(perkText?.props.style?.flex).toBe(1);
  });

  it('draws each check with inline SVG and keeps the mark readable on a light canvas', () => {
    const rendered = elements(render({
      bgColor: '#ffffff',
      accentColor: '#fde047',
    }));
    const icons = rendered.filter((element) => element.type === 'svg');

    expect(icons).toHaveLength(4);
    expect(JSON.stringify(icons[0])).toContain('#8b7b27');
    expect(JSON.stringify(icons[0])).toContain('"type":"path"');
  });

  it('hides a blank company name cleanly', () => {
    expect(textContent(render({ company: '   ' }))).not.toContain('Northstar');
  });
});
