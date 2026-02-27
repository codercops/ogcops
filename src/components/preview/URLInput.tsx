interface URLInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  loading: boolean;
}

export function URLInput({ value, onChange, onSubmit, loading }: URLInputProps) {
  return (
    <div className="preview-url-input">
      <div className="preview-url-row">
        <input
          type="url"
          className="preview-url-field"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSubmit()}
          placeholder="https://example.com"
          aria-label="URL to check"
        />
        <button
          type="button"
          className="preview-url-btn"
          onClick={onSubmit}
          disabled={loading || !value.trim()}
        >
          {loading ? (
            <span className="preview-spinner" />
          ) : (
            'Check'
          )}
        </button>
      </div>
    </div>
  );
}
