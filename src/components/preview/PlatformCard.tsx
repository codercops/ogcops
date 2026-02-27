import type { PlatformPreview } from '@/lib/platform-specs';
import type { PlatformId } from '@/lib/platform-specs';
import { MOCKUP_RENDERERS } from '@/components/shared/PlatformMockups';

interface PlatformCardProps {
  preview: PlatformPreview;
}

export function PlatformCard({ preview }: PlatformCardProps) {
  const Renderer = MOCKUP_RENDERERS[preview.platform as PlatformId];

  return (
    <div className="platform-card">
      <div className="platform-card-header">
        <span className="platform-card-name">{preview.name}</span>
      </div>
      <div className="platform-card-mockup">
        {Renderer ? (
          <Renderer
            imageUri={preview.imageUrl}
            title={preview.title}
            description={preview.description}
            domain={preview.siteName}
          />
        ) : (
          <div className="platform-card-fallback">
            {preview.imageUrl ? (
              <div className="platform-card-image">
                <img src={preview.imageUrl} alt={`${preview.name} preview`} loading="lazy" />
              </div>
            ) : (
              <div className="platform-card-no-image">
                <span>No OG image</span>
              </div>
            )}
            <div className="platform-card-meta">
              <span className="platform-card-site">{preview.siteName}</span>
              <span className="platform-card-title">{preview.title || 'No title'}</span>
              {preview.description && (
                <span className="platform-card-desc">{preview.description}</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
