import { describe, expect, it } from 'vitest';
import referral from '@/templates/job/referral';
import { getTemplate } from '@/templates/registry';
import { isLightColor, mixColors } from '@/templates/utils';
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
  referral.render({ ...referral.defaults, ...overrides });

const span = (tree: SatoriElement, text: string) =>
  elements(tree).find((element) => element.type === 'span' && textContent(element)[0] === text);

describe('job-referral', () => {
  it('is registered in the job category and re-exported', async () => {
    expect(getTemplate('job-referral')?.category).toBe('job');
    const exports = await import('@/templates/job');
    expect(exports.jobReferral.id).toBe('job-referral');
  });

  it('has the fields the issue asks for, with the defaults it names', () => {
    expect(referral.fields.map((field) => field.key)).toEqual([
      'title', 'company', 'bonus', 'bonusLabel', 'note', 'siteName', 'bgColor', 'accentColor', 'textColor',
    ]);
    expect(referral.defaults).toMatchObject({
      company: 'Acme',
      bonus: '$2,000',
      bonusLabel: 'referral bonus',
      note: 'Send their name to jobs@acme.com',
    });
  });

  it('is 1200 by 630 and every div is flex', () => {
    const tree = render();
    expect(tree.props.style).toMatchObject({ width: '1200px', height: '630px' });
    for (const element of elements(tree).filter((el) => el.type === 'div')) {
      expect(element.props.style?.display).toBe('flex');
    }
  });

  it('renders the label, role, company, bonus, its label, the note and the site name in order', () => {
    expect(textContent(render())).toEqual([
      'Know someone?',
      'Senior Backend Engineer',
      'at Acme',
      '$2,000',
      'referral bonus',
      'Send their name to jobs@acme.com',
      'acme.com',
    ]);
  });

  it('hides a blank company, bonus, note or site name, and a field of only spaces', () => {
    expect(textContent(render({ company: '' }))).not.toContain('at Acme');
    expect(textContent(render({ company: '   ' })).some((text) => text.startsWith('at '))).toBe(false);
    expect(textContent(render({ note: '  ' }))).not.toContain('Send their name to jobs@acme.com');
    expect(textContent(render({ siteName: ' ' }))).not.toContain('acme.com');
    expect(textContent(render({ siteName: '' }))).toEqual([
      'Know someone?',
      'Senior Backend Engineer',
      'at Acme',
      '$2,000',
      'referral bonus',
      'Send their name to jobs@acme.com',
    ]);
  });

  it('hides the bonus label together with a blank bonus', () => {
    for (const bonus of ['', '   ']) {
      expect(textContent(render({ bonus }))).toEqual([
        'Know someone?',
        'Senior Backend Engineer',
        'at Acme',
        'Send their name to jobs@acme.com',
        'acme.com',
      ]);
    }
  });

  it('keeps the bonus when only its label is blank', () => {
    expect(textContent(render({ bonusLabel: ' ' }))).toEqual([
      'Know someone?',
      'Senior Backend Engineer',
      'at Acme',
      '$2,000',
      'Send their name to jobs@acme.com',
      'acme.com',
    ]);
  });

  it('renders only the label and the role when every optional field is blank', () => {
    expect(textContent(render({ company: '', bonus: '', note: '', siteName: '' }))).toEqual([
      'Know someone?',
      'Senior Backend Engineer',
    ]);
  });

  it('falls back to the defaults when optional fields are omitted, and to the default role when the title is blank', () => {
    expect(textContent(referral.render({}))).toEqual(textContent(render()));
    expect(textContent(render({ title: '   ' }))[1]).toBe('Senior Backend Engineer');
  });

  it('shrinks a long role with autoFontSize and then truncates it', () => {
    const sizeOf = (title: string) =>
      elements(render({ title })).find((element) => element.type === 'h1')?.props.style?.fontSize;

    expect(sizeOf('Backend Engineer')).toBe('64px');
    expect(sizeOf('Senior Staff Backend Engineer, Payments')).toBe('44px');

    const longRole = 'Principal Distributed Systems Engineer for the Payments Reliability and Fraud Platform';
    const heading = elements(render({ title: longRole })).find((element) => element.type === 'h1');
    expect(textContent(heading)[0]).toHaveLength(60);
    expect(textContent(heading)[0]).toMatch(/…$/);
    expect(heading?.props.style?.fontSize).toBe('38px');
  });

  it('truncates a long company, bonus, label and note', () => {
    const tree = render({
      company: 'The International Association of Extremely Long Company Names',
      bonus: '$1,000,000 USD paid in full',
      bonusLabel: 'paid after ninety days of employment',
      note: 'Send their name, their CV and a short note about why they fit to the recruiting team at jobs@acme.com',
    });
    const texts = textContent(tree);
    expect(texts[2]).toHaveLength('at '.length + 40);
    expect(texts[2]).toMatch(/…$/);
    expect(texts[3]).toHaveLength(14);
    expect(texts[3]).toMatch(/…$/);
    expect(texts[4].length).toBeLessThanOrEqual(24);
    expect(texts[4]).toMatch(/…$/);
    expect(texts[5].length).toBeLessThanOrEqual(70);
    expect(texts[5]).toMatch(/…$/);
  });

  it('makes a longer bonus smaller so it still fits', () => {
    const sizeOf = (bonus: string) => span(render({ bonus }), bonus)?.props.style?.fontSize;
    expect(sizeOf('$500')).toBe('128px');
    expect(sizeOf('$10,000 USD')).toBe('104px');
    expect(sizeOf('£12,000 total')).toBe('84px');
  });

  it('keeps the label and the bonus readable on a light background', () => {
    const dark = render();
    expect(span(dark, 'Know someone?')?.props.style?.color).toBe('#E07A5F');
    expect(span(dark, '$2,000')?.props.style?.color).toBe('#E07A5F');

    const light = render({ bgColor: '#ffffff', textColor: '#111111', accentColor: '#fde047' });
    expect(isLightColor('#ffffff')).toBe(true);
    const ink = mixColors('#fde047', '#000000', 0.45);
    expect(ink).toBe('#8b7b27');
    expect(span(light, 'Know someone?')?.props.style?.color).toBe(ink);
    expect(span(light, '$2,000')?.props.style?.color).toBe(ink);
    expect(elements(light).find((element) => element.type === 'h1')?.props.style?.color).toBe('#111111');
    expect(span(light, 'Send their name to jobs@acme.com')?.props.style?.color).toBe('#111111');
  });
});
