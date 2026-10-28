import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderToString } from 'react-dom/server';
import React from 'react';

const generateMetaTags = vi.fn((_params: Record<string, unknown>) => '');
vi.mock('@/lib/meta-tag-generator', () => ({ generateMetaTags }));

const { ExportBar } = await import('@/components/editor/ExportBar');

function metaTagParams(params: Record<string, unknown>) {
  renderToString(
    React.createElement(ExportBar, { apiUrl: '/api/og?x=1', downloadUrl: '/api/og?x=1', params, templateId: 'saas-maintenance' }),
  );
  return generateMetaTags.mock.calls.at(-1)![0];
}

describe('ExportBar meta tags', () => {
  beforeEach(() => generateMetaTags.mockClear());

  it('passes the Site Name so the copied tags include og:site_name', () => {
    expect(metaTagParams({ title: 'Database upgrade', siteName: 'Acme Cloud' })).toMatchObject({ siteName: 'Acme Cloud' });
  });

  it('leaves siteName out when the Site Name is empty', () => {
    expect(metaTagParams({ title: 'Database upgrade', siteName: '' }).siteName).toBeUndefined();
  });
});
