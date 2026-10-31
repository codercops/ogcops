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

export function isValidPreviewUrl(rawUrl: string): boolean {
  if (!rawUrl || typeof rawUrl !== 'string') return false;
  const trimmed = rawUrl.trim();
  if (!trimmed) return false;

  // Disallow non-http/https protocols like javascript:, data:, file:, mailto:, ftp:
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmed)) {
    if (!/^https?:\/\//i.test(trimmed)) {
      return false;
    }
  }

  const normalized =
    /^https?:\/\//i.test(trimmed)
      ? trimmed
      : `https://${trimmed}`;

  try {
    const parsed = new URL(normalized);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return false;
    }

    const host = parsed.hostname;
    if (!host || host.includes(' ') || host.includes('..')) {
      return false;
    }

    if (host !== 'localhost' && !host.includes('.')) {
      return false;
    }

    if (host.startsWith('.') || host.endsWith('.')) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

export function parsePreviewQueryParams(search: string | URLSearchParams): string | null {
  try {
    const searchParams = typeof search === 'string' ? new URLSearchParams(search) : search;
    const url = searchParams.get('url');
    if (!url) return null;
    const trimmed = url.trim();
    if (!trimmed || !isValidPreviewUrl(trimmed)) {
      return null;
    }
    return trimmed;
  } catch {
    return null;
  }
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
    if (!/^https?:\/\//i.test(normalizedUrl)) {
      normalizedUrl = `https://${normalizedUrl}`;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/preview?url=${encodeURIComponent(normalizedUrl)}`);
      const json = await res.json();

      if (!res.ok) {
        setData(null);
        setError(json.error || 'Failed to check URL');
        return;
      }

      setData(json);

      if (typeof window !== 'undefined' && window.history?.replaceState) {
        window.history.replaceState(window.history.state, '', `/preview?url=${encodeURIComponent(normalizedUrl)}`);
      }
    } catch (err) {
      setData(null);
      setError(err instanceof Error ? err.message : 'Network error');
    } finally {
      setLoading(false);
    }
  }, []);

  return { url, setUrl, loading, error, data, checkUrl };
}
