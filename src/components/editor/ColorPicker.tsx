interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export function ColorPicker({ label, value, onChange }: ColorPickerProps) {
  const displayValue = value.startsWith('#') ? value : `#${value}`;

  return (
    <div className="editor-field">
      <label className="editor-field-label">{label}</label>
      <div className="editor-color-row">
        <input
          type="color"
          className="editor-color-swatch"
          value={displayValue}
          onChange={(e) => onChange(e.target.value)}
        />
        <input
          type="text"
          className="editor-field-input editor-color-text"
          value={displayValue}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#000000"
          maxLength={7}
        />
      </div>
    </div>
  );
}
