import type { ReactNode } from 'react';
import type { PlatformId } from '@/lib/platform-specs';

export type ViewportSize = 'phone' | 'tablet' | 'desktop';

export interface MockupProps {
  imageUri: string | null;
  title: string;
  description: string;
  domain: string;
  viewport?: ViewportSize;
}

export const PLATFORM_WIDTHS: Record<PlatformId, Record<ViewportSize, number>> = {
  twitter:  { phone: 340, tablet: 508, desktop: 508 },
  facebook: { phone: 350, tablet: 470, desktop: 470 },
  linkedin: { phone: 340, tablet: 552, desktop: 552 },
  discord:  { phone: 300, tablet: 520, desktop: 520 },
  slack:    { phone: 300, tablet: 360, desktop: 360 },
  reddit:   { phone: 350, tablet: 640, desktop: 640 },
  whatsapp: { phone: 270, tablet: 370, desktop: 370 },
  google:   { phone: 340, tablet: 600, desktop: 600 },
};

export function getPlatformWidth(platform: PlatformId, viewport: ViewportSize): number {
  return PLATFORM_WIDTHS[platform][viewport];
}

function truncate(text: string, max: number): string {
  if (!text) return '';
  return text.length > max ? text.slice(0, max) + '...' : text;
}

function NoImage() {
  return (
    <div style={{
      aspectRatio: '1.91/1', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#F3F4F6', color: '#9CA3AF', fontSize: 11, fontWeight: 500,
    }}>
      No OG image
    </div>
  );
}

function SquareNoImage({ size = 56 }: { size?: number }) {
  return (
    <div style={{
      width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#F3F4F6', color: '#9CA3AF', fontSize: 9, borderRadius: 4,
    }}>
      ?
    </div>
  );
}

/* ─────────────────────────────────────────────
   Twitter / X  — same layout all sizes
   ───────────────────────────────────────────── */
