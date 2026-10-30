import { describe, it, expect } from 'vitest';
import membersOnly from '@/templates/newsletter/members-only';
import { getTemplate } from '@/templates/registry';
import { contrastText, hexToRgb, isLightColor } from '@/templates/utils';
import type { SatoriElement } from '@/templates/types';

/** Every element in the tree, in order. */
function elements(node: unknown): SatoriElement[] {
  if (Array.isArray(node)) return node.flatMap(elements);
  if (node && typeof node === 'object' && 'props' in node) {
    const el = node as SatoriElement;
    return [el, ...elements(el.props.children)];
  }
  return [];
}

/** Every string rendered anywhere in the element tree, in order. */
function texts(node: unknown): string[] {
  if (typeof node === 'string') return [node];
  if (Array.isArray(node)) return node.flatMap(texts);
  if (node && typeof node === 'object' && 'props' in node) {
    return texts((node as SatoriElement).props.children);
  }
  return [];
}

/** The style of the element that directly holds this text. */
function styleOf(node: unknown, text: string): Record<string, any> | undefined {
  if (Array.isArray(node)) {
    for (const child of node) {
      const found = styleOf(child, text);
      if (found) return found;
    }
    return undefined;
  }
  if (node && typeof node === 'object' && 'props' in node) {
    const { style, children } = (node as SatoriElement).props;
    if (children === text) return style;
    return styleOf(children, text);
  }
  return undefined;
}

const tree = (overrides: Record<string, unknown> = {}) =>
  membersOnly.render({ ...membersOnly.defaults, ...overrides });
const render = (overrides: Record<string, unknown> = {}) => texts(tree(overrides));

describe('newsletter-members-only', () => {
  it('is registered in the newsletter category', () => {
    expect(getTemplate('newsletter-members-only')?.category).toBe('newsletter');
  });

  it('renders a 1200x630 card', () => {
    const { style } = tree().props;
    expect(style.width).toBe('1200px');
    expect(style.height).toBe('630px');
  });

  it('renders with its defaults', () => {
    expect(render()).toEqual([
      'For paid subscribers',
      'How we cut our cloud bill in half',
      'We spent three months moving off managed databases. Here is what worked, what broke, and the numbers before and after.',
      'Upgrade to keep reading',
      'The Weekly Byte',
    ]);
  });

  it('hides teaser, label, cta, or site name when empty or whitespace-only', () => {
    const emptyOverrides = {
      label: '   ',
      description: '',
      cta: '   ',
      siteName: '',
    };
    expect(render(emptyOverrides)).toEqual(['How we cut our cloud bill in half']);
  });

  it('shrinks long title with autoFontSize and truncates', () => {
    const normalTitle = 'How we cut our cloud bill in half';
    const longTitle = 'How we moved our entire multi-region cluster from managed cloud databases to bare metal servers in thirty days';
    
    const normalStyle = styleOf(tree({ title: normalTitle }), normalTitle);
    const longTree = tree({ title: longTitle });
    const renderedTexts = texts(longTree);
    const truncatedTitle = renderedTexts.find((t) => t.startsWith('How we moved'));
    expect(truncatedTitle).toBeDefined();
    expect(truncatedTitle?.length).toBeLessThanOrEqual(90);

    const longStyle = styleOf(longTree, truncatedTitle!);
    const normalSize = parseInt(String(normalStyle?.fontSize), 10);
    const longSize = parseInt(String(longStyle?.fontSize), 10);
    expect(longSize).toBeLessThan(normalSize);
  });

  it('shrinks long teaser with autoFontSize and truncates', () => {
    const normalTeaser = 'We spent three months moving off managed databases.';
    const longTeaser = 'We spent three months moving off managed databases. Here is what worked, what broke, and the numbers before and after. We documented everything across infrastructure, latency benchmarks, unexpected downtime, rollback plans, and team learnings.';

    const normalStyle = styleOf(tree({ description: normalTeaser }), normalTeaser);
    const longTree = tree({ description: longTeaser });
    const renderedTexts = texts(longTree);
    const truncatedTeaser = renderedTexts.find((t) => t.startsWith('We spent three months'));
    expect(truncatedTeaser).toBeDefined();
    expect(truncatedTeaser?.length).toBeLessThanOrEqual(300);

    const longStyle = styleOf(longTree, truncatedTeaser!);
    const normalSize = parseInt(String(normalStyle?.fontSize), 10);
    const longSize = parseInt(String(longStyle?.fontSize), 10);
    expect(longSize).toBeLessThan(normalSize);
  });

  it('fades the teaser into the background color including on light backgrounds', () => {
    // Dark background fade
    const darkTree = tree({ bgColor: '#0a0a0a' });
    const darkFadeOverlay = elements(darkTree).find((el) =>
      String(el.props.style?.background).includes('linear-gradient'),
    );
    expect(darkFadeOverlay).toBeDefined();
    expect(darkFadeOverlay?.props.style?.background).toContain('rgba(10, 10, 10, 0)');
    expect(darkFadeOverlay?.props.style?.background).toContain('#0a0a0a');

    // Light background fade
    const lightTree = tree({ bgColor: '#ffffff' });
    const lightFadeOverlay = elements(lightTree).find((el) =>
      String(el.props.style?.background).includes('linear-gradient'),
    );
    expect(lightFadeOverlay).toBeDefined();
    expect(lightFadeOverlay?.props.style?.background).toContain('rgba(255, 255, 255, 0)');
    expect(lightFadeOverlay?.props.style?.background).toContain('#ffffff');
  });

  it('keeps CTA pill readable with contrastText', () => {
    for (const accentColor of ['#E07A5F', '#000000', '#FFFFFF', '#F5C518', '#3b82f6']) {
      const ctaStyle = styleOf(tree({ accentColor }), 'Upgrade to keep reading');
      expect(ctaStyle?.color).toBe(contrastText(accentColor));
    }
  });

  it('keeps the label readable on a light background', () => {
    const labelStyle = styleOf(tree({ bgColor: '#ffffff', accentColor: '#E07A5F' }), 'For paid subscribers');
    const labelColor = labelStyle?.color;
    expect(labelColor).toBeDefined();
    // On a light background (#ffffff), a light accent (#E07A5F) should be darkened to contrast
    expect(labelColor).not.toBe('#E07A5F');
    expect(isLightColor(labelColor!)).toBe(false);
  });
});
