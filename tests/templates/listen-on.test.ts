import { describe, it, expect } from 'vitest';
import listenOn from '@/templates/podcast/listen-on';
import { getTemplate } from '@/templates/registry';
import { hexToRgb } from '@/templates/utils';
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

/** Recursively find all elements matching a predicate. */
function findElements(node: unknown, predicate: (el: SatoriElement) => boolean): SatoriElement[] {
  const result: SatoriElement[] = [];
  if (Array.isArray(node)) {
    for (const child of node) {
      result.push(...findElements(child, predicate));
    }
  } else if (node && typeof node === 'object' && 'props' in node) {
    const el = node as SatoriElement;
    if (predicate(el)) result.push(el);
    result.push(...findElements(el.props.children, predicate));
  }
  return result;
}

function luminance(hex: string): number {
  const rgb = hexToRgb(hex);
  if (!rgb) throw new Error(`not a hex color: ${hex}`);
  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

const renderTree = (overrides: Record<string, unknown> = {}) =>
  listenOn.render({ ...listenOn.defaults, ...overrides });

const renderTexts = (overrides: Record<string, unknown> = {}) =>
  texts(renderTree(overrides));

describe('podcast-listen-on', () => {
  it('is registered in the podcast category with id podcast-listen-on', () => {
    const registered = getTemplate('podcast-listen-on');
    expect(registered).toBeDefined();
    expect(registered?.category).toBe('podcast');
    expect(registered?.name).toBe('Listen On');
    expect(registered?.tags.length).toBeGreaterThanOrEqual(4);
    expect(registered?.tags.length).toBeLessThanOrEqual(6);
  });

  it('renders default values including showName, episode badge, title, tagline, and platform pills', () => {
    const t = renderTexts();
    expect(t).toContain('\u266A');
    expect(t).toContain('The Dev Show');
    expect(t).toContain('EP 42');
    expect(t).toContain('Building Developer Tools That Scale');
    expect(t).toContain('Out now');
    expect(t).toContain('Spotify');
    expect(t).toContain('Apple Podcasts');
    expect(t).toContain('YouTube');
  });

  it('hides blank episodeNumber', () => {
    const emptyEp = renderTexts({ episodeNumber: '' });
    expect(emptyEp.some((text) => text.startsWith('EP '))).toBe(false);

    const whitespaceEp = renderTexts({ episodeNumber: '   ' });
    expect(whitespaceEp.some((text) => text.startsWith('EP '))).toBe(false);
  });

  it('hides blank tagline', () => {
    const emptyTagline = renderTexts({ tagline: '' });
    expect(emptyTagline).not.toContain('Out now');

    const whitespaceTagline = renderTexts({ tagline: '   ' });
    expect(whitespaceTagline).not.toContain('Out now');
  });

  it('skips blank platforms', () => {
    const skipped = renderTexts({
      platform1: 'Spotify',
      platform2: '',
      platform3: '   ',
    });
    expect(skipped).toContain('Spotify');
    expect(skipped).not.toContain('Apple Podcasts');
    expect(skipped).not.toContain('YouTube');
  });

  it('keeps pill shapes stable with flexShrink: 0 and constrains width', () => {
    const tree = renderTree({
      platform1: 'Very Long Platform Name That Exceeds Normal Limits',
    });

    const pills = findElements(tree, (el) => el.props?.style?.borderRadius === '100px' && el.props?.style?.padding === '10px 22px');
    expect(pills.length).toBe(3);

    for (const pill of pills) {
      expect(pill.props.style.flexShrink).toBe(0);
      expect(pill.props.style.maxWidth).toBe('320px');
    }

    // Long platform name should be truncated
    const t = texts(tree);
    expect(t.some((s) => s.endsWith('…'))).toBe(true);
  });

  it('ensures pill text remains readable for any accent color and background', () => {
    // Test dark background with dark accent (e.g. #000000 on #0d1117)
    const darkOnDarkTree = renderTree({
      bgColor: '#0d1117',
      textColor: '#FFFFFF',
      accentColor: '#000000',
    });
    const darkPills = findElements(darkOnDarkTree, (el) => el.props?.style?.borderRadius === '100px' && el.props?.style?.padding === '10px 22px');
    const darkPillTextColor = (darkPills[0].props.children as SatoriElement).props.style.color;
    expect(contrast(darkPillTextColor, '#0d1117')).toBeGreaterThanOrEqual(4.5);

    // Test light background with light accent (e.g. #FFFFFF on #FFFFFF)
    const lightOnLightTree = renderTree({
      bgColor: '#FFFFFF',
      textColor: '#000000',
      accentColor: '#FFFFFF',
    });
    const lightPills = findElements(lightOnLightTree, (el) => el.props?.style?.borderRadius === '100px' && el.props?.style?.padding === '10px 22px');
    const lightPillTextColor = (lightPills[0].props.children as SatoriElement).props.style.color;
    expect(contrast(lightPillTextColor, '#FFFFFF')).toBeGreaterThanOrEqual(4.5);

    // Test default accent (#E07A5F) on light background
    const terracottaOnLight = renderTree({
      bgColor: '#FFFFFF',
      textColor: '#111827',
      accentColor: '#E07A5F',
    });
    const terraPills = findElements(terracottaOnLight, (el) => el.props?.style?.borderRadius === '100px' && el.props?.style?.padding === '10px 22px');
    const terraTextColor = (terraPills[0].props.children as SatoriElement).props.style.color;
    expect(contrast(terraTextColor, '#FFFFFF')).toBeGreaterThanOrEqual(4.5);
  });

  it('renders cleanly when optional fields are empty', () => {
    const emptyTree = renderTree({
      showName: '',
      episodeNumber: '',
      tagline: '',
      platform1: '',
      platform2: '',
      platform3: '',
    });
    const t = texts(emptyTree);
    expect(t).toContain('\u266A');
    expect(t).toContain('Building Developer Tools That Scale');
    expect(t).toHaveLength(2); // Only icon and title
  });
});
