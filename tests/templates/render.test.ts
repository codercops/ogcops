import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import satori from 'satori';
import { getAllTemplates } from '@/templates/registry';

const fontFiles: [file: string, name: string, weight: 400 | 500 | 600 | 700][] = [
  ['Inter-Regular.woff', 'Inter', 400],
  ['Inter-Medium.woff', 'Inter', 500],
  ['Inter-SemiBold.woff', 'Inter', 600],
  ['Inter-Bold.woff', 'Inter', 700],
  ['PlayfairDisplay-Regular.woff', 'Playfair Display', 400],
  ['PlayfairDisplay-Bold.woff', 'Playfair Display', 700],
  ['JetBrainsMono-Regular.woff', 'JetBrains Mono', 400],
  ['JetBrainsMono-Bold.woff', 'JetBrains Mono', 700],
];

const fonts = fontFiles.map(([file, name, weight]) => ({
  name,
  data: readFileSync(join(process.cwd(), 'public/fonts', file)),
  weight,
  style: 'normal' as const,
}));

const render = (element: unknown) => satori(element as any, { width: 1200, height: 630, fonts });

describe('template render', () => {
  it.each(getAllTemplates().map((t) => [t.id, t] as const))('renders %s with its defaults', async (_id, template) => {
    const svg = await render(template.render(template.defaults));
    expect(svg).toMatch(/^<svg/);
  });

  it.each(getAllTemplates().map((t) => [t.id, t] as const))(
    'renders %s with optional text fields empty',
    async (_id, template) => {
      const params = { ...template.defaults };
      for (const field of template.fields) {
        if (!field.required && (field.type === 'text' || field.type === 'textarea')) params[field.key] = '';
      }
      const svg = await render(template.render(params));
      expect(svg).toMatch(/^<svg/);
    },
  );

  it.each([
    'ecommerce-product-card',
    'ecommerce-review-highlight',
    'tutorial-platform-branded',
    'saas-testimonial-banner',
    'github-stars-banner',
  ])('renders %s without Unicode star glyphs', async (templateId) => {
    const template = getAllTemplates().find(({ id }) => id === templateId);
    if (!template) throw new Error(`Template not found: ${templateId}`);

    const element = template.render(template.defaults);
    const svg = await render(element);
    expect(svg).not.toContain('★');
    expect(JSON.stringify(element)).not.toContain('★');
  });

  it('preserves filled and empty stars for a three-star product rating', async () => {
    const template = getAllTemplates().find(({ id }) => id === 'ecommerce-product-card');
    if (!template) throw new Error('Template not found: ecommerce-product-card');

    const element = template.render({ ...template.defaults, rating: 3 });
    const svg = await render(element);
    expect(svg).not.toContain('★');
    const elementJson = JSON.stringify(element);
    expect(elementJson.match(/"fill":"#F5C518"/g)).toHaveLength(3);
    expect(elementJson.match(/"fill":"#333333"/g)).toHaveLength(2);
  });

  // Verify that all templates render with their defaults without unresolved font glyphs.
  it.each(getAllTemplates().map((t) => [t.id, t] as const))(
    'renders %s with defaults and no unsupported characters',
    async (_id, template) => {
      const unresolved: string[] = [];
      const element = template.render(template.defaults);
      const svg = await satori(element as any, {
        width: 1200,
        height: 630,
        fonts,
        loadAdditionalAsset: async (_code, segment) => {
          unresolved.push(segment);
          return '';
        },
      });

      expect(svg).toMatch(/^<svg/);
      expect(unresolved).toEqual([]);
    },
  );

  it('renders github-repo-card with defaults and no unsupported characters', async () => {
    const template = getAllTemplates().find(({ id }) => id === 'github-repo-card');
    if (!template) throw new Error('Template not found: github-repo-card');

    const unresolved: string[] = [];
    const element = template.render(template.defaults);
    const svg = await satori(element as any, {
      width: 1200,
      height: 630,
      fonts,
      loadAdditionalAsset: async (_code, segment) => {
        unresolved.push(segment);
        return '';
      },
    });

    expect(svg).toMatch(/^<svg/);
    expect(unresolved).toEqual([]);
  });
});
