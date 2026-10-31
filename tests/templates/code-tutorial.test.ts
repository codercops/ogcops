import { describe, expect, it } from 'vitest';
import { getTemplate } from '@/templates/registry';
import type { SatoriElement } from '@/templates/types';

const template = getTemplate('tutorial-code-tutorial');
if (!template) throw new Error('Template not found: tutorial-code-tutorial');

function isSatoriElement(value: unknown): value is SatoriElement {
  return typeof value === 'object' && value !== null && 'type' in value && 'props' in value;
}

function getAllElements(element: SatoriElement): SatoriElement[] {
  const children = element.props.children;
  const childArray = Array.isArray(children)
    ? children.filter(isSatoriElement)
    : isSatoriElement(children)
      ? [children]
      : [];
  return [element, ...childArray.flatMap(getAllElements)];
}

/** Returns the text of each code-line span (the one that carries the actual code, not the line number). */
function getCodeLineTexts(element: SatoriElement): string[] {
  return getAllElements(element)
    .filter(
      (el) =>
        el.type === 'span' &&
        el.props.style?.fontFamily?.includes('JetBrains Mono') &&
        el.props.style?.color === '#D4D4D4',
    )
    .map((el) => String(el.props.children));
}

describe('tutorial-code-tutorial', () => {
  it('renders the default code lines with their leading indentation intact', () => {
    const element = template.render(template.defaults);
    const lines = getCodeLineTexts(element);

    // Default line 2: '  plugins: [router, store],' — must start with two spaces
    expect(lines[1]).toMatch(/^\s{2}/);
    // Default line 3: '  middleware: [auth],' — same
    expect(lines[2]).toMatch(/^\s{2}/);
  });

  it('code line spans have whiteSpace: pre so satori does not trim leading spaces', () => {
    const element = template.render(template.defaults);
    const codeSpans = getAllElements(element).filter(
      (el) =>
        el.type === 'span' &&
        el.props.style?.fontFamily?.includes('JetBrains Mono') &&
        el.props.style?.color === '#D4D4D4',
    );

    expect(codeSpans.length).toBeGreaterThan(0);
    for (const span of codeSpans) {
      expect(span.props.style?.whiteSpace).toBe('pre');
    }
  });

  it('preserves custom indentation passed via params', () => {
    const element = template.render({
      ...template.defaults,
      codeLine1: 'function hello() {',
      codeLine2: '    return 42;', // 4-space indent
      codeLine3: '}',
      codeLine4: '',
    });
    const lines = getCodeLineTexts(element);

    expect(lines[1]).toBe('    return 42;');
  });
});
