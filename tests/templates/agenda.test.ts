import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import eventAgenda from '@/templates/event/agenda';
import { getTemplate } from '@/templates/registry';
import type { SatoriElement } from '@/templates/types';

const fontFiles: [file: string, name: string, weight: 400 | 500 | 600 | 700][] = [
  ['Inter-Regular.woff', 'Inter', 400],
  ['Inter-Medium.woff', 'Inter', 500],
  ['Inter-SemiBold.woff', 'Inter', 600],
  ['Inter-Bold.woff', 'Inter', 700],
  ['PlayfairDisplay-Regular.woff', 'Playfair Display', 400],
  ['PlayfairDisplay-Bold.woff', 'Playfair Display', 700],
  ['JetBrainsMono-Regular.woff', 'JetBrains Mono', 400],
  ['JetBrainsMono-Bold.woff', 'JetBrains Mono', 700],
];

const fonts = fontFiles.map(([file, name, weight]) => ({
  name,
  data: readFileSync(join(process.cwd(), 'public/fonts', file)),
  weight,
  style: 'normal' as const,
}));

const renderToSvg = (element: unknown) =>
  satori(element as any, { width: 1200, height: 630, fonts });

/** Every string rendered anywhere in the element tree, in order. */
function texts(node: unknown): string[] {
  if (typeof node === 'string') return [node];
  if (Array.isArray(node)) return node.flatMap(texts);
  if (node && typeof node === 'object' && 'props' in node) {
    return texts((node as SatoriElement).props.children);
  }
  return [];
}

/** Recursively counts nodes matching a predicate. */
function countNodes(node: unknown, predicate: (element: SatoriElement) => boolean): number {
  if (!node || typeof node !== 'object') return 0;
  let count = 0;
  if ('props' in node) {
    const el = node as SatoriElement;
    if (predicate(el)) count++;
    const children = el.props.children;
    if (Array.isArray(children)) {
      for (const child of children) {
        count += countNodes(child, predicate);
      }
    } else if (children && typeof children === 'object') {
      count += countNodes(children, predicate);
    }
  }
  return count;
}

const render = (overrides: Record<string, unknown> = {}) =>
  texts(eventAgenda.render({ ...eventAgenda.defaults, ...overrides }));

