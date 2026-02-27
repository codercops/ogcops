import { useState, useCallback } from 'react';

interface ExportBarProps {
  apiUrl: string;
  downloadUrl: string;
  params: Record<string, any>;
  templateId: string;
}

export function ExportBar({ apiUrl, downloadUrl, params, templateId }: ExportBarProps) {
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const handleDownload = useCallback(async () => {
    setDownloading(true);
    try {
      const res = await fetch(downloadUrl);
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
    } catch (err) {
      console.error('Download error:', err);
    } finally {
      setDownloading(false);
    }
  }, [apiUrl, templateId]);

  const copyToClipboard = useCallback(async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
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
      setTimeout(() => setCopied(null), 2000);
    }
  }, []);

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
      <button
        type="button"
        className="export-btn export-btn-primary"
        onClick={handleDownload}
        disabled={downloading}
      >
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
  );
}
