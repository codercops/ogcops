import { useState, useCallback, useEffect, useRef } from 'react';

interface ExportBarProps {
  apiUrl: string;
  downloadUrl: string;
  params: Record<string, any>;
  templateId: string;
}

declare global {
  interface Window {
    showToast?: (message: string, type?: string, duration?: number) => void;
  }
}

export function ExportBar({ apiUrl, downloadUrl, params, templateId }: ExportBarProps) {
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const downloadRef = useRef(downloadUrl);
  const apiUrlRef = useRef(apiUrl);

  downloadRef.current = downloadUrl;
  apiUrlRef.current = apiUrl;

  const handleDownload = useCallback(async () => {
    setDownloading(true);
    try {
      const res = await fetch(downloadRef.current);
      if (!res.ok) throw new Error('Download failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `og-${templateId}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      window.showToast?.('Downloaded!', 'success');
    } catch (err) {
      console.error('Download error:', err);
      window.showToast?.('Download failed', 'error');
    } finally {
      setDownloading(false);
    }
  }, [templateId]);

  const copyToClipboard = useCallback(async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      window.showToast?.(label === 'url' ? 'URL copied to clipboard!' : 'Meta tags copied!', 'success');
      setTimeout(() => setCopied(null), 2000);
    } catch {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(label);
      window.showToast?.(label === 'url' ? 'URL copied to clipboard!' : 'Meta tags copied!', 'success');
      setTimeout(() => setCopied(null), 2000);
    }
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const mod = e.metaKey || e.ctrlKey;
      if (!mod) return;

      // Ctrl/Cmd+S → Download PNG
      if (e.key === 's' && !e.shiftKey) {
        e.preventDefault();
        handleDownload();
      }

      // Ctrl/Cmd+Shift+C → Copy API URL
      if (e.key === 'C' && e.shiftKey) {
        e.preventDefault();
        copyToClipboard(apiUrlRef.current, 'url');
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleDownload, copyToClipboard]);

  const metaTags = [
    `<meta property="og:image" content="${apiUrl}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    params.title ? `<meta property="og:title" content="${params.title}" />` : '',
    params.description ? `<meta property="og:description" content="${params.description}" />` : '',
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:image" content="${apiUrl}" />`,
  ]
    .filter(Boolean)
    .join('\n');

  return (
    <div className="export-bar">
      <div className="export-buttons">
        <button
          type="button"
          className="export-btn export-btn-primary"
          onClick={handleDownload}
          disabled={downloading}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
          {downloading ? 'Generating...' : 'Download PNG'}
        </button>
        <button
          type="button"
          className="export-btn export-btn-ghost"
          onClick={() => copyToClipboard(apiUrl, 'url')}
        >
          {copied === 'url' ? 'Copied!' : 'Copy URL'}
        </button>
        <button
          type="button"
          className="export-btn export-btn-ghost"
          onClick={() => copyToClipboard(metaTags, 'meta')}
        >
          {copied === 'meta' ? 'Copied!' : 'Copy Meta Tags'}
        </button>
      </div>
    </div>
  );
}
