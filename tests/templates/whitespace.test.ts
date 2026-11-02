import { describe, expect, it } from 'vitest';
import { getAllTemplates } from '@/templates/registry';
import type { SatoriElement } from '@/templates/types';

/** Text that starts or ends with a space, where no element up the tree keeps white-space. */
function trimmedText(node: unknown, keepsSpaces = false): string[] {
  if (typeof node === 'string') return !keepsSpaces && node !== node.trim() ? [node] : [];
  if (Array.isArray(node)) return node.flatMap((child) => trimmedText(child, keepsSpaces));
  if (node && typeof node === 'object' && 'props' in node) {
    const { style, children } = (node as SatoriElement).props;
    const whiteSpace = style?.whiteSpace;
    return trimmedText(children, whiteSpace ? whiteSpace === 'pre' || whiteSpace === 'pre-wrap' : keepsSpaces);
  }
  return [];
}

describe('template text', () => {
  it.each(getAllTemplates().map((template) => [template.id, template] as const))(
    '%s keeps the spaces at the edge of its text',
    (_id, template) => {
      expect(trimmedText(template.render(template.defaults))).toEqual([]);
    },
  );
});