describe('event-agenda template', () => {
  it('is registered in the event category', () => {
    const template = getTemplate('event-agenda');
    expect(template).toBeDefined();
    expect(template?.id).toBe('event-agenda');
    expect(template?.category).toBe('event');
    expect(template?.name).toBe('Agenda');
  });

  it('has 4-6 relevant tags and valid description', () => {
    expect(eventAgenda.tags.length).toBeGreaterThanOrEqual(4);
    expect(eventAgenda.tags.length).toBeLessThanOrEqual(6);
    expect(eventAgenda.description).toBeTruthy();
  });

  it('contains all required field definitions', () => {
    const fieldKeys = eventAgenda.fields.map((f) => f.key);
    expect(fieldKeys).toEqual(
      expect.arrayContaining([
        'title',
        'date',
        'location',
        'session1Time',
        'session1Title',
        'session2Time',
        'session2Title',
        'session3Time',
        'session3Title',
        'session4Time',
        'session4Title',
        'siteName',
        'bgColor',
        'accentColor',
        'textColor',
      ]),
    );
  });

  it('renders all 4 sessions by default', () => {
    const output = render();
    expect(output).toContain('09:00 AM');
    expect(output).toContain('Keynote: The Future of Web');
    expect(output).toContain('10:30 AM');
    expect(output).toContain('Building Resilient Systems');
    expect(output).toContain('01:30 PM');
    expect(output).toContain('Hands-on Deep Dive Workshop');
    expect(output).toContain('03:45 PM');
    expect(output).toContain('Closing Panel & Discussion');
  });

  it('renders 3 sessions when session 4 is empty', () => {
    const output = render({ session4Time: '', session4Title: '' });
    expect(output).toContain('Keynote: The Future of Web');
    expect(output).toContain('Building Resilient Systems');
    expect(output).toContain('Hands-on Deep Dive Workshop');
    expect(output).not.toContain('Closing Panel & Discussion');
    expect(output).not.toContain('03:45 PM');
  });

  it('renders 2 sessions when sessions 3 and 4 are empty', () => {
    const output = render({
      session3Time: '',
      session3Title: '',
      session4Time: '',
      session4Title: '',
    });
    expect(output).toContain('09:00 AM');
    expect(output).toContain('Keynote: The Future of Web');
    expect(output).toContain('10:30 AM');
    expect(output).toContain('Building Resilient Systems');
    expect(output).not.toContain('01:30 PM');
    expect(output).not.toContain('03:45 PM');
  });

  it('skips empty sessions in between gracefully', () => {
    const output = render({
      session2Time: '',
      session2Title: '',
      session3Time: '02:00 PM',
      session3Title: 'Afternoon Lab',
      session4Time: '',
      session4Title: '',
    });
    expect(output).toContain('09:00 AM');
    expect(output).toContain('Keynote: The Future of Web');
    expect(output).not.toContain('Building Resilient Systems');
    expect(output).toContain('02:00 PM');
    expect(output).toContain('Afternoon Lab');
  });

  it('hides optional date, location, and siteName when empty', () => {
    const output = render({
      date: '',
      location: '',
      siteName: '',
    });
    expect(output).not.toContain('Oct 24, 2026');
    expect(output).not.toContain('San Francisco, CA');
    expect(output).not.toContain('techsummit.io');
    expect(output).toContain('Tech Summit 2026');
  });

  it('truncates long titles and session titles', () => {
    const longTitle = 'Super Scalable Global Enterprise Architecture World Conference 2026 Edition';
    const longSessionTitle =
      'A Comprehensive Deep Dive Into Distributed Transaction Coordination Across Multi-Cloud Regions';
    const output = render({
      title: longTitle,
      session1Title: longSessionTitle,
    });
    expect(output.some((t) => t.includes('…'))).toBe(true);
  });

  it('makes the timeline line end at the last rendered session (N - 1 line segments)', () => {
    // 4 sessions: 3 connecting line segments
    const el4 = eventAgenda.render(eventAgenda.defaults);
    const lines4 = countNodes(
      el4,
      (node) =>
        node.props?.style?.width === '2px' &&
        node.props?.style?.flex === 1,
    );
    expect(lines4).toBe(3);

    // 3 sessions: 2 connecting line segments
    const el3 = eventAgenda.render({
      ...eventAgenda.defaults,
      session4Time: '',
      session4Title: '',
    });
    const lines3 = countNodes(
      el3,
      (node) =>
        node.props?.style?.width === '2px' &&
        node.props?.style?.flex === 1,
    );
    expect(lines3).toBe(2);

    // 2 sessions: 1 connecting line segment
    const el2 = eventAgenda.render({
      ...eventAgenda.defaults,
      session3Time: '',
      session3Title: '',
      session4Time: '',
      session4Title: '',
    });
    const lines2 = countNodes(
      el2,
      (node) =>
        node.props?.style?.width === '2px' &&
        node.props?.style?.flex === 1,
    );
    expect(lines2).toBe(1);

    // 1 session: 0 connecting line segments
    const el1 = eventAgenda.render({
      ...eventAgenda.defaults,
      session2Time: '',
      session2Title: '',
      session3Time: '',
      session3Title: '',
      session4Time: '',
      session4Title: '',
    });
    const lines1 = countNodes(
      el1,
      (node) =>
        node.props?.style?.width === '2px' &&
        node.props?.style?.flex === 1,
    );
    expect(lines1).toBe(0);
  });

  it('ensures display: flex on every div element', () => {
    const element = eventAgenda.render(eventAgenda.defaults);
    const nonFlexDivs = countNodes(
      element,
      (node) => node.type === 'div' && node.props?.style?.display !== 'flex',
    );
    expect(nonFlexDivs).toBe(0);
  });

  it('renders valid SVG and PNG for 2, 3, and 4 sessions', async () => {
    // 4 sessions
    const svg4 = await renderToSvg(eventAgenda.render(eventAgenda.defaults));
    expect(svg4).toMatch(/^<svg/);
    const png4 = new Resvg(svg4).render().asPng();
    expect(png4[0]).toBe(0x89);
    expect(png4[1]).toBe(0x50); // P
    expect(png4[2]).toBe(0x4e); // N
    expect(png4[3]).toBe(0x47); // G

    // 3 sessions
    const svg3 = await renderToSvg(
      eventAgenda.render({
        ...eventAgenda.defaults,
        session4Time: '',
        session4Title: '',
      }),
    );
    expect(svg3).toMatch(/^<svg/);
    const png3 = new Resvg(svg3).render().asPng();
    expect(png3[0]).toBe(0x89);

    // 2 sessions
    const svg2 = await renderToSvg(
      eventAgenda.render({
        ...eventAgenda.defaults,
        session3Time: '',
        session3Title: '',
        session4Time: '',
        session4Title: '',
      }),
    );
    expect(svg2).toMatch(/^<svg/);
    const png2 = new Resvg(svg2).render().asPng();
    expect(png2[0]).toBe(0x89);
  });
});
