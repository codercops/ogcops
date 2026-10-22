import { describe, expect, it } from 'vitest';
import minimalPlayer from '@/templates/podcast/minimal-player';

function walk(node: any, visit: (node: any) => void): void {
  if (!node || typeof node !== 'object') return;
  visit(node);
  const children = node.props?.children;
  if (Array.isArray(children)) children.forEach((child) => walk(child, visit));
  else walk(children, visit);
}

function progressWidth(progressPercent?: unknown): string | undefined {
  const rendered = minimalPlayer.render({
    ...minimalPlayer.defaults,
    ...(progressPercent === undefined ? {} : { progressPercent }),
  });
  let width: string | undefined;
  walk(rendered, (node) => {
    if (node.props?.style?.height === '6px' && node.props.style.background === minimalPlayer.defaults.accentColor) {
      width = node.props.style.width;
    }
  });
  return width;
}

describe('podcast-minimal-player progress', () => {
  it.each([
    ['numeric zero', 0, '0%'],
    ['string zero', '0', '0%'],
    ['missing value', undefined, '35%'],
    ['empty value', '', '35%'],
    ['non-numeric value', 'abc', '35%'],
    ['negative value', '-20', '0%'],
    ['value above 100', '150', '100%'],
  ])('renders the clamped progress width for %s', (_label, value, expectedWidth) => {
    expect(progressWidth(value)).toBe(expectedWidth);
  });
});
