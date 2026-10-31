import { describe, expect, it } from 'vitest';
import template from '@/templates/blog/code-snippet';
import type { SatoriElement } from '@/templates/types';

function isSatoriElement(value: unknown): value is SatoriElement {
  return typeof value === 'object' && value !== null && 'type' in value && 'props' in value;
}

function getChildren(element: SatoriElement): SatoriElement[] {
  const children = element.props.children;
  return Array.isArray(children) ? children.filter(isSatoriElement) : isSatoriElement(children) ? [children] : [];
}

/** Text of each span, with the whiteSpace it inherits from its nearest ancestor. */
function getSpans(element: SatoriElement, whiteSpace = 'normal'): { text: string; whiteSpace: string }[] {
  const own = element.props.style?.whiteSpace ?? whiteSpace;
  const self = element.type === 'span' ? [{ text: String(element.props.children), whiteSpace: own }] : [];
  return [...self, ...getChildren(element).flatMap((child) => getSpans(child, own))];
}

describe('blog-code-snippet', () => {
  it('keeps the spaces around the code tokens', () => {
    const spans = getSpans(template.render({ ...template.defaults, author: 'Jane Smith' }));
    const spaced = spans.filter((span) => span.text !== span.text.trim());

    expect(spaced.map((span) => span.text)).toEqual(expect.arrayContaining(['const ', ' = ']));
    for (const span of spaced) expect(span.whiteSpace).toMatch(/^pre/);
  });
});
