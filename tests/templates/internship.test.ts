import { describe, expect, it } from 'vitest';
import internship from '@/templates/job/internship';
import { getTemplate } from '@/templates/registry';
import { contrastText } from '@/templates/utils';
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
  internship.render({ ...internship.defaults, ...overrides });

describe('job-internship', () => {
  it('is registered in the job category and re-exported', async () => {
    expect(getTemplate('job-internship')?.category).toBe('job');
    const exports = await import('@/templates/job');
    expect(exports.jobInternship.id).toBe('job-internship');
  });

  it('renders the pill, company, role, the three detail pills in order and the deadline', () => {
    expect(textContent(render())).toEqual([
      'Internship',
      'Acme Labs',
      'Frontend Engineering Intern',
      '12 weeks',
      'Starts May 2027',
      'Paid',
      'Apply by 15 November',
    ]);
  });

  it('drops blank optional fields one at a time and keeps the others in order', () => {
    expect(textContent(render({ duration: '  ', start: '', stipend: 'Paid' }))).toEqual([
      'Internship',
      'Acme Labs',
      'Frontend Engineering Intern',
      'Paid',
      'Apply by 15 November',
    ]);
  });

  it('hides a blank deadline and a blank company cleanly', () => {
    expect(textContent(render({ deadline: '   ', company: ' ' }))).toEqual([
      'Internship',
      'Frontend Engineering Intern',
      '12 weeks',
      'Starts May 2027',
      'Paid',
    ]);
  });

  it('shrinks long roles with autoFontSize and then truncates them', () => {
    const longRole = 'Frontend Engineering Intern on the Design Systems and Accessibility Platform Team';
    const heading = elements(render({ title: longRole })).find((element) => element.type === 'h1');

    expect(textContent(heading)[0]).toHaveLength(70);
    expect(textContent(heading)[0]).toMatch(/…$/);
    expect(heading?.props.style?.fontSize).toBe('38px');
  });

  it('keeps the pill label readable on any accent and the deadline readable on a light background', () => {
    const dark = elements(render());
    const light = elements(render({ bgColor: '#ffffff', textColor: '#111111', accentColor: '#fde047' }));

    const pill = dark.find((element) => element.type === 'div' &&
      element.props.style?.backgroundColor === '#E07A5F');
    const pillLabel = elements(pill).find((element) => element.type === 'span');
    expect(textContent(pillLabel)).toEqual(['Internship']);
    expect(pillLabel?.props.style?.color).toBe(contrastText('#E07A5F'));

    const palePill = light.find((element) => element.type === 'div' &&
      element.props.style?.backgroundColor === '#fde047');
    const palePillLabel = elements(palePill).find((element) => element.type === 'span');
    expect(palePillLabel?.props.style?.color).toBe(contrastText('#fde047'));

    const paleDeadline = elements(light).find((element) => element.type === 'span' &&
      textContent(element)[0] === 'Apply by 15 November');
    expect(paleDeadline?.props.style?.color).toBe('#8b7b27');
  });
});
