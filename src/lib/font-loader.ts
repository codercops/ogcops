import type { FontData } from '@/templates/types';

// The fonts are bundled into the server build as data URLs. The Worker has no
// filesystem to read public/fonts from at request time; the browser editor
// still loads the same files from /fonts/.
import interRegular from '../../public/fonts/Inter-Regular.woff?inline';
import interMedium from '../../public/fonts/Inter-Medium.woff?inline';
import interSemiBold from '../../public/fonts/Inter-SemiBold.woff?inline';
import interBold from '../../public/fonts/Inter-Bold.woff?inline';
import playfairRegular from '../../public/fonts/PlayfairDisplay-Regular.woff?inline';
import playfairBold from '../../public/fonts/PlayfairDisplay-Bold.woff?inline';
import jetbrainsRegular from '../../public/fonts/JetBrainsMono-Regular.woff?inline';
import jetbrainsBold from '../../public/fonts/JetBrainsMono-Bold.woff?inline';

const fontCache = new Map<string, ArrayBuffer>();

function decodeFont(dataUrl: string): ArrayBuffer {
  const cached = fontCache.get(dataUrl);
  if (cached) return cached;

  const binary = atob(dataUrl.slice(dataUrl.indexOf(',') + 1));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  fontCache.set(dataUrl, bytes.buffer);
  return bytes.buffer;
}

export async function loadFonts(): Promise<FontData[]> {
  const fonts: FontData[] = [];

  const fontSpecs: { file: string; name: string; weight: number; style: 'normal' | 'italic' }[] = [
    { file: interRegular, name: 'Inter', weight: 400, style: 'normal' },
    { file: interMedium, name: 'Inter', weight: 500, style: 'normal' },
    { file: interSemiBold, name: 'Inter', weight: 600, style: 'normal' },
    { file: interBold, name: 'Inter', weight: 700, style: 'normal' },
    { file: playfairRegular, name: 'Playfair Display', weight: 400, style: 'normal' },
    { file: playfairBold, name: 'Playfair Display', weight: 700, style: 'normal' },
    { file: jetbrainsRegular, name: 'JetBrains Mono', weight: 400, style: 'normal' },
    { file: jetbrainsBold, name: 'JetBrains Mono', weight: 700, style: 'normal' },
  ];

  for (const spec of fontSpecs) {
    try {
      const data = decodeFont(spec.file);
      fonts.push({ name: spec.name, data, weight: spec.weight, style: spec.style });
    } catch {
      console.warn(`Font could not be decoded: ${spec.name} ${spec.weight}`);
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
