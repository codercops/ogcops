import { useId, useState, useEffect, useRef } from 'react';

interface SliderControlProps {
  label: string;
  value: number | '';
  onChange: (value: number | '') => void;
  min?: number;
  max?: number;
  allowEmpty?: boolean;
}

export function SliderControl({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  allowEmpty = false,
}: SliderControlProps) {
  const id = useId();
  const sliderId = `${id}-slider`;
  const numberId = `${id}-number`;

  // Local text input state for typing
  const [textValue, setTextValue] = useState<string>(value === '' ? '' : String(value));
  const isEditingRef = useRef(false);

  // Sync from prop changes when not actively typing or if incoming value matches or resets
  useEffect(() => {
    if (!isEditingRef.current) {
      setTextValue(value === '' ? '' : String(value));
    }
  }, [value]);

  const showSlider = max - min <= 10000;
  const sliderValue = typeof value === 'number' ? value : min;

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextText = e.target.value;
    setTextValue(nextText);

    if (nextText === '') {
      if (allowEmpty) {
        onChange('');
      }
      return;
    }

    if (nextText === '-' || nextText === '+' || nextText.endsWith('.')) {
      return;
    }

    const parsed = Number(nextText);
    if (Number.isFinite(parsed) && parsed >= min && parsed <= max) {
      onChange(parsed);
    }
  };

  const handleBlur = () => {
    isEditingRef.current = false;
    if (textValue === '') {
      if (allowEmpty) {
        onChange('');
        return;
      }
      setTextValue(value === '' ? '' : String(value));
      return;
    }

    const parsed = Number(textValue);
    if (!Number.isFinite(parsed) || parsed < min || parsed > max) {
      setTextValue(value === '' ? '' : String(value));
    } else {
      onChange(parsed);
      setTextValue(String(parsed));
    }
  };

  return (
    <div className="editor-field">
      <div className="editor-field-label-row">
        <label htmlFor={numberId} className="editor-field-label">
          {label}
        </label>
      </div>

      <div className="editor-slider-row">
        {showSlider && (
          <input
            id={sliderId}
            type="range"
            aria-label={`${label} slider`}
            className="editor-slider"
            value={sliderValue}
            min={min}
            max={max}
            onChange={(e) => {
              const num = Number(e.target.value);
              setTextValue(String(num));
              onChange(num);
            }}
          />
        )}
        <input
          id={numberId}
          type="number"
          aria-label={label}
          className="editor-field-input editor-slider-input"
          value={textValue}
          min={min}
          max={max}
          onFocus={() => {
            isEditingRef.current = true;
          }}
          onChange={handleTextChange}
          onBlur={handleBlur}
        />
      </div>
    </div>
  );
}

