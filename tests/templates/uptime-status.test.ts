import { describe, it, expect } from 'vitest';
import uptimeStatus from '@/templates/saas/uptime-status';
import { getTemplate } from '@/templates/registry';
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

const tree = (overrides: Record<string, unknown> = {}) =>
  uptimeStatus.render({ ...uptimeStatus.defaults, ...overrides });
const render = (overrides: Record<string, unknown> = {}) => texts(tree(overrides));

describe('saas-uptime-status', () => {
  it('is registered in the saas category', () => {
    const registered = getTemplate('saas-uptime-status');
    expect(registered).toBeDefined();
    expect(registered?.category).toBe('saas');
    expect(registered?.name).toBe('Uptime Status');
  });

  it('renders default service name, operational status, percentage, period, and history labels', () => {
    const output = render();
    expect(output).toContain('Cloud API Platform');
    expect(output).toContain('All Systems Operational');
    expect(output).toContain('Operational');
    expect(output).toContain('99.98%');
    expect(output).toContain('Last 90 days');
    expect(output).toContain('90 days ago');
    expect(output).toContain('Today');
    expect(output).toContain('status.example.com');

    // Default accent color on SYSTEM STATUS label
    const all = elements(tree());
    const statusLabel = all.find((el) => el.props?.children === 'SYSTEM STATUS');
    expect(statusLabel?.props.style?.color).toBe('#10b981');
  });

  it('uses commonFields.title with Service Name label and uptime field with clean defaults', () => {
    const titleField = uptimeStatus.fields.find((f) => f.key === 'title');
    expect(titleField).toBeDefined();
    expect(titleField?.label).toBe('Service Name');

    const uptimeField = uptimeStatus.fields.find((f) => f.key === 'uptime');
    expect(uptimeField).toBeDefined();

    expect(uptimeStatus.defaults.title).toBe('Cloud API Platform');
    expect(uptimeStatus.defaults.uptime).toBe('99.98%');
    expect((uptimeStatus.defaults as any).serviceName).toBeUndefined();
    expect((uptimeStatus.defaults as any).uptimePercentage).toBeUndefined();
    expect(uptimeStatus.fields.find((f) => f.key === 'serviceName')).toBeUndefined();
    expect(uptimeStatus.fields.find((f) => f.key === 'uptimePercentage')).toBeUndefined();
  });

  it('renders exactly 90 status bars fitting within the content area', () => {
    const all = elements(tree());
    const bars = all.filter(
      (el) =>
        el.props.style?.width === '8px' &&
        el.props.style?.height === '42px' &&
        el.props.style?.borderRadius === '2px'
    );
    expect(bars).toHaveLength(90);
  });

  it('uses a deterministic, fixed 90-bar pattern with a few amber/red bars and mostly green bars', () => {
    const all = elements(tree({ status: 'operational' }));
    const bars = all.filter(
      (el) =>
        el.props.style?.width === '8px' &&
        el.props.style?.height === '42px'
    );
    expect(bars).toHaveLength(90);

    const greenBars = bars.filter((b) => b.props.style?.backgroundColor === '#10b981');
    const amberBars = bars.filter((b) => b.props.style?.backgroundColor === '#f59e0b');
    const redBars = bars.filter((b) => b.props.style?.backgroundColor === '#ef4444');

    expect(greenBars.length).toBe(85);
    expect(amberBars.length).toBe(3);
    expect(redBars.length).toBe(2);

    // Repeated renders yield identical results (deterministic, no Math.random)
    const tree1 = tree();
    const tree2 = tree();
    expect(tree1).toEqual(tree2);
  });

  it('updates indicator, message, and today bar when degraded status is selected', () => {
    const output = render({ status: 'degraded' });
    expect(output).toContain('Degraded Performance');
    expect(output).toContain('Degraded');

    const all = elements(tree({ status: 'degraded' }));
    const bars = all.filter(
      (el) =>
        el.props.style?.width === '8px' &&
        el.props.style?.height === '42px'
    );
    // The 90th bar (index 89, Today) should be amber (#f59e0b)
    expect(bars[89].props.style?.backgroundColor).toBe('#f59e0b');
  });

  it('updates indicator, message, and today bar when outage status is selected', () => {
    const output = render({ status: 'outage' });
    expect(output).toContain('Major Outage');
    expect(output).toContain('Outage');

    const all = elements(tree({ status: 'outage' }));
    const bars = all.filter(
      (el) =>
        el.props.style?.width === '8px' &&
        el.props.style?.height === '42px'
    );
    // The 90th bar (index 89, Today) should be red (#ef4444)
    expect(bars[89].props.style?.backgroundColor).toBe('#ef4444');
  });

  it('allows overriding the status message with a custom message', () => {
    const output = render({ statusMessage: 'Database cluster upgrade in progress' });
    expect(output).toContain('Database cluster upgrade in progress');
  });

  it('renders supplied title and uptime parameters correctly', () => {
    const output = render({ title: 'My API', uptime: '99%' });
    expect(output).toContain('My API');
    expect(output).toContain('99%');
    expect(output).not.toContain('Cloud API Platform');
    expect(output).not.toContain('99.98%');
  });

  it('renders correctly with optional text fields empty', () => {
    const output = render({
      title: '',
      statusMessage: '',
      period: '',
      siteName: '',
    });
    // Falls back to default service name
    expect(output).toContain('Cloud API Platform');
    expect(output).toContain('All Systems Operational');
    expect(output).not.toContain('status.example.com');
  });

  it('applies accentColor to the SYSTEM STATUS label', () => {
    const customAccent = '#8b5cf6';
    const all = elements(tree({ accentColor: customAccent }));
    const statusLabel = all.find((el) => el.props?.children === 'SYSTEM STATUS');
    expect(statusLabel).toBeDefined();
    expect(statusLabel?.props.style?.color).toBe(customAccent);
  });

  it('truncates long siteName values to 40 characters', () => {
    const longSite = 'https://subdomain.verylongdomainnameforstatuspage.example.com/status';
    const output = render({ siteName: longSite });
    const siteText = output.find((t) => t.startsWith('https://subdomain'));
    expect(siteText).toBeDefined();
    expect(siteText?.length).toBeLessThanOrEqual(40);
    expect(siteText?.endsWith('…')).toBe(true);
  });

  it('sets flex: 1, minWidth: 0, paddingRight on the name column and flexShrink: 0 on pills', () => {
    const all = elements(tree({ siteName: 'status.example.com' }));
    const nameColumn = all.find(
      (el) =>
        el.type === 'div' &&
        Array.isArray(el.props.children) &&
        (el.props.children as SatoriElement[]).some((child) => child?.type === 'h1')
    );
    expect(nameColumn).toBeDefined();
    expect(nameColumn?.props.style?.flex).toBe(1);
    expect(nameColumn?.props.style?.minWidth).toBe(0);
    expect(nameColumn?.props.style?.paddingRight).toBe('24px');

    const statusPill = all.find(
      (el) =>
        el.type === 'div' &&
        el.props.style?.padding === '6px 14px' &&
        el.props.style?.borderRadius === '16px'
    );
    expect(statusPill).toBeDefined();
    expect(statusPill?.props.style?.flexShrink).toBe(0);

    const sitePill = all.find(
      (el) =>
        el.type === 'div' &&
        el.props.style?.padding === '8px 16px' &&
        el.props.style?.borderRadius === '8px'
    );
    expect(sitePill).toBeDefined();
    expect(sitePill?.props.style?.flexShrink).toBe(0);
  });

  it('has root canvas dimensions of 1200x630 with display flex on all container elements', () => {
    const root = tree();
    expect(root.props.style.width).toBe('1200px');
    expect(root.props.style.height).toBe('630px');

    const all = elements(root);
    for (const el of all) {
      if (el.type === 'div') {
        expect(el.props.style?.display).toBe('flex');
      }
    }
  });
});
