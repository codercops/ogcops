import { useId } from 'react';

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export function ColorPicker({ label, value, onChange }: ColorPickerProps) {
  const id = useId();
  const colorId = `${id}-color`;
  const hexId = `${id}-hex`;
  const displayValue = value.startsWith('#') ? value : `#${value}`;

  return (
    <div className="editor-field">
      <label htmlFor={colorId} className="editor-field-label">
        {label}
      </label>

      <div className="editor-color-row">
        <input
          id={colorId}
          type="color"
          className="editor-color-swatch"
          value={displayValue}
          onChange={(e) => onChange(e.target.value)}
        />

        <input
          id={hexId}
          type="text"
          aria-label={`${label} hex value`}
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
