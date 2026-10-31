import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import satori, { type SatoriNode } from 'satori';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import apiEndpoint from '@/templates/saas/api-endpoint';
import { getTemplate, getTemplatesByCategory } from '@/templates/registry';
import type { SatoriElement } from '@/templates/types';
import { editorReducer, useEditorState, type EditorState } from '@/components/editor/useEditorState';
import { mergeOgParams, ogQuerySchema, parseSearchParams } from '@/lib/api-validation';

function elements(node: unknown): SatoriElement[] {
  if (Array.isArray(node)) return node.flatMap(elements);
  if (node && typeof node === 'object' && 'props' in node) {
    const element = node as SatoriElement;
    return [element, ...elements(element.props.children)];
  }
  return [];
}

const tree = (params: Record<string, unknown> = {}) => apiEndpoint.render({ ...apiEndpoint.defaults, ...params });
const text = (params: Record<string, unknown> = {}) => elements(tree(params)).flatMap((el) =>
  typeof el.props.children === 'string' ? [el.props.children] : []);
const methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];
const fonts = ['Inter-Regular', 'Inter-SemiBold', 'JetBrainsMono-Regular', 'JetBrainsMono-Bold'].map((file) => ({
  name: file.startsWith('Inter') ? 'Inter' : 'JetBrains Mono',
  data: readFileSync(`public/fonts/${file}.woff`),
  weight: (file.endsWith('SemiBold') ? 600 : file.endsWith('Bold') ? 700 : 400) as 400 | 600 | 700,
  style: 'normal' as const,
}));

