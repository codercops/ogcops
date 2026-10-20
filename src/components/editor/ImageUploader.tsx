import { useCallback, useId } from 'react';

interface ImageUploaderProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export function ImageUploader({ label, value, onChange }: ImageUploaderProps) {
  const id = useId();
  const urlId = `${id}-url`;
  const fileId = `${id}-file`;

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
      <label htmlFor={urlId} className="editor-field-label">
        {label}
      </label>

      <input
        id={urlId}
        type="text"
        className="editor-field-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Image URL or upload..."
      />

      <input
        id={fileId}
        className="editor-file-input"
        type="file"
        accept="image/*"
        onChange={handleFile}
      />
      <label htmlFor={fileId} className="editor-upload-btn">
        Upload
      </label>
    </div>
  );
}