function TwitterMockup({ imageUri, title, description, domain }: MockupProps) {
  return (
    <div style={{
      borderRadius: 12, overflow: 'hidden',
      border: '1px solid #CFD9DE', background: '#fff',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }}>
      {imageUri ? (
        <div style={{ aspectRatio: '1.91/1', overflow: 'hidden', borderBottom: '1px solid #CFD9DE' }}>
          <img src={imageUri} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        </div>
      ) : <NoImage />}
      <div style={{ padding: '10px 12px' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#0F1419', lineHeight: '18px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {truncate(title || 'Your Title', 70)}
        </div>
        <div style={{ fontSize: 13, color: '#536471', lineHeight: '16px', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {truncate(description, 100)}
        </div>
        <div style={{ fontSize: 11, color: '#536471', marginTop: 3 }}>
          {domain}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Facebook — same layout all sizes
   ───────────────────────────────────────────── */
function FacebookMockup({ imageUri, title, description, domain }: MockupProps) {
  return (
    <div style={{
      borderRadius: 8, overflow: 'hidden',
      border: '1px solid #DADDE1', background: '#fff',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
    }}>
      {imageUri ? (
        <div style={{ aspectRatio: '1.91/1', overflow: 'hidden' }}>
          <img src={imageUri} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        </div>
      ) : <NoImage />}
      <div style={{ padding: '10px 12px', background: '#F0F2F5' }}>
        <div style={{ fontSize: 10, color: '#65676B', textTransform: 'uppercase' as const, letterSpacing: '0.03em' }}>
          {domain.toUpperCase()}
        </div>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#050505', lineHeight: '17px', marginTop: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {truncate(title || 'Your Title', 65)}
        </div>
        <div style={{ fontSize: 11, color: '#65676B', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {truncate(description, 80)}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   LinkedIn — 2024: always compact horizontal card
   (square thumbnail left, title + domain right)
   ───────────────────────────────────────────── */
function LinkedInMockup({ imageUri, title, domain, viewport = 'desktop' }: MockupProps) {
  const thumbSize = viewport === 'phone' ? 80 : 104;

  return (
    <div style={{
      borderRadius: 8, overflow: 'hidden',
      border: '1px solid #E0E0E0', background: '#EEF3F8',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      display: 'flex', minHeight: thumbSize,
    }}>
      <div style={{ width: thumbSize, height: thumbSize, flexShrink: 0, overflow: 'hidden' }}>
        {imageUri ? (
          <img src={imageUri} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', background: '#D9DEE3', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF', fontSize: 9 }}>?</div>
        )}
      </div>
      <div style={{ padding: '10px 12px', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#000000e6', lineHeight: '18px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {truncate(title || 'Your Title', 70)}
        </div>
        <div style={{ fontSize: 12, color: '#00000099', marginTop: 3 }}>
          {domain}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Discord — same structure, narrower on mobile
   ───────────────────────────────────────────── */
function DiscordMockup({ imageUri, title, description, domain }: MockupProps) {
  return (
    <div style={{
      borderRadius: 4, overflow: 'hidden',
      background: '#2B2D31', display: 'flex',
      fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
    }}>
      <div style={{ width: 4, flexShrink: 0, background: '#5865F2' }} />
      <div style={{ padding: '8px 12px 10px', overflow: 'hidden', flex: 1 }}>
        <div style={{ fontSize: 10, color: '#B5BAC1' }}>
          {domain}
        </div>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#00A8FC', lineHeight: '17px', marginTop: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {truncate(title || 'Your Title', 80)}
        </div>
        <div style={{ fontSize: 11, color: '#DBDEE1', lineHeight: '15px', marginTop: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {truncate(description, 100)}
        </div>
        {imageUri && (
          <div style={{ marginTop: 8, borderRadius: 4, overflow: 'hidden', maxWidth: '100%' }}>
            <img src={imageUri} alt="" style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 4 }} />
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Slack — desktop: text left + thumbnail right
           mobile: text top, full-width image below
   ───────────────────────────────────────────── */
function SlackMockup({ imageUri, title, description, domain, viewport = 'desktop' }: MockupProps) {
  const isMobile = viewport === 'phone';

  return (
    <div style={{
      display: 'flex', overflow: 'hidden', background: '#fff',
      fontFamily: '"Lato", -apple-system, BlinkMacSystemFont, sans-serif',
    }}>
      <div style={{ width: 4, flexShrink: 0, background: '#DDDDDD', borderRadius: '2px 0 0 2px' }} />
      <div style={{ padding: '6px 10px', overflow: 'hidden', flex: 1 }}>
        {isMobile ? (
          /* Mobile: stacked — text then image below */
          <>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#1D1C1D', display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 12, height: 12, borderRadius: 3, background: '#E0E0E0', display: 'inline-block', flexShrink: 0 }} />
              {domain}
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#1264A3', lineHeight: '16px', marginTop: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {truncate(title || 'Your Title', 60)}
            </div>
            <div style={{ fontSize: 11, color: '#1D1C1D', lineHeight: '15px', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {truncate(description, 80)}
            </div>
            {imageUri && (
              <div style={{ marginTop: 6, borderRadius: 4, overflow: 'hidden' }}>
                <img src={imageUri} alt="" style={{ width: '100%', height: 'auto', display: 'block' }} />
              </div>
            )}
          </>
        ) : (
          /* Desktop/Tablet: side-by-side */
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#1D1C1D', display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 12, height: 12, borderRadius: 3, background: '#E0E0E0', display: 'inline-block', flexShrink: 0 }} />
                {domain}
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#1264A3', lineHeight: '16px', marginTop: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {truncate(title || 'Your Title', 60)}
              </div>
              <div style={{ fontSize: 11, color: '#1D1C1D', lineHeight: '15px', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {truncate(description, 80)}
              </div>
            </div>
            {imageUri ? (
              <div style={{ width: 60, height: 60, flexShrink: 0, borderRadius: 4, overflow: 'hidden' }}>
                <img src={imageUri} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </div>
            ) : <SquareNoImage size={60} />}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Reddit — same layout all sizes
   ───────────────────────────────────────────── */
function RedditMockup({ imageUri, title, domain }: MockupProps) {
  return (
    <div style={{
      borderRadius: 12, overflow: 'hidden',
      border: '1px solid #EDEFF1', background: '#fff',
      fontFamily: '"IBM Plex Sans", Arial, sans-serif',
    }}>
      <div style={{ fontSize: 9, color: '#787C7E', padding: '8px 10px 4px', display: 'flex', alignItems: 'center', gap: 4 }}>
        <span style={{ width: 14, height: 14, borderRadius: '50%', background: '#FF4500', display: 'inline-block', flexShrink: 0 }} />
        r/webdev &middot; Posted by u/you
      </div>
      <div style={{ fontSize: 13, fontWeight: 500, color: '#222', padding: '0 10px 6px', lineHeight: '17px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {truncate(title || 'Your Title', 100)}
      </div>
      {imageUri ? (
        <div style={{ aspectRatio: '1.91/1', overflow: 'hidden' }}>
          <img src={imageUri} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        </div>
      ) : <NoImage />}
      <div style={{ padding: '4px 10px 8px' }}>
        <span style={{ fontSize: 10, color: '#4FBCFF' }}>{domain}</span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   WhatsApp — same layout, narrower on phone
   ───────────────────────────────────────────── */
function WhatsAppMockup({ imageUri, title, description, domain }: MockupProps) {
  return (
    <div style={{
      borderRadius: 8, overflow: 'hidden',
      background: '#DCF8C6', maxWidth: '100%',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }}>
      <div style={{ background: '#D4EFB9', overflow: 'hidden', borderRadius: '8px 8px 0 0' }}>
        {imageUri ? (
          <div style={{ aspectRatio: '1.91/1', overflow: 'hidden' }}>
            <img src={imageUri} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          </div>
        ) : <NoImage />}
        <div style={{ padding: '6px 10px 8px' }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#303030', lineHeight: '15px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {truncate(title || 'Your Title', 65)}
          </div>
          <div style={{ fontSize: 10, color: '#8696A0', lineHeight: '13px', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {truncate(description, 80)}
          </div>
          <div style={{ fontSize: 9, color: '#8696A0', marginTop: 3 }}>
            {domain}
          </div>
        </div>
      </div>
      <div style={{ padding: '4px 10px 6px', display: 'flex', justifyContent: 'flex-end' }}>
        <span style={{ fontSize: 9, color: '#667781' }}>10:42 AM</span>
        <span style={{ fontSize: 9, color: '#53BDEB', marginLeft: 4 }}>✓✓</span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Google — desktop: text left + thumbnail right
            mobile: image above, larger title, no side thumb
   ───────────────────────────────────────────── */
function GoogleMockup({ imageUri, title, description, domain, viewport = 'desktop' }: MockupProps) {
  const isMobile = viewport === 'phone';

  if (isMobile) {
    return (
      <div style={{ background: '#fff', overflow: 'hidden', fontFamily: 'Arial, sans-serif' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
          <span style={{ width: 18, height: 18, borderRadius: '50%', background: '#F1F3F4', display: 'inline-block', flexShrink: 0 }} />
          <span style={{ fontSize: 12, color: '#4D5156' }}>{domain}</span>
        </div>
        <div style={{ fontSize: 18, fontWeight: 400, color: '#1A0DAB', lineHeight: '24px', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {truncate(title || 'Your Title', 55)}
        </div>
        {imageUri && (
          <div style={{ borderRadius: 8, overflow: 'hidden', marginBottom: 6, border: '1px solid #DDDFE2' }}>
            <img src={imageUri} alt="" style={{ width: '100%', height: 'auto', display: 'block' }} />
          </div>
        )}
        <div style={{ fontSize: 13, color: '#4D5156', lineHeight: '18px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const }}>
          {truncate(description, 120)}
        </div>
      </div>
    );
  }

  // Desktop/Tablet: text left, thumbnail right
  return (
    <div style={{
      background: '#fff', overflow: 'hidden',
      fontFamily: 'Arial, sans-serif', display: 'flex', gap: 14,
    }}>
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
          <span style={{ width: 16, height: 16, borderRadius: '50%', background: '#F1F3F4', display: 'inline-block', flexShrink: 0 }} />
          <span style={{ fontSize: 12, color: '#4D5156' }}>{domain}</span>
        </div>
        <div style={{ fontSize: 18, fontWeight: 400, color: '#1A0DAB', lineHeight: '22px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {truncate(title || 'Your Title', 60)}
        </div>
        <div style={{ fontSize: 12, color: '#4D5156', lineHeight: '18px', marginTop: 4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const }}>
          {truncate(description, 160)}
        </div>
      </div>
      {imageUri ? (
        <div style={{ width: 92, height: 92, flexShrink: 0, borderRadius: 8, overflow: 'hidden', border: '1px solid #DDDFE2' }}>
          <img src={imageUri} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        </div>
      ) : <SquareNoImage size={92} />}
    </div>
  );
}

export const MOCKUP_RENDERERS: Record<PlatformId, (props: MockupProps) => ReactNode> = {
  twitter: TwitterMockup,
  facebook: FacebookMockup,
  linkedin: LinkedInMockup,
  discord: DiscordMockup,
  slack: SlackMockup,
  reddit: RedditMockup,
  whatsapp: WhatsAppMockup,
  google: GoogleMockup,
};

export const PLATFORM_ORDER: { id: PlatformId; name: string }[] = [
  { id: 'twitter', name: 'Twitter / X' },
  { id: 'facebook', name: 'Facebook' },
  { id: 'linkedin', name: 'LinkedIn' },
  { id: 'discord', name: 'Discord' },
  { id: 'slack', name: 'Slack' },
  { id: 'reddit', name: 'Reddit' },
  { id: 'whatsapp', name: 'WhatsApp' },
  { id: 'google', name: 'Google Search' },
];
