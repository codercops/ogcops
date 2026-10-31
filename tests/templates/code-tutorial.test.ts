import { describe, expect, it } from 'vitest';
import codeTutorial from '@/templates/tutorial/code-tutorial';
import type { SatoriElement } from '@/templates/types';

function spans(node: unknown): SatoriElement[] {
  if (Array.isArray(node)) return node.flatMap(spans);
  if (node && typeof node === 'object' && 'props' in node) {
    const element = node as SatoriElement;
    return [...(element.type === 'span' ? [element] : []), ...spans(element.props.children)];
  }
  return [];
}

describe('tutorial-code-tutorial', () => {
  it('keeps the indentation of each code line', () => {
    const line = spans(codeTutorial.render(codeTutorial.defaults)).find(
      (span) => span.props.children === '  plugins: [router, store],',
    );

    expect(line?.props.style?.whiteSpace).toBe('pre-wrap');
  });
});
