import { describe, expect, it } from 'vitest';
import prerequisites from '@/templates/tutorial/prerequisites';
import { getTemplate } from '@/templates/registry';
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
  prerequisites.render({ ...prerequisites.defaults, ...overrides });

describe('tutorial-prerequisites', () => {
  it('is registered in the tutorial category and re-exported', async () => {
    expect(getTemplate('tutorial-prerequisites')?.category).toBe('tutorial');
    const exports = await import('@/templates/tutorial');
    expect(exports.tutorialPrerequisites.id).toBe('tutorial-prerequisites');
  });

  it('renders the label, title, the three prerequisites in order, and the time estimate', () => {
    expect(textContent(render())).toEqual([
      'Before you start',
      'Build a REST API with Hono',
      'Node 20 or newer',
      'Basic TypeScript',
      'A free Cloudflare account',
      'About 45 minutes',
    ]);
  });

  it('skips empty and whitespace-only items without changing the remaining order', () => {
    expect(textContent(render({
      item1: '  Node 20 or newer  ',
      item2: ' ',
      item3: 'A free Cloudflare account',
    }))).toEqual([
      'Before you start',
      'Build a REST API with Hono',
      'Node 20 or newer',
      'A free Cloudflare account',
      'About 45 minutes',
    ]);
  });

  it('truncates long items while allowing their text to wrap', () => {
    const longItem = 'A Cloudflare account with a verified email address and access to the Workers dashboard for deploying the finished project';
    const rendered = render({ item1: longItem });
    const itemText = elements(rendered).find((element) => element.type === 'span' &&
      textContent(element).some((text) => text.startsWith('A Cloudflare account with')));

    expect(textContent(itemText)[0]).toHaveLength(72);
    expect(textContent(itemText)[0]).toMatch(/^A Cloudflare account with/);
    expect(textContent(itemText)[0]).toMatch(/…$/);
    expect(itemText?.props.style?.overflowWrap).toBe('anywhere');
    expect(itemText?.props.style?.flex).toBe(1);
  });

  it('draws each check as inline SVG and keeps the mark readable on a light canvas', () => {
    const rendered = elements(render({
      bgColor: '#ffffff',
      accentColor: '#fde047',
      textColor: '#111111',
    }));
    const icons = rendered.filter((element) => element.type === 'svg');

    expect(icons).toHaveLength(3);
    expect(JSON.stringify(icons[0])).toContain('#8b7b27');
    expect(JSON.stringify(icons[0])).toContain('"type":"path"');
    expect(JSON.stringify(icons[0])).not.toContain('✅');
  });

  it('hides a blank time estimate cleanly', () => {
    expect(textContent(render({ duration: '   ' }))).not.toContain('About 45 minutes');
  });
});
