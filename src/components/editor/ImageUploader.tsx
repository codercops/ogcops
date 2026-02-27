import { useCallback } from 'react';

interface ImageUploaderProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export function ImageUploader({ label, value, onChange }: ImageUploaderProps) {
  const handleFile = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          onChange(reader.result);
        }
      };
      reader.readAsDataURL(file);
    },
    [onChange]
  );

  return (
    <div className="editor-field">
      <label className="editor-field-label">{label}</label>
      <input
        type="text"
        className="editor-field-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Image URL or upload..."
      />
      <label className="editor-upload-btn">
        Upload
        <input type="file" accept="image/*" onChange={handleFile} hidden />
      </label>
    </div>
  );
}
