import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import satori, { type SatoriNode } from 'satori';
import youAsked from '@/templates/product/you-asked';
import { productYouAsked } from '@/templates/product';
import { getTemplate } from '@/templates/registry';
import type { SatoriElement } from '@/templates/types';

const fonts = [
  {
    name: 'Inter',
    data: readFileSync(join(process.cwd(), 'public/fonts/Inter-Regular.woff')),
    weight: 400 as const,
    style: 'normal' as const,
  },
  {
    name: 'Inter',
    data: readFileSync(join(process.cwd(), 'public/fonts/Inter-Bold.woff')),
    weight: 700 as const,
    style: 'normal' as const,
  },
  {
    name: 'JetBrains Mono',
    data: readFileSync(join(process.cwd(), 'public/fonts/JetBrainsMono-Bold.woff')),
    weight: 700 as const,
    style: 'normal' as const,
  },
];

const renderToSvg = (element: unknown) =>
  satori(element as any, { width: 1200, height: 630, fonts });

function textContent(node: unknown): string[] {
  if (typeof node === 'string') return [node];
  if (Array.isArray(node)) return node.flatMap(textContent);
  if (node && typeof node === 'object' && 'props' in node) {
    return textContent((node as SatoriElement).props.children);
  }
  return [];
}

const render = (overrides: Record<string, unknown> = {}) =>
  youAsked.render({ ...youAsked.defaults, ...overrides });

function elements(node: unknown): SatoriElement[] {
  if (Array.isArray(node)) return node.flatMap(elements);
  if (node && typeof node === 'object' && 'type' in node) {
    const element = node as SatoriElement;
    return [element, ...elements(element.props.children)];
  }
  return [];
}

describe('product-you-asked', () => {
  it('is registered and re-exported', () => {
    expect(getTemplate('product-you-asked')).toBe(youAsked);
    expect(productYouAsked).toBe(youAsked);
  });

  it('renders the request card, pill, title, and site name', () => {
    expect(textContent(render())).toEqual(expect.arrayContaining([
      '“Please add a dark mode for working late”',
      'Shipped in v2.4',
      'Dark mode is here',
      'notewell.app',
    ]));
  });

  it('hides the card for blank requests while keeping the pill and title', () => {
    const empty = render({ request: '   ' });
    const content = textContent(empty);
    expect(content).toEqual(expect.arrayContaining(['Shipped in v2.4', 'Dark mode is here', 'notewell.app']));
    expect(elements(empty).some((element) => element.props.children === '“”')).toBe(false);
  });

  it('hides the vote box and vote label without a count', () => {
    const content = textContent(render({ votes: '   ' }));
    expect(content).not.toContain('248');
    expect(content).not.toContain('votes');
  });

  it('only renders the vote label when a count exists', () => {
    expect(textContent(render())).toContain('votes');
    expect(textContent(render({ voteLabel: '   ' }))).not.toContain('votes');
  });

  it('uses Shipped when the version is blank', () => {
    expect(textContent(render({ version: '   ' }))).toContain('Shipped');
    expect(textContent(render({ version: '   ' }))).not.toContain('Shipped in');
  });

  it('shrinks and truncates long titles', () => {
    const element = render({ title: 'A very long title that keeps going beyond the available width for this announcement' });
    const title = elements(element).find((item) => item.type === 'h1');
    expect(title?.props.style.fontSize).toBe('38px');
    expect(textContent(title)[0]).toMatch(/^A very long title that keeps going beyond/);
    expect(textContent(title)[0]).toMatch(/…$/);
  });

  it('truncates long requests and vote counts', () => {
    const element = render({
      request: 'This is an exceptionally long customer request that should be capped so the card remains within two lines and never pushes the title out of place.',
      votes: '123456789012345',
    });
    const content = textContent(element);
    const request = content.find((text) => text.startsWith('“')) ?? '';
    expect(request.length).toBeLessThan(132);
    expect(request).toMatch(/…”$/);
    const voteCount = content.find((text) => text.endsWith('…')) ?? '';
    expect(voteCount).toMatch(/…$/);
    expect(voteCount.length).toBeLessThanOrEqual(9);
  });

  it('uses darkened accent ink on a light background', () => {
    const element = render({ bgColor: '#ffffff', accentColor: '#E07A5F' });
    expect(() => JSON.stringify(element)).not.toThrow();
    expect(JSON.stringify(element)).toContain('#7b4334');
  });

  it('truncates very long version and siteName and renders through Satori without throwing', async () => {
    const longVersion = 'v2.4.0-experimental-preview-build-99999999';
    const longSite = 'https://subdomain.verylongdomainnameforstatuspage.example.com/status';
    const element = render({ version: longVersion, siteName: longSite });
    const content = textContent(element);

    const pill = content.find((text) => text.startsWith('Shipped')) ?? '';
    expect(pill).toMatch(/…$/);
    const versionInPill = pill.replace(/^Shipped in /, '');
    expect(versionInPill.length).toBeLessThanOrEqual(24);
    expect(versionInPill).toMatch(/…$/);

    const site = content.find((text) => text.includes('subdomain') || text.endsWith('…')) ?? '';
    expect(site.length).toBeLessThanOrEqual(40);
    expect(site).toMatch(/…$/);

    const pillSpan = elements(element).find(
      (el) => el.type === 'span' && typeof el.props.children === 'string' && el.props.children.startsWith('Shipped'),
    );
    expect(pillSpan?.props.style?.whiteSpace).toBe('nowrap');
    expect(pillSpan?.props.style?.overflow).toBe('hidden');
    expect(pillSpan?.props.style?.textOverflow).toBe('ellipsis');

    const siteSpan = elements(element).find(
      (el) => el.type === 'span' && typeof el.props.children === 'string' && el.props.children.endsWith('…'),
    );
    expect(siteSpan?.props.style?.whiteSpace).toBe('nowrap');
    expect(siteSpan?.props.style?.overflow).toBe('hidden');
    expect(siteSpan?.props.style?.textOverflow).toBe('ellipsis');

    const svg = await renderToSvg(element);
    expect(svg).toMatch(/^<svg/);
  }, 20000);

  it('truncates a long voteLabel and keeps the vote box at fixed width', async () => {
    const longLabel = 'community members who upvoted this feature';
    const element = render({ voteLabel: longLabel });
    const content = textContent(element);

    const label = content.find((text) => text.includes('community') || text.endsWith('…')) ?? '';
    expect(label).toMatch(/…$/);
    expect(label.length).toBeLessThanOrEqual(14);

    const voteBox = elements(element).find(
      (el) => el.type === 'div' && el.props.style?.width === '170px' && el.props.style?.flexShrink === 0,
    );
    expect(voteBox).toBeDefined();
    expect(voteBox?.props.style?.width).toBe('170px');

    const labelSpan = elements(voteBox).find(
      (el) => el.type === 'span' && typeof el.props.children === 'string' && el.props.children.includes('…'),
    );
    expect(labelSpan?.props.style?.whiteSpace).toBe('nowrap');
    expect(labelSpan?.props.style?.overflow).toBe('hidden');
    expect(labelSpan?.props.style?.textOverflow).toBe('ellipsis');
    expect(labelSpan?.props.style?.maxWidth).toBe('134px');

    const nodes: SatoriNode[] = [];
    const svg = await satori(element as any, {
      width: 1200,
      height: 630,
      fonts,
      onNodeDetected: (node) => nodes.push(node),
    });
    expect(svg).toMatch(/^<svg/);
    const renderedBox = nodes.find((node) => node.props?.style?.width === '170px');
    expect(renderedBox?.width).toBe(170);
  }, 20000);
});
