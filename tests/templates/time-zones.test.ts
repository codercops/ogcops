import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import satori from 'satori';
import timeZones from '@/templates/event/time-zones';
import { eventTimeZones } from '@/templates/event';
import { getTemplate } from '@/templates/registry';
import { mixColors } from '@/templates/utils';
import type { SatoriElement } from '@/templates/types';

const fontFiles: [file: string, name: string, weight: 400 | 500 | 600 | 700][] = [
  ['Inter-Regular.woff', 'Inter', 400],
  ['Inter-Medium.woff', 'Inter', 500],
  ['Inter-SemiBold.woff', 'Inter', 600],
  ['Inter-Bold.woff', 'Inter', 700],
];

const fonts = fontFiles.map(([file, name, weight]) => ({
  name,
  data: readFileSync(join(process.cwd(), 'public/fonts', file)),
  weight,
  style: 'normal' as const,
}));

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

function elements(node: unknown): SatoriElement[] {
  if (Array.isArray(node)) return node.flatMap(elements);
  if (node && typeof node === 'object' && 'type' in node) {
    const element = node as SatoriElement;
    return [element, ...elements(element.props.children)];
  }
  return [];
}

const boxes = (element: unknown) =>
  elements(element).filter((el) => String(el.props.style?.borderTop ?? '').includes('3px solid'));

const citySpans = (element: unknown) =>
  elements(element).filter((el) => el.props.style?.fontSize === '18px');

const timeSpans = (element: unknown) =>
  elements(element).filter(
    (el) => el.props.style?.whiteSpace === 'nowrap' && el.props.style?.fontWeight === 700,
  );

const render = (overrides: Record<string, unknown> = {}) =>
  timeZones.render({ ...timeZones.defaults, ...overrides });

describe('event-time-zones template', () => {
  it('is registered and re-exported properly', () => {
    const registered = getTemplate('event-time-zones');
    expect(registered).toBe(timeZones);
    expect(eventTimeZones).toBe(timeZones);
    expect(registered?.category).toBe('event');
    expect(registered?.name).toBe('Time Zones');
  });

  it('has a description and 4 to 6 relevant tags', () => {
    expect(timeZones.description).toBeTruthy();
    expect(timeZones.tags.length).toBeGreaterThanOrEqual(4);
    expect(timeZones.tags.length).toBeLessThanOrEqual(6);
    expect(timeZones.tags).toContain('timezones');
  });

  it('contains all required field definitions', () => {
    const fieldKeys = timeZones.fields.map((field) => field.key);
    expect(fieldKeys).toEqual(
      expect.arrayContaining([
        'title',
        'date',
        'city1',
        'time1',
        'city2',
        'time2',
        'city3',
        'time3',
        'city4',
        'time4',
        'note',
        'siteName',
        'bgColor',
        'accentColor',
        'textColor',
      ]),
    );
  });

  it('renders all four city boxes with defaults', () => {
    const texts = textContent(render());
    expect(texts).toContain('Open Source Office Hours: Live Q&A');
    expect(texts).toContain('Thursday, March 12');
    expect(texts).toContain('San Francisco');
    expect(texts).toContain('New York');
    expect(texts).toContain('London');
    expect(texts).toContain('Bangalore');
    expect(texts).toContain('9:00 AM');
    expect(texts).toContain('12:00 PM');
    expect(texts).toContain('5:00 PM');
    expect(texts).toContain('10:30 PM');
    expect(texts).toContain('Online, free to join');
    expect(boxes(render())).toHaveLength(4);
  });

  it('skips a box with a blank time and lets remaining boxes share the row', () => {
    const withBlank = render({ time2: '' });
    expect(boxes(withBlank)).toHaveLength(3);
    expect(citySpans(withBlank)).toHaveLength(3);
    expect(textContent(withBlank)).not.toContain('New York');
    expect(textContent(withBlank)).not.toContain('12:00 PM');

    const twoCities = render({ time3: '', time4: '' });
    const twoBoxes = boxes(twoCities);
    expect(twoBoxes).toHaveLength(2);
    expect(twoBoxes.every((box) => box.props.style.flex === 1)).toBe(true);
  });

  it('renders a time without a city label', () => {
    const element = render({ city1: '' });
    expect(boxes(element)).toHaveLength(4);
    expect(citySpans(element)).toHaveLength(3);
    expect(timeSpans(element)).toHaveLength(4);
    expect(textContent(element)).toContain('9:00 AM');
    expect(boxes(element)[0].props.children).toHaveLength(1);
  });

  it('omits the row entirely when there are no times', () => {
    const element = render({ time1: '', time2: '', time3: '', time4: '' });
    expect(boxes(element)).toHaveLength(0);
    const texts = textContent(element);
    expect(texts).not.toContain('San Francisco');
    expect(texts).not.toContain('9:00 AM');
  });

  it('sizes the long title before truncating it', () => {
    const longTitle =
      'Open Source Office Hours: Live Q&A With Maintainers, Contributors, and Friends From Around the World';
    const element = render({ title: longTitle });
    const heading = elements(element).find((el) => el.type === 'h1');
    const text = textContent(heading)[0];
    expect(text.endsWith('…')).toBe(true);
    expect(text.length).toBeLessThanOrEqual(90);
    expect(heading?.props.style.fontSize).toBe('32px');
  });

  it('truncates a long city name inside its box', () => {
    const element = render({ city1: 'A Really Long City Name That Keeps Going' });
    const label = textContent(citySpans(element)[0])[0];
    expect(label.endsWith('…')).toBe(true);
    expect(label.length).toBeLessThanOrEqual(18);
  });

  it('keeps an eight character time on one line in a four box row', () => {
    const element = render();
    const times = timeSpans(element);
    expect(times).toHaveLength(4);
    for (const time of times) {
      expect(time.props.style.whiteSpace).toBe('nowrap');
      expect(time.props.style.fontSize).toBe('40px');
    }
    expect(textContent(times[3])[0]).toBe('10:30 PM');
  });

  it('uses a darkened accent so times stay legible on a light background', () => {
    const element = render({ bgColor: '#ffffff', textColor: '#111111' });
    const expectedAccent = mixColors('#38bdf8', '#000000', 0.35);
    expect(timeSpans(element)[0].props.style.color).toBe(expectedAccent);
  });

  it('pins the site name to the bottom when provided', () => {
    const element = render({ siteName: 'acme.dev' });
    const site = elements(element).find((el) => textContent(el)[0] === 'acme.dev');
    expect(site?.props.style.marginTop).toBe('auto');
  });

  it('renders defaults and a light variant to SVG', async () => {
    await expect(renderToSvg(render())).resolves.toMatch(/^<svg/);
    await expect(
      renderToSvg(render({ bgColor: '#ffffff', textColor: '#111111' })),
    ).resolves.toMatch(/^<svg/);
  });
});
