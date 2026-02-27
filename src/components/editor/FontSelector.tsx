interface FontSelectorProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options?: { label: string; value: string }[];
}

const defaultFontOptions = [
  { label: 'Inter', value: 'Inter' },
  { label: 'Playfair Display', value: 'Playfair Display' },
  { label: 'JetBrains Mono', value: 'JetBrains Mono' },
];

export function FontSelector({ label, value, onChange, options }: FontSelectorProps) {
  const opts = options || defaultFontOptions;

  return (
    <div className="editor-field">
      <label className="editor-field-label">{label}</label>
      <select
        className="editor-field-input editor-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {opts.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
