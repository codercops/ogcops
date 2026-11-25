import { describe, expect, it } from 'vitest';
import { getTemplate } from '@/templates/registry';
import type { SatoriElement } from '@/templates/types';

const longUnbrokenValue = 'x'.repeat(300);
const normalValue = 'Short value';

const affectedFields = [
  { templateId: 'github-repo-card', field: 'stars', maxLength: 20 },
  { templateId: 'github-repo-card', field: 'forks', maxLength: 20 },
  { templateId: 'github-repo-card', field: 'language', maxLength: 20 },
  { templateId: 'event-conference', field: 'venue', maxLength: 28 },
  { templateId: 'event-hackathon', field: 'date', maxLength: 24 },
  { templateId: 'ecommerce-sale-banner', field: 'originalPrice', maxLength: 20 },
  { templateId: 'ecommerce-sale-banner', field: 'salePrice', maxLength: 20 },
  { templateId: 'ecommerce-price-drop', field: 'oldPrice', maxLength: 14 },
  { templateId: 'ecommerce-price-drop', field: 'newPrice', maxLength: 12 },
  { templateId: 'job-developer-role', field: 'lang1', maxLength: 20 },
  { templateId: 'job-developer-role', field: 'lang2', maxLength: 20 },
  { templateId: 'job-developer-role', field: 'lang3', maxLength: 20 },
] as const;

function textContent(node: unknown): string[] {
  if (typeof node === 'string') return [node];
  if (Array.isArray(node)) return node.flatMap(textContent);
  if (node && typeof node === 'object' && 'props' in node) {
    return textContent((node as SatoriElement).props.children);
  }
  return [];
}

describe('long unbroken text in templates', () => {
  it.each(affectedFields)(
    'truncates $templateId.$field without changing defaults or normal values',
    ({ templateId, field, maxLength }) => {
      const template = getTemplate(templateId);
      expect(template).toBeDefined();
      if (!template) throw new Error(`Template not found: ${templateId}`);

      const defaultText = String(template.defaults[field]);
      const defaultTree = template.render({ ...template.defaults });
      expect(textContent(defaultTree)).toContain(defaultText);

      const normalTree = template.render({
        ...template.defaults,
        [field]: normalValue,
      });
      expect(textContent(normalTree)).toContain(normalValue);

      const longTree = template.render({
        ...template.defaults,
        [field]: longUnbrokenValue,
      });
      const expectedText = `${'x'.repeat(maxLength - 1)}…`;

      const renderedText = textContent(longTree).find((text) => text === expectedText);
      expect(renderedText).toBe(expectedText);
      expect(renderedText).toMatch(/…$/);
      expect(renderedText).toHaveLength(maxLength);
      expect(textContent(longTree)).not.toContain(longUnbrokenValue);
    }
  );
});
