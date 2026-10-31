import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import React from 'react';
import { CustomizePanel } from '@/components/editor/CustomizePanel';
import type { TemplateField } from '@/templates/types';

const fields: TemplateField[] = [{ key: 'bgColor', label: 'Background', type: 'color', defaultValue: '#0f172a', group: 'Style' }];

function inputs(bgColor: unknown) {
  const html = renderToString(
    React.createElement(CustomizePanel, { fields, params: { bgColor }, onParamChange: () => {}, onReset: () => {} }),
  );
  const value = (type: string) => html.match(new RegExp(`<input[^>]*type="${type}"[^>]*value="([^"]*)"`))?.[1];
  return { swatch: value('color'), text: value('text') };
}

describe('ColorPicker', () => {
  it('leaves a cleared hex field empty instead of filling in #000000', () => {
    expect(inputs('').text).toBe('');
  });

  it('shows what was typed and gives the swatch a full #rrggbb color', () => {
    expect(inputs('#fff')).toEqual({ swatch: '#ffffff', text: '#fff' });
    expect(inputs('ff8800')).toEqual({ swatch: '#ff8800', text: '#ff8800' });
  });

  it('keeps a partial value in the text field', () => {
    expect(inputs('#ff88').text).toBe('#ff88');
  });
});
