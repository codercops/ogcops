import { useId, useRef } from 'react';
import { normalizeHexColor } from '@/templates/utils';

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export function ColorPicker({ label, value, onChange }: ColorPickerProps) {
  const id = useId();
  const colorId = `${id}-color`;
  const hexId = `${id}-hex`;
  const displayValue = value && !value.startsWith('#') ? `#${value}` : value;
  const lastValid = useRef('#000000');
  lastValid.current = normalizeHexColor(value, lastValid.current);

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
          value={lastValid.current}
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
