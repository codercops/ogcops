import { useState, useCallback } from 'react';
import type { MetaTags } from '@/lib/meta-fetcher';
import type { AnalysisResult } from '@/lib/meta-analyzer';
import type { PlatformPreview } from '@/lib/platform-specs';

export interface PreviewData {
  url: string;
  meta: MetaTags;
  analysis: AnalysisResult;
  platforms: PlatformPreview[];
}

export function usePreviewState() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<PreviewData | null>(null);

  const checkUrl = useCallback(async (targetUrl: string) => {
    if (!targetUrl.trim()) return;

    // Ensure URL has protocol
    let normalizedUrl = targetUrl.trim();
    if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
      normalizedUrl = `https://${normalizedUrl}`;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/preview?url=${encodeURIComponent(normalizedUrl)}`);
      const json = await res.json();

      if (!res.ok) {
        setError(json.error || 'Failed to check URL');
        return;
      }

      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error');
    } finally {
      setLoading(false);
    }
  }, []);

  return { url, setUrl, loading, error, data, checkUrl };
}
