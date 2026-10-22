import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import developerDayStreak from '@/templates/developer/day-streak';
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

const renderSvg = (element: unknown) =>
  satori(element as any, { width: 1200, height: 630, fonts });

/** Recursively collects every element in the tree. */
function elements(node: unknown): SatoriElement[] {
  if (Array.isArray(node)) return node.flatMap(elements);
  if (node && typeof node === 'object' && 'props' in node) {
    const el = node as SatoriElement;
    return [el, ...elements(el.props.children)];
  }
  return [];
}

/** Recursively collects every string rendered anywhere in the element tree. */
function texts(node: unknown): string[] {
  if (typeof node === 'string') return [node];
  if (Array.isArray(node)) return node.flatMap(texts);
  if (node && typeof node === 'object' && 'props' in node) {
    return texts((node as SatoriElement).props.children);
  }
  return [];
}

const tree = (overrides: Record<string, unknown> = {}) =>
  developerDayStreak.render({ ...developerDayStreak.defaults, ...overrides });

describe('developer-day-streak template', () => {
  it('is registered in the developer category with valid metadata', () => {
    const t = getTemplate('developer-day-streak');
    expect(t).toBeDefined();
    expect(t?.category).toBe('developer');
    expect(t?.id).toBe('developer-day-streak');
    expect(t?.name).toBe('Day Streak');
    expect(t?.description).toBeTruthy();
    expect(t?.tags.length).toBeGreaterThanOrEqual(4);
    expect(t?.tags.length).toBeLessThanOrEqual(6);
  });

  it('renders a root container with width 1200px and height 630px', () => {
    const root = tree();
    expect(root.props.style?.width).toBe('1200px');
    expect(root.props.style?.height).toBe('630px');
  });

  it('ensures every div in the tree has display: flex', () => {
    const allDivs = elements(tree()).filter((el) => el.type === 'div');
    expect(allDivs.length).toBeGreaterThan(0);
    for (const div of allDivs) {
      expect(div.props.style?.display).toBe('flex');
    }
  });

  describe('defensive parsing of currentDay and totalDays', () => {
    it('uses defaults when values are not numbers or non-finite', () => {
      const rendered = texts(tree({ currentDay: 'not-a-number', totalDays: 'invalid' }));
      expect(rendered).toContain('Day 42');
      expect(rendered).toContain('of 100');
    });

    it('clamps totalDays between 1 and 100', () => {
      // Below 1
      const under = texts(tree({ totalDays: 0, currentDay: 0 }));
      expect(under).toContain('of 1');
      expect(under).toContain('Day 1');

      // Above 100
      const over = texts(tree({ totalDays: 250, currentDay: 80 }));
      expect(over).toContain('of 100');
      expect(over).toContain('Day 80');
    });

    it('clamps currentDay between 1 and totalDays', () => {
      // currentDay greater than totalDays
      const over = texts(tree({ totalDays: 30, currentDay: 42 }));
      expect(over).toContain('Day 30');
      expect(over).toContain('of 30');

      // currentDay less than 1
      const under = texts(tree({ totalDays: 50, currentDay: -5 }));
      expect(under).toContain('Day 1');
      expect(under).toContain('of 50');
    });

    it('handles numeric string inputs correctly', () => {
      const rendered = texts(tree({ currentDay: '66', totalDays: '75' }));
      expect(rendered).toContain('Day 66');
      expect(rendered).toContain('of 75');
    });
  });

  describe('grid squares styling and layout', () => {
    it('renders exactly totalDays squares', () => {
      const squares100 = elements(tree({ totalDays: 100 })).filter(
        (el) => el.type === 'div' && el.props.style?.width === '36px' && el.props.style?.height === '36px' && !el.props.style?.border?.includes('1.5px')
      );
      expect(squares100).toHaveLength(100);

      const squares30 = elements(tree({ totalDays: 30 })).filter(
        (el) => el.type === 'div' && el.props.style?.width === '36px' && el.props.style?.height === '36px' && !el.props.style?.border?.includes('1.5px')
      );
      expect(squares30).toHaveLength(30);
    });

    it('differentiates past, today, and future squares correctly', () => {
      const currentDay = 42;
      const totalDays = 100;
      const allSquares = elements(tree({ currentDay, totalDays })).filter(
        (el) => el.type === 'div' && el.props.style?.width === '36px' && el.props.style?.height === '36px' && !el.props.style?.border?.includes('1.5px')
      );

      // Past days: day < 42 (41 days) -> filled with accent color, no bright ring
      const pastSquares = allSquares.filter(
        (el) => el.props.style?.backgroundColor === '#E07A5F' && !el.props.style?.border?.includes('3px solid')
      );
      expect(pastSquares).toHaveLength(41);

      // Today's square: day 42 (1 day) -> filled with accent color and gets a brighter ring
      const todaySquares = allSquares.filter(
        (el) => el.props.style?.backgroundColor === '#E07A5F' && el.props.style?.border?.includes('3px solid')
      );
      expect(todaySquares).toHaveLength(1);

      // Later days: day > 42 (58 days) -> faint outline, transparent background
      const futureSquares = allSquares.filter(
        (el) => el.props.style?.backgroundColor === 'transparent' && el.props.style?.border?.includes('2px solid')
      );
      expect(futureSquares).toHaveLength(58);
    });

    it('does not set alignContent: center on the wrapping grid (per #159)', () => {
      const wrappingGrid = elements(tree()).find(
        (el) => el.type === 'div' && el.props.style?.flexWrap === 'wrap'
      );
      expect(wrappingGrid).toBeDefined();
      expect(wrappingGrid?.props.style?.alignContent).toBeUndefined();
    });

    it('renders cleanly and generates valid SVG and PNG for 7, 30, 66, and 100 days', async () => {
      for (const days of [7, 30, 66, 100]) {
        const rendered = tree({ totalDays: days, currentDay: Math.min(42, days) });
        const svg = await renderSvg(rendered);
        expect(svg).toMatch(/^<svg/);
        const png = new Resvg(svg).render().asPng();
        expect(png[0]).toBe(0x89);
        expect(png[1]).toBe(0x50); // P
        expect(png[2]).toBe(0x4e); // N
        expect(png[3]).toBe(0x47); // G
      }
    });
  });

  describe('edge cases and light background support', () => {
    it('renders cleanly with optional author empty', async () => {
      const rendered = tree({ author: '' });
      expect(rendered.type).toBe('div');
      const textList = texts(rendered);
      expect(textList).not.toContain('Alex Morgan');
      const svg = await renderSvg(rendered);
      expect(svg).toMatch(/^<svg/);
    });

    it('truncates very long challenge title and author', () => {
      const longTitle = '100 Days of Building Distributed Systems with Kubernetes, Rust and Cloudflare Workers';
      const longAuthor = 'Dr. Alexander Bartholomew Montgomery III of Highclere';
      const textList = texts(tree({ title: longTitle, author: longAuthor }));
      expect(textList.some((t) => t.includes('…'))).toBe(true);
    });

    it('renders cleanly on a white background with dark text', async () => {
      const rendered = tree({
        bgColor: '#ffffff',
        textColor: '#111827',
        accentColor: '#0969da',
      });
      expect(rendered.props.style?.backgroundColor).toBe('#ffffff');
      const svg = await renderSvg(rendered);
      expect(svg).toMatch(/^<svg/);
    });
  });
});
