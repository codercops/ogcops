import type { MetaTags } from '@/lib/meta-fetcher';

interface FixItButtonProps {
  meta: MetaTags;
}

export function FixItButton({ meta }: FixItButtonProps) {
  const title = meta.ogTitle || meta.title || '';
  const description = meta.ogDescription || meta.description || '';

  const editorUrl = `/create?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`;

  return (
    <div className="fix-it-section">
      <h3>Create a Better OG Image</h3>
      <p>Use our editor to design a professional OG image for this URL.</p>
      <div className="fix-it-actions">
        <a href={editorUrl} className="fix-it-btn-primary">
          Create OG Image
        </a>
        <button
          type="button"
          className="fix-it-btn-ghost"
          onClick={() => {
            const tags = [
              `<meta property="og:title" content="${title}" />`,
              description ? `<meta property="og:description" content="${description}" />` : '',
              `<meta property="og:image" content="YOUR_IMAGE_URL" />`,
              `<meta property="og:image:width" content="1200" />`,
              `<meta property="og:image:height" content="630" />`,
              `<meta name="twitter:card" content="summary_large_image" />`,
              `<meta name="twitter:image" content="YOUR_IMAGE_URL" />`,
            ]
              .filter(Boolean)
              .join('\n');
            navigator.clipboard.writeText(tags);
          }}
        >
          Copy Recommended Meta Tags
        </button>
      </div>
    </div>
  );
}
