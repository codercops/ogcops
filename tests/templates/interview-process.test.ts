import { describe, it, expect } from 'vitest';
import interviewProcess from '@/templates/job/interview-process';
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
  texts(interviewProcess.render({ ...interviewProcess.defaults, ...overrides }));

describe('job-interview-process', () => {
  it('is registered in the job category', () => {
    expect(getTemplate('job-interview-process')?.category).toBe('job');
  });

  it('renders the company, title, numbered steps and duration with its defaults', () => {
    expect(render()).toEqual([
      'Acme Corp',
      'How We Hire',
      '1',
      'Application Review',
      '2',
      'Recruiter Screen',
      '3',
      'Team Interview',
      '4',
      'Offer & Onboarding',
      'Duration · 3-4 weeks',
    ]);
  });

  it('skips empty steps and renumbers the remaining steps sequentially', () => {
    expect(render({ step1: 'Portfolio Review', step2: '', step3: 'Team Interview', step4: '   ' })).toEqual([
      'Acme Corp',
      'How We Hire',
      '1',
      'Portfolio Review',
      '2',
      'Team Interview',
      'Duration · 3-4 weeks',
    ]);
  });

  it('hides the duration when it is empty or blank', () => {
    for (const duration of ['', '   ']) {
      expect(render({ duration })).not.toContain('Duration · 3-4 weeks');
    }
  });

  it('truncates excessively long step names', () => {
    const longStep = 'Discovery and alignment with every stakeholder '.repeat(3);
    const step = render({ step1: longStep }).find((text) => text.startsWith('Discovery and alignment'));

    expect(step).toBeDefined();
    expect(step!.length).toBeLessThanOrEqual(60);
    expect(step!.endsWith('…')).toBe(true);
  });
});
