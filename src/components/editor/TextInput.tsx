import type { ReactNode } from 'react';

interface TextInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  multiline?: boolean;
  /** Optional element rendered inline after the label (e.g. AI generate button) */
  action?: ReactNode;
}

export function TextInput({ label, value, onChange, placeholder, required, multiline, action }: TextInputProps) {
  const id = `field-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className="editor-field">
      <div className="editor-field-label-row">
        <label htmlFor={id} className="editor-field-label">
          {label}
          {required && <span className="editor-field-required">*</span>}
        </label>
        {action}
      </div>
      {multiline ? (
        <textarea
          id={id}
          className="editor-field-input editor-field-textarea"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
        />
      ) : (
        <input
          id={id}
          type="text"
          className="editor-field-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      )}
    </div>
  );
}
