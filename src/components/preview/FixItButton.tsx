import type { MetaTags } from '@/lib/meta-fetcher';
import { generateMetaTags } from '@/lib/meta-tag-generator';
import { copyToClipboard } from '@/lib/clipboard';

interface FixItButtonProps {
  meta: MetaTags;
}

declare global {
  interface Window {
    showToast?: (message: string, type?: string, duration?: number) => void;
  }
}

export function FixItButton({ meta }: FixItButtonProps) {
  const title = meta.ogTitle || meta.title || '';
  const description = meta.ogDescription || meta.description || '';
  const siteName = meta.ogSiteName || '';

  const editorUrl = `/create?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}${siteName ? `&siteName=${encodeURIComponent(siteName)}` : ''}`;

  const tags = generateMetaTags({
    title,
    description: description || undefined,
    siteName: siteName || undefined,
    imageUrl: 'YOUR_IMAGE_URL',
  });

  const handleCopy = async () => {
    const success = await copyToClipboard(tags);
    if (success) {
      window.showToast?.('Recommended meta tags copied!', 'success');
    } else {
      window.showToast?.('Could not copy meta tags', 'error');
    }
  };

  return (
    <div className="fix-it-section">
      <h3>Create a Better OG Image</h3>
      <p>Use our editor to design a professional OG image for this URL.</p>
      <div className="fix-it-actions">
        <a href={editorUrl} className="fix-it-btn-primary">
          Create OG Image
        </a>
        <button type="button" className="fix-it-btn-ghost" onClick={handleCopy}>
          Copy Recommended Meta Tags
        </button>
      </div>
    </div>
  );
}
