import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import satori from 'satori';
import { getAllTemplates } from '@/templates/registry';

const fonts = [
  { name: 'Inter', data: readFileSync(join(process.cwd(), 'public/fonts/Inter-Regular.woff')), weight: 400 as const, style: 'normal' as const },
];

const render = (element: unknown) => satori(element as any, { width: 1200, height: 630, fonts });

describe('template prototype-pollution guard', () => {
  it.each(
    getAllTemplates().flatMap((template) =>
      template.fields
        .filter((field) => field.type === 'select')
        .flatMap((field) =>
          ['constructor', 'toString', '__proto__', 'hasOwnProperty'].map(
            (badValue) => [template.id, template, field.key, badValue] as const,
          ),
        ),
    ),
  )('renders %s with select field %s set to %s', async (_id, template, fieldKey, badValue) => {
    const params = { ...template.defaults, [fieldKey]: badValue };
    const svg = await render(template.render(params));
    expect(svg).toMatch(/^<svg/);
  });
});
