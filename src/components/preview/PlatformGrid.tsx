import { useState } from 'react';
import type { PlatformPreview } from '@/lib/platform-specs';
import { MOCKUP_RENDERERS, PLATFORM_ORDER, getPlatformWidth, type ViewportSize } from '@/components/shared/PlatformMockups';
import { ViewportSwitcher } from '@/components/shared/ViewportSwitcher';

interface PlatformGridProps {
  platforms: PlatformPreview[];
}

export function PlatformGrid({ platforms }: PlatformGridProps) {
  const [viewport, setViewport] = useState<ViewportSize>('desktop');

  // Build a lookup from platform id to preview data
  const previewMap = new Map(platforms.map((p) => [p.platform, p]));

  return (
    <div className="platform-section">
      <div className="platform-section-header">
        <h3 className="platform-section-title">Platform Previews</h3>
        <ViewportSwitcher value={viewport} onChange={setViewport} />
      </div>

      <div className={`platform-grid ${viewport === 'phone' ? 'platform-grid-single' : ''}`}>
        {PLATFORM_ORDER.map((p) => {
          const preview = previewMap.get(p.id);
          const Renderer = MOCKUP_RENDERERS[p.id];
          const cardWidth = getPlatformWidth(p.id, viewport);

          return (
            <div key={p.id} className="platform-card">
              <div className="platform-card-header">
                <span className="platform-card-name">{p.name}</span>
                <span className="platform-card-viewport-label">
                  {cardWidth}px
                </span>
              </div>
              <div className="platform-card-mockup">
                <div className="platform-card-device" style={{ maxWidth: cardWidth }}>
                  <Renderer
                    imageUri={preview?.imageUrl ?? null}
                    title={preview?.title || ''}
                    description={preview?.description || ''}
                    domain={preview?.siteName || p.name}
                    viewport={viewport}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
