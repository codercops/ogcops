import { describe, expect, it } from 'vitest';
import template from '@/templates/developer/vscode-theme';
import type { SatoriElement } from '@/templates/types';

function spans(node: unknown): SatoriElement[] {
  if (Array.isArray(node)) return node.flatMap(spans);
  if (node && typeof node === 'object' && 'props' in node) {
    const element = node as SatoriElement;
    return [...(element.type === 'span' ? [element] : []), ...spans(element.props.children)];
  }
  return [];
}

describe('developer-vscode-theme', () => {
  it('keeps the indentation and the space after each colon', () => {
    const spaced = spans(template.render(template.defaults)).filter((span) => {
      const text = String(span.props.children);
      return text !== text.trim();
    });

    expect(spaced.map((span) => span.props.children)).toEqual(expect.arrayContaining(['  ', '    ', ': ']));
    for (const span of spaced) expect(span.props.style?.whiteSpace).toBe('pre');
  });
});
