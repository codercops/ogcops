import { useState } from 'react';
import type { PlatformId } from '@/lib/platform-specs';
import { MOCKUP_RENDERERS, PLATFORM_ORDER, getPlatformWidth, type MockupProps, type ViewportSize } from '@/components/shared/PlatformMockups';
import { ViewportSwitcher } from '@/components/shared/ViewportSwitcher';

interface PlatformPreviewStripProps {
  svg: string | null;
  title: string;
  description: string;
  siteName?: string;
}

export function PlatformPreviewStrip({ svg, title, description, siteName }: PlatformPreviewStripProps) {
  const [expanded, setExpanded] = useState<PlatformId | null>(null);
  const [viewport, setViewport] = useState<ViewportSize>('desktop');

  if (!svg) return null;

  const dataUri = `data:image/svg+xml,${encodeURIComponent(svg)}`;
  const domain = siteName || 'yoursite.com';

  const mockupProps: MockupProps = {
    imageUri: dataUri,
    title: title || 'Your Title',
    description: description || 'Your description will appear here.',
    domain,
    viewport,
  };

  return (
    <div className="platform-strip">
      <div className="platform-strip-header">
        <h4 className="platform-strip-title">Platform Previews</h4>
        <ViewportSwitcher value={viewport} onChange={setViewport} compact />
      </div>
      <div className="platform-strip-scroll">
        {PLATFORM_ORDER.map((platform) => {
          const Renderer = MOCKUP_RENDERERS[platform.id];
          const miniWidth = Math.min(getPlatformWidth(platform.id, viewport), 260);
          return (
            <div
              key={platform.id}
              className="platform-mini"
              style={{ width: miniWidth }}
              onClick={() => setExpanded(expanded === platform.id ? null : platform.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setExpanded(expanded === platform.id ? null : platform.id);
                }
              }}
            >
              <div className="platform-mini-header">
                <span className="platform-mini-name">{platform.name}</span>
              </div>
              <Renderer {...mockupProps} />
            </div>
          );
        })}
      </div>

      {/* Expanded modal overlay */}
      {expanded && (() => {
        const expandedWidth = getPlatformWidth(expanded, viewport);
        return (
          <div
            className="platform-expanded-overlay"
            onClick={() => setExpanded(null)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Escape') setExpanded(null); }}
          >
            <div
              className="platform-expanded-card"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              style={{ maxWidth: Math.max(expandedWidth + 48, 360) }}
            >
              <div className="platform-expanded-header">
                <span className="platform-expanded-name">
                  {PLATFORM_ORDER.find((p) => p.id === expanded)?.name}
                </span>
                <div className="platform-expanded-actions">
                  <ViewportSwitcher value={viewport} onChange={setViewport} compact />
                  <button
                    type="button"
                    className="platform-expanded-close"
                    onClick={() => setExpanded(null)}
                    aria-label="Close"
                  >
                    &times;
                  </button>
                </div>
              </div>
              <div className="platform-expanded-body">
                <div style={{ maxWidth: expandedWidth, margin: '0 auto' }}>
                  {MOCKUP_RENDERERS[expanded]({ ...mockupProps })}
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
