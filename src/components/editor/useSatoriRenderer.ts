import { useState, useEffect, useRef, useCallback } from 'react';

// Satori is loaded dynamically in the browser
let satoriModule: any = null;
let fontsLoaded: any[] | null = null;

async function loadSatori() {
  if (satoriModule) return satoriModule;
  // @ts-ignore - dynamic import
  const mod = await import('satori');
  satoriModule = mod.default || mod;
  return satoriModule;
}

async function loadBrowserFonts() {
  if (fontsLoaded) return fontsLoaded;

  const fontSpecs = [
    { url: '/fonts/Inter-Regular.woff', name: 'Inter', weight: 400 },
    { url: '/fonts/Inter-Medium.woff', name: 'Inter', weight: 500 },
    { url: '/fonts/Inter-SemiBold.woff', name: 'Inter', weight: 600 },
    { url: '/fonts/Inter-Bold.woff', name: 'Inter', weight: 700 },
    { url: '/fonts/PlayfairDisplay-Regular.woff', name: 'Playfair Display', weight: 400 },
    { url: '/fonts/PlayfairDisplay-Bold.woff', name: 'Playfair Display', weight: 700 },
    { url: '/fonts/JetBrainsMono-Regular.woff', name: 'JetBrains Mono', weight: 400 },
    { url: '/fonts/JetBrainsMono-Bold.woff', name: 'JetBrains Mono', weight: 700 },
  ];

  const fonts = await Promise.all(
    fontSpecs.map(async (spec) => {
      try {
        const res = await fetch(spec.url);
        const data = await res.arrayBuffer();
        return { name: spec.name, data, weight: spec.weight, style: 'normal' as const };
      } catch {
        return null;
      }
    })
  );

  fontsLoaded = fonts.filter(Boolean);

  // Fallback: if no fonts loaded, fetch Inter from CDN
  if (fontsLoaded.length === 0) {
    const res = await fetch(
      'https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuGKYAZ9hjp-Ek-_EeA.woff'
    );
    const data = await res.arrayBuffer();
    fontsLoaded = [
      { name: 'Inter', data, weight: 400, style: 'normal' as const },
      { name: 'Inter', data, weight: 600, style: 'normal' as const },
      { name: 'Inter', data, weight: 700, style: 'normal' as const },
    ];
  }

  return fontsLoaded;
}

export interface SatoriRendererResult {
  svg: string | null;
  loading: boolean;
  error: string | null;
  render: (element: any) => void;
}

export function useSatoriRenderer(): SatoriRendererResult {
  const [svg, setSvg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const readyRef = useRef(false);
  const queuedRef = useRef<any>(null);

  // Initialize satori + fonts
  useEffect(() => {
    (async () => {
      try {
        await Promise.all([loadSatori(), loadBrowserFonts()]);
        readyRef.current = true;
        setLoading(false);

        // Render any queued element
        if (queuedRef.current) {
          const el = queuedRef.current;
          queuedRef.current = null;
          doRender(el);
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load renderer');
        setLoading(false);
      }
    })();
  }, []);

  const doRender = useCallback(async (element: any) => {
    if (!satoriModule || !fontsLoaded) return;
    try {
      const result = await satoriModule(element, {
        width: 1200,
        height: 630,
        fonts: fontsLoaded,
      });
      setSvg(result);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Render failed');
    }
  }, []);

  const render = useCallback(
    (element: any) => {
      if (!readyRef.current) {
        queuedRef.current = element;
        return;
      }
      doRender(element);
    },
    [doRender]
  );

  return { svg, loading, error, render };
}
