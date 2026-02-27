interface SliderControlProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export function SliderControl({ label, value, onChange, min = 0, max = 100 }: SliderControlProps) {
  return (
    <div className="editor-field">
      <div className="editor-field-label-row">
        <label className="editor-field-label">{label}</label>
        <span className="editor-field-value">{value}</span>
      </div>
      <input
        type="range"
        className="editor-slider"
        value={value}
        min={min}
        max={max}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}
