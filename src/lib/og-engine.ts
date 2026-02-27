import satori from 'satori';
import { Resvg, initWasm } from '@resvg/resvg-wasm';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { loadFonts, toSatoriFonts } from './font-loader';
import type { SatoriElement, FontData } from '@/templates/types';

const require = createRequire(import.meta.url);

let wasmInitialized = false;

async function ensureWasmInitialized() {
  if (!wasmInitialized) {
    try {
      const wasmPath = require.resolve('@resvg/resvg-wasm/index_bg.wasm');
      const wasmBuffer = await readFile(wasmPath);
      await initWasm(wasmBuffer);
      wasmInitialized = true;
    } catch (e) {
      if (!(e instanceof Error && e.message.includes('Already initialized'))) {
        throw e;
      }
      wasmInitialized = true;
    }
  }
}

let fontsCache: FontData[] | null = null;

async function getFonts(): Promise<FontData[]> {
  if (!fontsCache) {
    fontsCache = await loadFonts();
  }
  return fontsCache;
}

// Mutex to serialize resvg-wasm access — WASM module is not thread-safe
// and crashes with "recursive use of an object" on concurrent calls.
let renderQueue: Promise<any> = Promise.resolve();

function withRenderLock<T>(fn: () => Promise<T>): Promise<T> {
  const next = renderQueue.then(fn, fn);
  renderQueue = next.then(() => {}, () => {});
  return next;
}

export interface RenderOptions {
  width?: number;
  height?: number;
  format?: 'png' | 'svg';
  /** If set, scales the final PNG to this width (maintaining aspect ratio). */
  scaleDown?: number;
}

/**
 * Render a satori element to SVG string.
 */
export async function renderToSvg(
  element: SatoriElement,
  options: RenderOptions = {}
): Promise<string> {
  const { width = 1200, height = 630 } = options;
  const fonts = await getFonts();

  return satori(element as any, {
    width,
    height,
    fonts: toSatoriFonts(fonts),
  });
}

/**
 * Render a satori element to PNG buffer.
 * Uses a mutex to prevent concurrent resvg-wasm access.
 */
export async function renderToPng(
  element: SatoriElement,
  options: RenderOptions = {}
): Promise<ArrayBuffer> {
  const { width = 1200, height = 630, scaleDown } = options;

  await ensureWasmInitialized();

  const svg = await renderToSvg(element, { width, height });

  // Serialize access to Resvg — the WASM module is single-threaded
  return withRenderLock(async () => {
    const outputWidth = scaleDown ?? width;
    const resvg = new Resvg(svg, {
      fitTo: { mode: 'width', value: outputWidth },
    });
    const pngData = resvg.render();
    const pngBytes = pngData.asPng();
    // Return as ArrayBuffer (BodyInit-compatible)
    return pngBytes.buffer.slice(pngBytes.byteOffset, pngBytes.byteOffset + pngBytes.byteLength) as ArrayBuffer;
  });
}

/**
 * Generate OG image from a template render function and params.
 */
export async function generateOGImage(
  render: (params: Record<string, any>) => SatoriElement,
  params: Record<string, any>,
  options: RenderOptions = {}
): Promise<ArrayBuffer> {
  const element = render(params);
  return renderToPng(element, options);
}
