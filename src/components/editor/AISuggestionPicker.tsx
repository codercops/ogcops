import { useEffect, useRef, useState } from 'react';

interface AISuggestionPickerProps {
  suggestions: string[];
  onSelect: (value: string) => void;
  onRegenerate: () => void;
  onClose: () => void;
  loading?: boolean;
}

export function AISuggestionPicker({
  suggestions,
  onSelect,
  onRegenerate,
  onClose,
  loading,
}: AISuggestionPickerProps) {
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  // Click outside to close
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((i) => (i < suggestions.length - 1 ? i + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((i) => (i > 0 ? i - 1 : suggestions.length - 1));
      } else if (e.key === 'Enter' && activeIndex >= 0) {
        e.preventDefault();
        onSelect(suggestions[activeIndex]);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [activeIndex, suggestions, onSelect, onClose]);

  return (
    <div className="ai-picker" ref={containerRef}>
      <div className="ai-picker-header">
        <span className="ai-picker-title">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3l1.912 5.813a2 2 0 0 0 1.275 1.275L21 12l-5.813 1.912a2 2 0 0 0-1.275 1.275L12 21l-1.912-5.813a2 2 0 0 0-1.275-1.275L3 12l5.813-1.912a2 2 0 0 0 1.275-1.275L12 3z" />
          </svg>
          Pick a suggestion
        </span>
      </div>
      <div className="ai-picker-list">
        {loading ? (
          <div className="ai-picker-loading">
            <span className="ai-spinner-dark" />
            Generating...
          </div>
        ) : (
          suggestions.map((s, i) => (
            <button
              key={i}
              type="button"
              className={`ai-picker-option ${activeIndex === i ? 'active' : ''}`}
              onClick={() => onSelect(s)}
              onMouseEnter={() => setActiveIndex(i)}
            >
              {s}
            </button>
          ))
        )}
      </div>
      <div className="ai-picker-footer">
        <button
          type="button"
          className="ai-picker-btn"
          onClick={onRegenerate}
          disabled={loading}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" />
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
          </svg>
          Regenerate
        </button>
        <button
          type="button"
          className="ai-picker-btn"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
