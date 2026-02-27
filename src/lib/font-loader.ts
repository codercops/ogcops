import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { FontData } from '@/templates/types';

const FONT_DIR = join(process.cwd(), 'public', 'fonts');

const fontCache = new Map<string, ArrayBuffer>();

async function loadFontFile(filename: string): Promise<ArrayBuffer> {
  const cached = fontCache.get(filename);
  if (cached) return cached;

  const buffer = await readFile(join(FONT_DIR, filename));
  const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
  fontCache.set(filename, arrayBuffer);
  return arrayBuffer;
}

export async function loadFonts(): Promise<FontData[]> {
  const fonts: FontData[] = [];

  const fontSpecs: { file: string; name: string; weight: number; style: 'normal' | 'italic' }[] = [
    { file: 'Inter-Regular.woff', name: 'Inter', weight: 400, style: 'normal' },
    { file: 'Inter-Medium.woff', name: 'Inter', weight: 500, style: 'normal' },
    { file: 'Inter-SemiBold.woff', name: 'Inter', weight: 600, style: 'normal' },
    { file: 'Inter-Bold.woff', name: 'Inter', weight: 700, style: 'normal' },
    { file: 'PlayfairDisplay-Regular.woff', name: 'Playfair Display', weight: 400, style: 'normal' },
    { file: 'PlayfairDisplay-Bold.woff', name: 'Playfair Display', weight: 700, style: 'normal' },
    { file: 'JetBrainsMono-Regular.woff', name: 'JetBrains Mono', weight: 400, style: 'normal' },
    { file: 'JetBrainsMono-Bold.woff', name: 'JetBrains Mono', weight: 700, style: 'normal' },
  ];

  for (const spec of fontSpecs) {
    try {
      const data = await loadFontFile(spec.file);
      fonts.push({ name: spec.name, data, weight: spec.weight, style: spec.style });
    } catch {
      // Font file not found — skip silently in dev, required in production
      if (process.env.NODE_ENV === 'production') {
        console.warn(`Font file not found: ${spec.file}`);
      }
    }
  }

  // Fallback: if no local fonts loaded, fetch Inter from Google Fonts
  if (fonts.length === 0) {
    const response = await fetch(
      'https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuGKYAZ9hjp-Ek-_EeA.woff'
    );
    const data = await response.arrayBuffer();
    fonts.push(
      { name: 'Inter', data, weight: 400, style: 'normal' },
      { name: 'Inter', data, weight: 600, style: 'normal' },
      { name: 'Inter', data, weight: 700, style: 'normal' },
    );
  }

  return fonts;
}

/**
 * Convert FontData array to satori-compatible font config.
 */
export function toSatoriFonts(fonts: FontData[]) {
  return fonts.map((f) => ({
    name: f.name,
    data: f.data,
    weight: f.weight as 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900,
    style: f.style,
  }));
}
