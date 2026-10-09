import type { MetaTags } from '@/lib/meta-fetcher';
import { generateMetaTags } from '@/lib/meta-tag-generator';

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

  const editorUrl = `/create?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`;

  const handleCopy = async () => {
    const tags = generateMetaTags({
      title,
      description: description || undefined,
      imageUrl: 'YOUR_IMAGE_URL',
    });

    try {
      await navigator.clipboard.writeText(tags);
      window.showToast?.('Recommended meta tags copied!', 'success');
    } catch {
      try {
        const ta = document.createElement('textarea');
        ta.value = tags;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        window.showToast?.('Recommended meta tags copied!', 'success');
      } catch {
        window.showToast?.('Could not copy meta tags', 'error');
      }
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
