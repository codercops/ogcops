import { describe, it, expect } from 'vitest';
import companyCulture from '@/templates/job/company-culture';
import { getTemplate } from '@/templates/registry';
import type { SatoriElement } from '@/templates/types';

const render = (overrides: Record<string, unknown> = {}) =>
  companyCulture.render({ ...companyCulture.defaults, ...overrides });

/** The flex-wrap row that holds the value pills. */
function findPillRow(node: unknown): SatoriElement | undefined {
  if (Array.isArray(node)) {
    for (const child of node) {
      const found = findPillRow(child);
      if (found) return found;
    }
    return undefined;
  }
  if (node && typeof node === 'object' && 'props' in node) {
    const el = node as SatoriElement;
    if (el.props.style?.flexWrap === 'wrap') return el;
    return findPillRow(el.props.children);
  }
  return undefined;
}

function pills(node: unknown): SatoriElement[] {
  return (findPillRow(node)?.props.children ?? []) as SatoriElement[];
}

function pillText(pill: SatoriElement): string {
  return String(pill.props.children.props.children);
}

const LONG_VALUE_1 = 'We ship small changes every day and review each other code';
const LONG_VALUE_2 = 'Everyone gets a learning budget and two focus days a month';

describe('job-company-culture', () => {
  it('is registered in the job category', () => {
    expect(getTemplate('job-company-culture')?.category).toBe('job');
  });

  it('renders the four default values verbatim', () => {
    expect(pills(render()).map(pillText)).toEqual([
      'Innovation',
      'Transparency',
      'Collaboration',
      'Impact',
    ]);
  });

  it('truncates long values so pill text stays within its outline', () => {
    const texts = pills(render({ value1: LONG_VALUE_1, value2: LONG_VALUE_2 })).map(pillText);
    expect(texts).toEqual([
      'We ship small changes every day and rev…',
      'Everyone gets a learning budget and two…',
      'Collaboration',
      'Impact',
    ]);
  });

  it('keeps every pill at full width with flexShrink 0', () => {
    const rendered = pills(render({ value1: LONG_VALUE_1, value2: LONG_VALUE_2 }));
    expect(rendered).toHaveLength(4);
    for (const pill of rendered) {
      expect(pill.props.style.flexShrink).toBe(0);
      expect(pill.props.style.padding).toBe('10px 24px');
      expect(pill.props.style.borderRadius).toBe('100px');
      expect(pill.props.style.border).toContain('2px solid');
    }
  });
});