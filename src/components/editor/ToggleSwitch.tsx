import { useId } from 'react';

interface ToggleSwitchProps {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
}

export function ToggleSwitch({ label, value, onChange }: ToggleSwitchProps) {
  const id = useId();

  return (
    <div className="editor-field editor-toggle-row">
      <span id={id} className="editor-field-label">
        {label}
      </span>

      <button
        type="button"
        className={`editor-toggle ${value ? 'active' : ''}`}
        onClick={() => onChange(!value)}
        aria-labelledby={id}
        role="switch"
        aria-checked={value}
      >
        <span className="editor-toggle-thumb" />
      </button>
    </div>
  );
}