function luminance(hex: string) {
  const rgb = hex.match(/[a-f\d]{2}/gi)!.map((c) => parseInt(c, 16) / 255)
    .map((c) => c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
}

function serverParams(query: URLSearchParams) {
  const parsed = parseSearchParams(query, ogQuerySchema);
  if (!parsed.success) throw new Error(parsed.error);
  return mergeOgParams(parsed.data, apiEndpoint.defaults, query, apiEndpoint.fields);
}

function downloadParams(params: Record<string, string | number | boolean>) {
  let downloadUrl = '';
  function Probe() {
    downloadUrl = useEditorState({ ...apiEndpoint, defaults: params }).downloadUrl;
    return null;
  }
  renderToStaticMarkup(createElement(Probe));
  const query = new URL(downloadUrl, 'https://example.test').searchParams;
  return { query, params: serverParams(query) };
}

describe('saas-api-endpoint', () => {
  it('is discoverable in the SaaS registry and renders the supplied endpoint', () => {
    expect(getTemplate('saas-api-endpoint')).toBe(apiEndpoint);
    expect(getTemplatesByCategory('saas')).toContain(apiEndpoint);
    expect(text({ siteName: 'Invoice API', method: 'POST', path: '/v2/invoices', responseStatus: '201 Created' }))
      .toEqual(expect.arrayContaining(['Invoice API', 'POST', '/v2/invoices', '201 Created']));
  });

  it.each(methods)('keeps %s readable on dark and light canvases', async (method) => {
    for (const bgColor of ['#0b1220', '#ffffff']) {
      const element = tree({ method, bgColor, textColor: bgColor === '#ffffff' ? '#111827' : '#f8fafc' });
      const pill = elements(element).find((el) => el.props.children === method)!;
      expect(pill.props.style.background).toMatch(/^#[a-f\d]{6}$/i);
      expect((luminance(pill.props.style.background) + 0.05) / (luminance(pill.props.style.color) + 0.05)).toBeGreaterThan(4.5);
      const svg = await satori(element as any, { width: 1200, height: 630, fonts });
      expect(svg).toMatch(/^<svg[^>]*width="1200"[^>]*height="630"/);
    }
  });

  it.each(['#ffffff', '#f1f5f9', '#0b1220'])('keeps the product name readable on %s', async (bgColor) => {
    const element = tree({ bgColor });
    const name = elements(element).find((el) => el.props.children === 'Acme API')!;
    const levels = [luminance(name.props.style.color), luminance(bgColor)].sort((a, b) => a - b);
    expect((levels[1] + 0.05) / (levels[0] + 0.05)).toBeGreaterThan(4.5);
    if (bgColor === '#0b1220') expect(name.props.style.color).toBe(apiEndpoint.defaults.accentColor);
    const svg = await satori(element as any, { width: 1200, height: 630, fonts });
    expect(svg).toContain(`fill="${name.props.style.color}"`);
  });

  it.each([
    { responseStatus: '', responseExample: '' },
    { responseStatus: '200 OK', responseExample: '' },
    { responseStatus: '', responseExample: '{ "ok": true }' },
    { responseStatus: '200 OK', responseExample: '{ "ok": true }' },
  ])('centers the endpoint with response fields %j', async (response) => {
    for (const description of ['', 'Retrieve an invoice.']) {
      const nodes: SatoriNode[] = [];
      await satori(tree({ ...response, description }) as any, {
        width: 1200, height: 630, fonts, onNodeDetected: (node) => nodes.push(node),
      });
      const name = nodes.find((node) => node.textContent === 'Acme API')!;
      const pill = nodes.find((node) => node.type === 'div' && node.textContent === 'GET')!;
      const descriptionNode = nodes.find((node) => node.textContent === description);
      const panel = nodes.find((node) => node.props.style?.padding === '24px 28px');
      const contentBottom = descriptionNode ? descriptionNode.top + descriptionNode.height : pill.top + pill.height;
      const availableBottom = panel ? panel.top : 630 - 64;
      const center = (pill.top + contentBottom) / 2;
      const availableCenter = (name.top + name.height + availableBottom) / 2;
      expect(Math.abs(center - availableCenter)).toBeLessThanOrEqual(1);
      expect(pill.top).toBeGreaterThan(name.top + name.height);
      expect(contentBottom).toBeLessThan(availableBottom);
    }
  });

  it.each(['unknown', '__proto__', 'constructor', '', null])('falls back to GET for method %s', (method) => {
    expect(tree({ method })).toEqual(tree({ method: 'GET' }));
  });

  it('accepts lowercase methods without introducing nondeterminism', () => {
    expect(tree({ method: 'post' })).toEqual(tree({ method: 'POST' }));
    expect(tree()).toEqual(tree());
  });

  it('shrinks and truncates a long unbroken path', async () => {
    const element = tree({ method: 'DELETE', path: '/v1/' + 'invoices'.repeat(40) });
    const path = elements(element).find((el) => typeof el.props.children === 'string' && el.props.children.startsWith('/v1/'))!;
    expect(path.props.children).toHaveLength(64);
    expect(path.props.children.endsWith('…')).toBe(true);
    expect(parseInt(path.props.style.fontSize)).toBeLessThan(48);
    expect(await satori(element as any, { width: 1200, height: 630, fonts })).toMatch(/^<svg/);
  });

  it('hides empty response content without leaving an empty panel', async () => {
    const element = tree({ description: '', responseStatus: ' ', responseExample: ' ' });
    expect(text({ description: '', responseStatus: '', responseExample: '' })).toEqual(['Acme API', 'GET', '/v1/invoices/{id}']);
    expect(elements(element).some((el) => el.props.style?.padding === '24px 28px')).toBe(false);
    expect(await satori(element as any, { width: 1200, height: 630, fonts })).toMatch(/^<svg/);
  });

  it('supports a status or example on its own and bounds response text', () => {
    expect(text({ responseExample: '' })).toContain('200 OK');
    expect(text({ responseStatus: '', responseExample: '{ "ok": true }' })).toContain('{ "ok": true }');
    const output = text({ responseExample: 'x'.repeat(200), responseStatus: 's'.repeat(80) });
    expect(output).toContain('x'.repeat(71) + '…');
    expect(output).toContain('s'.repeat(39) + '…');
  });

  it('uses explicit flex on every div and bounds long product/description input', () => {
    const element = tree({ siteName: 'a'.repeat(200), description: 'b'.repeat(500) });
    expect(element.props.style).toMatchObject({ width: '1200px', height: '630px', display: 'flex' });
    expect(elements(element).filter((el) => el.type === 'div').every((el) => el.props.style.display === 'flex')).toBe(true);
    expect(text({ siteName: 'a'.repeat(200) })).toContain('a'.repeat(35) + '…');
    expect(text({ description: 'b'.repeat(500) })).toContain('b'.repeat(83) + '…');
  });

  describe('editor download response fields', () => {
    it('keeps the status default and an empty example when query fields are omitted', () => {
      const params = serverParams(new URLSearchParams({ template: apiEndpoint.id }));
      expect(params.responseStatus).toBe('200 OK');
      expect(params.responseExample).toBe('');
      expect(apiEndpoint.render(params)).toEqual(tree({ responseExample: '' }));
    });

    it.each([
      { name: 'default', example: '', clear: false },
      { name: 'supplied', example: '{ "id": "inv_123" }', clear: false },
      { name: 'cleared', example: '{ "id": "inv_123" }', clear: true },
    ])('preserves a $name example through the editor URL and server merge', ({ example, clear }) => {
      let state: EditorState = {
        templateId: apiEndpoint.id, category: 'saas', params: { ...apiEndpoint.defaults }, searchQuery: '',
      };
      if (example) state = editorReducer(state, { type: 'SET_PARAM', key: 'responseExample', value: example });
      if (clear) state = editorReducer(state, { type: 'SET_PARAM', key: 'responseExample', value: '' });

      const expected = clear ? '' : example;
      const download = downloadParams(state.params);
      expect(download.query.get('responseExample')).toBe(expected || null);
      expect(download.params.responseExample).toBe(expected);
      expect(download.params.responseStatus).toBe('200 OK');
      expect(apiEndpoint.render(download.params)).toEqual(apiEndpoint.render(state.params));
    });

    it('preserves supplied status text and keeps a cleared status empty, like the preview', () => {
      const supplied = downloadParams({ ...apiEndpoint.defaults, responseStatus: '201 Created' });
      expect(supplied.params.responseStatus).toBe('201 Created');
      expect(apiEndpoint.render(supplied.params)).toEqual(tree({ responseStatus: '201 Created' }));

      const cleared = downloadParams({ ...apiEndpoint.defaults, responseStatus: '' });
      expect(cleared.query.get('responseStatus')).toBe('');
      expect(cleared.params.responseStatus).toBe('');
      // A status cleared in the editor stays empty in the download, the same as in the preview.
      expect(apiEndpoint.render(cleared.params)).toEqual(tree({ responseStatus: '' }));
    });
  });
});
