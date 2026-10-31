import { describe, expect, it } from 'vitest';
import { getAllTemplates } from '@/templates/registry';

const template = getAllTemplates().find(({ id }) => id === 'podcast-listen-on');

if (!template) throw new Error('Template not found: podcast-listen-on');

type TestNode = {
  props?: {
    children?: unknown;
    style?: Record<string, unknown>;
  };
};

function findPillWithText(node: unknown, text: string): TestNode | undefined {
  if (node === null || typeof node !== 'object') return undefined;

  const candidate = node as TestNode;
  const children = candidate.props?.children;
  if (
    children !== null &&
    typeof children === 'object' &&
    !Array.isArray(children) &&
    (children as TestNode).props?.children === text &&
    candidate.props?.style?.background
  ) {
    return candidate;
  }

  const nested = Array.isArray(children) ? children : [children];
  for (const child of nested) {
    const found = findPillWithText(child, text);
    if (found) return found;
  }

  return undefined;
}

function findTextWithColor(node: unknown, text: string): TestNode | undefined {
  if (node === null || typeof node !== 'object') return undefined;

  const candidate = node as TestNode;
  if (candidate.props?.children === text && candidate.props.style?.color) return candidate;

  const children = candidate.props?.children;
  const nested = Array.isArray(children) ? children : [children];
  for (const child of nested) {
    const found = findTextWithColor(child, text);
    if (found) return found;
  }

  return undefined;
}

describe('podcast-listen-on', () => {
  it('hides whitespace-only optional fields and empty platforms', () => {
    const element = template.render({
      ...template.defaults,
      episodeNumber: '  ',
      tagline: '\t ',
      platform1: '',
      platform2: '  ',
      platform3: '\n',
    });
    const rendered = JSON.stringify(element);

    expect(rendered).not.toContain('Episode');
    expect(rendered).not.toContain('Out now');
    expect(rendered).not.toContain('Spotify');
    expect(rendered).not.toContain('Apple Podcasts');
    expect(rendered).not.toContain('YouTube');
  });

  it('truncates platform names and keeps their pills from shrinking', () => {
    const longPlatformName = 'A very long podcast listening platform name';
    const element = template.render({
      ...template.defaults,
      platform1: longPlatformName,
      platform2: '',
      platform3: '',
    });
    const rendered = JSON.stringify(element);

    expect(rendered).toContain(`${longPlatformName.slice(0, 21)}…`);
    expect(rendered).not.toContain(longPlatformName);
    expect(rendered).toContain('"flexShrink":0');
  });

  it.each([
    ['#ffffff', '#000000'],
    ['#000000', '#FFFFFF'],
  ])('uses readable pill text for accent %s', (accentColor, expectedTextColor) => {
    const element = template.render({ ...template.defaults, accentColor });
    const pill = findPillWithText(element, 'Spotify');

    expect(pill?.props?.style?.color).toBe(expectedTextColor);
  });

  it('darkens accent text on light backgrounds without changing pill contrast', () => {
    const element = template.render({
      ...template.defaults,
      bgColor: '#ffffff',
      accentColor: '#fde047',
    });
    const tagline = findTextWithColor(element, 'Out now');
    const separator = findTextWithColor(element, '·');
    const pill = findPillWithText(element, 'Spotify');

    expect(tagline?.props?.style?.color).toBe('#8b7b27');
    expect(separator?.props?.style?.color).toBe('#8b7b27');
    expect(pill?.props?.style?.color).toBe('#000000');
  });
});
