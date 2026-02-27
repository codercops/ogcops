import type { ViewportSize } from './PlatformMockups';

interface ViewportSwitcherProps {
  value: ViewportSize;
  onChange: (v: ViewportSize) => void;
  compact?: boolean;
}

const VIEWPORTS: { id: ViewportSize; label: string; icon: string; sublabel: string }[] = [
  { id: 'phone', label: 'Phone', icon: '📱', sublabel: 'Mobile' },
  { id: 'tablet', label: 'Tablet', icon: '📋', sublabel: 'Tablet' },
  { id: 'desktop', label: 'Desktop', icon: '🖥', sublabel: 'Desktop' },
];

export function ViewportSwitcher({ value, onChange, compact }: ViewportSwitcherProps) {
  return (
    <div className={`viewport-switcher ${compact ? 'viewport-switcher-compact' : ''}`}>
      {VIEWPORTS.map((vp) => (
        <button
          key={vp.id}
          type="button"
          className={`viewport-btn ${value === vp.id ? 'viewport-btn-active' : ''}`}
          onClick={() => onChange(vp.id)}
          title={`${vp.label} (${vp.sublabel})`}
        >
          <span className="viewport-btn-icon">{vp.icon}</span>
          {!compact && <span className="viewport-btn-label">{vp.label}</span>}
          {!compact && <span className="viewport-btn-size">{vp.sublabel}</span>}
        </button>
      ))}
    </div>
  );
}
