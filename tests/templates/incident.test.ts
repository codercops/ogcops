import { describe, expect, it } from 'vitest';
import incident from '@/templates/saas/incident';
import { getTemplate } from '@/templates/registry';
import type { SatoriElement } from '@/templates/types';

const STEP_LABELS = ['Investigating', 'Identified', 'Monitoring', 'Resolved'];

function elements(node: unknown): SatoriElement[] {
  if (Array.isArray(node)) return node.flatMap(elements);
  if (!node || typeof node !== 'object' || !('type' in node)) return [];

  const element = node as SatoriElement;
  return [element, ...elements(element.props.children)];
}

// Structural placeholders (empty `children`) are skipped so the text reads in order.
function textContent(node: unknown): string[] {
  if (typeof node === 'string') return node === '' ? [] : [node];
  if (Array.isArray(node)) return node.flatMap(textContent);
  if (node && typeof node === 'object' && 'props' in node) {
    return textContent((node as SatoriElement).props.children);
  }
  return [];
}

const render = (overrides: Record<string, unknown> = {}) =>
  incident.render({ ...incident.defaults, ...overrides });

/** The circle marker for each step, in order. */
const markers = (node: unknown) =>
  elements(node).filter((element) => element.type === 'div' &&
    element.props.style?.width === '30px' && element.props.style?.height === '30px');

/** The connector between each pair of steps, in order. */
const connectors = (node: unknown) =>
  elements(node).filter((element) => element.type === 'div' &&
    element.props.style?.height === '2px' && element.props.style?.flex === 1);

describe('saas-incident', () => {
  it('is registered in the saas category and re-exported', async () => {
    expect(getTemplate('saas-incident')?.category).toBe('saas');
    const exports = await import('@/templates/saas');
    expect(exports.saasIncident.id).toBe('saas-incident');
  });

  it('renders the label, title, all four steps, the update, the start and the site name', () => {
    expect(textContent(render())).toEqual([
      'Incident',
      'Elevated API error rates',
      ...STEP_LABELS,
      'A fix is rolling out to all regions',
      'Started 14:05 UTC',
      'status.acme.dev',
    ]);
  });

  it('fills the steps up to the current status and leaves the rest empty', () => {
    const filled = (status: string) => markers(render({ status })).map((marker) =>
      marker.props.style?.backgroundColor !== 'transparent');

    expect(filled('investigating')).toEqual([true, false, false, false]);
    expect(filled('identified')).toEqual([true, true, false, false]);
    expect(filled('monitoring')).toEqual([true, true, true, false]);
    expect(filled('resolved')).toEqual([true, true, true, true]);
  });

  it('fills a connector only once the next step is reached', () => {
    const connectorColors = (status: string) =>
      connectors(render({ status })).map((connector) => connector.props.style?.backgroundColor);

    // Identified: one connector filled, the other two still muted
    const identified = connectorColors('identified');
    expect(identified).toHaveLength(3);
    expect(identified[0]).not.toMatch(/1F$/);
    expect(identified[1]).toMatch(/1F$/);
    expect(identified[2]).toMatch(/1F$/);

    // Resolved: every connector filled
    expect(connectorColors('resolved').filter((color) => !String(color).match(/1F$/))).toHaveLength(3);
  });

  it('falls back to the default step for an unknown or blank status', () => {
    const filled = (status: string) => markers(render({ status })).map((marker) =>
      marker.props.style?.backgroundColor !== 'transparent');

    expect(filled('nonsense')).toEqual(filled('identified'));
    expect(filled('   ')).toEqual(filled('identified'));
    expect(filled('RESOLVED')).toEqual([true, true, true, true]);
  });

  it('falls back for names every object inherits instead of filling nothing', () => {
    const filled = (status: string) => markers(render({ status })).map((marker) =>
      marker.props.style?.backgroundColor !== 'transparent');

    // `STATUS_INDEX['constructor']` finds Object.prototype.constructor without the
    // own-property guard, which used to render a card with no steps filled at all.
    expect(filled('constructor')).toEqual([true, true, false, false]);
    expect(filled('toString')).toEqual([true, true, false, false]);
    expect(filled('hasOwnProperty')).toEqual([true, true, false, false]);
    expect(filled('__proto__')).toEqual([true, true, false, false]);
  });

  it('shrinks a long title with autoFontSize and then truncates it', () => {
    const heading = elements(render({
      title: 'Elevated API error rates across the EU and US regions affecting uploads and webhooks',
    })).find((element) => element.type === 'h1');

    expect(textContent(heading)[0]).toHaveLength(60);
    expect(textContent(heading)[0]).toMatch(/…$/);
    expect(heading?.props.style?.fontSize).toBe('42px');
  });

  it('hides a blank update, start and site name cleanly', () => {
    expect(textContent(render({ update: '  ', started: '', siteName: ' ' }))).toEqual([
      'Incident',
      'Elevated API error rates',
      ...STEP_LABELS,
    ]);
  });

  it('keeps the separator out when only one of the start and site name is set', () => {
    const dots = (params: Record<string, unknown>) => elements(render(params)).filter((element) =>
      element.type === 'div' && element.props.style?.width === '4px' && element.props.style?.height === '4px');

    expect(dots({ started: ' ' })).toHaveLength(0);
    expect(dots({ siteName: '' })).toHaveLength(0);
    expect(dots({})).toHaveLength(1);
  });

  it('keeps the label, the reached steps and the start readable on a light background', () => {
    const dark = render();
    const light = render({ bgColor: '#ffffff', textColor: '#111111', accentColor: '#fde047' });

    const label = (node: unknown) => elements(node).find((element) =>
      element.type === 'span' && textContent(element)[0] === 'Incident');
    const started = (node: unknown) => elements(node).find((element) =>
      element.type === 'span' && textContent(element)[0] === 'Started 14:05 UTC');

    expect(label(dark)?.props.style?.color).toBe('#E07A5F');
    expect(label(light)?.props.style?.color).toBe('#8b7b27');
    expect(started(dark)?.props.style?.color).toBe('#E07A5F');
    expect(started(light)?.props.style?.color).toBe('#8b7b27');

    // The reached markers take the darkened accent, the unreached ones stay muted
    const lightMarkers = markers(light).map((marker) => marker.props.style?.backgroundColor);
    expect(lightMarkers[0]).toBe('#8b7b27');
    expect(lightMarkers[3]).toBe('transparent');
  });
});
