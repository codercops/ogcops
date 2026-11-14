import { describe, expect, it } from 'vitest';
import buildInPublic from '@/templates/developer/build-in-public';
import { developerBuildInPublic } from '@/templates/developer';
import { getTemplate, getTemplatesByCategory } from '@/templates/registry';
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
  buildInPublic.render({ ...buildInPublic.defaults, ...overrides });

describe('developer-build-in-public', () => {
  it('is re-exported and registered once in the developer category', () => {
    expect(developerBuildInPublic).toBe(buildInPublic);
    expect(getTemplate('developer-build-in-public')).toBe(buildInPublic);
    expect(getTemplatesByCategory('developer').filter(({ id }) => id === 'developer-build-in-public')).toHaveLength(1);
  });

  it('renders defaults with title, period pill, metric value, label, green change chip, note, site name, and 6 bars', () => {
    const tree = render();
    const text = textContent(tree);

    expect(text).toContain('Invoice Kit');
    expect(text).toContain('Month 7');
    expect(text).toContain('$2,480');
    expect(text).toContain('MRR');
    expect(text).toContain('+18% from last month');
    expect(text).toContain('312 paying customers, 2.1% churn');
    expect(text).toContain('codercops.com');

    // Find the chart container and bars
    const allDivs = elements(tree);
    const bars = allDivs.filter((el) => el.props.style?.width === '42px');
    expect(bars).toHaveLength(6);

    // Last bar should be accent color
    const lastBar = bars[5];
    expect(lastBar.props.style?.backgroundColor).toBe('#34d399');

    // Change chip should have green background in default dark mode
    const chip = allDivs.find((el) => textContent(el).includes('+18% from last month') && el.props.style?.borderRadius === '8px');
    expect(chip).toBeDefined();
    expect(chip?.props.style?.backgroundColor).toBe('#052e16');
  });

  it('handles negative, non-numeric, trailing commas, and keeps only the last 6 entries', () => {
    const tree = render({
      history: '100, 200, 300, invalid, -50, , 400, 500, 600, 700, 800, 900,',
    });
    const bars = elements(tree).filter((el) => el.props.style?.width === '42px');
    expect(bars).toHaveLength(6);

    // The last 6 validly sliced entries from [100, 200, 300, 0, 0, 400, 500, 600, 700, 800, 900] are [400, 500, 600, 700, 800, 900]
    // 900 is the largest, so height is CHART_HEIGHT (200px)
    expect(bars[5].props.style?.height).toBe('200px');
  });

  it('renders short equal stubs when all values in history are 0 instead of disappearing', () => {
    const tree = render({
      history: '0, 0, 0, 0, 0, 0',
    });
    const bars = elements(tree).filter((el) => el.props.style?.width === '42px');
    expect(bars).toHaveLength(6);
    for (const bar of bars) {
      expect(bar.props.style?.height).toBe('12px');
    }
  });

  it('hides the chart completely and lets the left column take full width when history is empty', () => {
    const tree = render({ history: '' });
    const bars = elements(tree).filter((el) => el.props.style?.width === '42px');
    expect(bars).toHaveLength(0);

    const leftCol = elements(tree).find((el) => el.props.style?.flex === '1 1 100%');
    expect(leftCol).toBeDefined();
  });

  it('hides period, metricLabel, change, and note cleanly without leaving empty containers', () => {
    const tree = render({
      period: '',
      metricLabel: '',
      change: '',
      note: '',
    });
    const text = textContent(tree);

    expect(text).not.toContain('Month 7');
    expect(text).not.toContain('MRR');
    expect(text).not.toContain('+18% from last month');
    expect(text).not.toContain('312 paying customers, 2.1% churn');
    expect(text).toContain('Invoice Kit');
    expect(text).toContain('$2,480');
  });

  it('formats red change chip when change starts with - and neutral otherwise', () => {
    const redTree = render({ change: '-5% churn spike' });
    const redChip = elements(redTree).find((el) => textContent(el).includes('-5% churn spike') && el.props.style?.borderRadius === '8px');
    expect(redChip?.props.style?.backgroundColor).toBe('#450a0a');

    const neutralTree = render({ change: 'steady this month' });
    const neutralChip = elements(neutralTree).find((el) => textContent(el).includes('steady this month') && el.props.style?.borderRadius === '8px');
    expect(neutralChip?.props.style?.backgroundColor).not.toBe('#450a0a');
    expect(neutralChip?.props.style?.backgroundColor).not.toBe('#052e16');
  });

  it('renders cleanly on light backgrounds with readable colors', () => {
    const tree = render({
      bgColor: '#ffffff',
      textColor: '#111827',
      accentColor: '#10b981',
      change: '+25% ARR',
    });
    const allDivs = elements(tree);
    const chip = allDivs.find((el) => textContent(el).includes('+25% ARR') && el.props.style?.borderRadius === '8px');
    expect(chip?.props.style?.backgroundColor).toBe('#dcfce7');
    expect(chip?.props.style?.color).toBe('#15803d');
  });

  it('handles long title, large metric value, and long note without breaking layout', () => {
    const tree = render({
      title: 'A Very Long Product Project Name That Exceeds Normal Limits',
      metricValue: '$1,250,000',
      note: 'A very long explanatory note describing customer growth and retention across all subscription tiers in detail',
    });
    const text = textContent(tree);
    expect(text.some((t) => t.includes('$1,250,000'))).toBe(true);
  });
});
