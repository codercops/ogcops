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
});
