import { describe, expect, it } from 'vitest';
import maintenance from '@/templates/saas/maintenance';
import { getTemplate } from '@/templates/registry';

const render = (overrides: Record<string, unknown> = {}) => maintenance.render({ ...maintenance.defaults, ...overrides });
const serialized = (overrides: Record<string, unknown> = {}) => JSON.stringify(render(overrides));

describe('saas-maintenance', () => {
  it('is registered and renders the default notice', () => {
    expect(getTemplate('saas-maintenance')).toBe(maintenance);
    const tree = serialized();
    expect(tree).toContain('Scheduled maintenance');
    expect(tree).toContain('Database upgrade');
    expect(tree).toContain('Sat, Nov 1, 02:00 to 04:00 UTC');
    expect(tree).toContain('Webhooks');
  });

  it('sets the pill text from the status', () => {
    expect(serialized({ status: 'in-progress' })).toContain('Maintenance in progress');
    expect(serialized({ status: 'completed' })).toContain('Maintenance completed');
  });

  it.each(['abc', '__proto__', ''])('falls back to Scheduled for status %j', (status) => {
    expect(render({ status })).toEqual(render({ status: 'scheduled' }));
  });

  it('shows at most four service chips plus a +N more chip', () => {
    const tree = serialized({ services: 'API, Dashboard, Webhooks, Auth, Billing, Search' });
    expect(tree).toContain('Auth');
    expect(tree).not.toContain('Billing');
    expect(tree).toContain('+2 more');
    expect(serialized({ services: 'API, Dashboard, Webhooks, Auth' })).not.toContain('more');
  });

  it('hides empty time window, impact and services', () => {
    const tree = serialized({ timeWindow: ' ', impact: '', services: ' , ' });
    expect(tree).not.toContain('UTC');
    expect(tree).not.toContain('read-only');
    expect(tree).not.toContain('"flexWrap":"wrap"');
  });

  it('darkens the accent text on a light background', () => {
    expect(serialized({ bgColor: '#ffffff', textColor: '#0f172a' })).toContain('"color":"#875706"');
  });
});
