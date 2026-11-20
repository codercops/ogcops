// Renders the templates a PR adds or changes to PNG files, so a review can look
// at them. The "Template previews" workflow runs this with PREVIEW_FILES set to
// the changed template files. A plain `npm run test` skips it.
import { describe, it, expect } from 'vitest';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { getTemplate } from '@/templates/registry';
import type { TemplateDefinition } from '@/templates/types';

const files = (process.env.PREVIEW_FILES ?? '').split(/\s+/).filter(Boolean);
const out = process.env.PREVIEW_OUT ?? 'previews';

const fonts = ([
  ['Inter-Regular.woff', 'Inter', 400],
  ['Inter-Medium.woff', 'Inter', 500],
  ['Inter-SemiBold.woff', 'Inter', 600],
  ['Inter-Bold.woff', 'Inter', 700],
  ['PlayfairDisplay-Regular.woff', 'Playfair Display', 400],
  ['PlayfairDisplay-Bold.woff', 'Playfair Display', 700],
  ['JetBrainsMono-Regular.woff', 'JetBrains Mono', 400],
  ['JetBrainsMono-Bold.woff', 'JetBrains Mono', 700],
] as const).map(([file, name, weight]) => ({
  name,
  weight,
  style: 'normal' as const,
  data: readFileSync(join(process.cwd(), 'public/fonts', file)),
}));

const LONG = 'A fairly long piece of text that keeps going and going '.repeat(6).trim();

// The same four cases a review checks by hand.
function variants(template: TemplateDefinition): Record<string, Record<string, unknown>> {
  const text = template.fields.filter((f) => f.type === 'text' || f.type === 'textarea');
  return {
    defaults: {},
    empty: Object.fromEntries(text.filter((f) => !f.required).map((f) => [f.key, ''])),
    long: Object.fromEntries(text.map((f) => [f.key, LONG])),
    light: { bgColor: '#ffffff', textColor: '#111111' },
  };
}

describe.skipIf(files.length === 0)('template previews', () => {
  it.each(files.length ? files : ['none'])('renders %s', async (file) => {
    const template: TemplateDefinition | undefined = (await import(resolve(process.cwd(), file))).default;
    expect(template?.id, `${file} has no default export with an id`).toBeTruthy();
    expect(getTemplate(template!.id), `${template!.id} isn't registered in src/templates/registry.ts`).toBeDefined();

    mkdirSync(out, { recursive: true });
    for (const [name, overrides] of Object.entries(variants(template!))) {
      const svg = await satori(template!.render({ ...template!.defaults, ...overrides }) as any, {
        width: 1200,
        height: 630,
        fonts,
      });
      writeFileSync(join(out, `${template!.id}--${name}.png`), new Resvg(svg).render().asPng());
    }
  });
});
