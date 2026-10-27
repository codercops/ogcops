import { describe, expect, it } from 'vitest';
import { getTemplate } from '@/templates/registry';
import type { SatoriElement } from '@/templates/types';
import { contrastText, isLightColor, mixColors } from '@/templates/utils';
import securityAdvisory from '@/templates/github/security-advisory';

function elements(node: unknown): SatoriElement[] {
  if (Array.isArray(node)) return node.flatMap(elements);
  if (node && typeof node === 'object' && 'props' in node) {
    const element = node as SatoriElement;
    return [element, ...elements(element.props.children)];
  }
  return [];
}

function texts(node: unknown): string[] {
  if (typeof node === 'string') return [node];
  if (Array.isArray(node)) return node.flatMap(texts);
  if (node && typeof node === 'object' && 'props' in node) {
    return texts((node as SatoriElement).props.children);
  }
  return [];
}

const tree = (overrides: Record<string, unknown> = {}) =>
  securityAdvisory.render({ ...securityAdvisory.defaults, ...overrides });
const render = (overrides: Record<string, unknown> = {}) => texts(tree(overrides));

describe('github-security-advisory', () => {
  it('is registered in the github category', () => {
    expect(getTemplate('github-security-advisory')?.category).toBe('github');
  });

  it('renders the severity, advisory, title, package details and site name', () => {
    expect(render()).toEqual([
      'High',
      'GHSA-3x9q-7m2v-p4hc',
      'Path traversal in @acme/static-files',
      '@acme/static-files · affected < 2.4.1 · fixed in 2.4.1',
      'Acme Security',
    ]);
  });

  it('is a 1200x630 card', () => {
    const { style } = tree().props;
    expect(style.width).toBe('1200px');
    expect(style.height).toBe('630px');
  });

  it('uses a distinct readable pill color for each severity and falls back to high', () => {
    const pill = (severity: string) => elements(tree({ severity })).find((element) => element.props.style?.borderRadius === '999px')!;
    const colors = ['critical', 'high', 'medium', 'low'].map((severity) => pill(severity).props.style.backgroundColor);

    expect(new Set(colors).size).toBe(4);
    for (const severity of ['critical', 'high', 'medium', 'low']) {
      const badge = pill(severity);
      const color = String(badge.props.style.backgroundColor);
      const label = elements(badge).find((element) => element.type === 'span');

      expect(texts(badge)).toEqual([severity[0].toUpperCase() + severity.slice(1)]);
      expect(label?.props.style.color).toBe(contrastText(color));
    }
    expect(pill('unknown').props.style.backgroundColor).toBe(pill('high').props.style.backgroundColor);
    expect(texts(pill('unknown'))).toEqual(['High']);
  });

  it('truncates long titles after sizing them and shrinks their font', () => {
    const title = 'A'.repeat(120);
    const heading = elements(tree({ title })).find((element) => element.type === 'h1');

    expect(heading?.props.children).toHaveLength(90);
    expect(String(heading?.props.children).endsWith('…')).toBe(true);
    expect(heading?.props.style.fontSize).toBe('40px');
  });

  it('hides blank optional fields and only separates available package details', () => {
    expect(render({
      advisoryId: '  ',
      packageName: ' \t',
      affected: '',
      patched: '\n ',
      siteName: ' ',
    })).toEqual(['High', 'Path traversal in @acme/static-files']);
    expect(render({ packageName: '', affected: '< 3.0', patched: '' })).toContain('affected < 3.0');
    expect(render({ packageName: '', affected: '< 3.0', patched: '' }).join('')).not.toContain('·');
  });

  it('keeps accent text readable on a light background', () => {
    const element = tree({ bgColor: '#ffffff', accentColor: '#fde047' });
    const advisoryId = elements(element).find((item) => item.props.children === 'GHSA-3x9q-7m2v-p4hc');
    const accentText = String(advisoryId?.props.style?.color);

    expect(accentText).toBe(mixColors('#fde047', '#000000', 0.45));
    expect(isLightColor(accentText)).toBe(false);
  });
});
