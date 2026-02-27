interface ToggleSwitchProps {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
}

export function ToggleSwitch({ label, value, onChange }: ToggleSwitchProps) {
  return (
    <div className="editor-field editor-toggle-row">
      <label className="editor-field-label">{label}</label>
      <button
        type="button"
        className={`editor-toggle ${value ? 'active' : ''}`}
        onClick={() => onChange(!value)}
        role="switch"
        aria-checked={value}
      >
        <span className="editor-toggle-thumb" />
      </button>
    </div>
  );
}
