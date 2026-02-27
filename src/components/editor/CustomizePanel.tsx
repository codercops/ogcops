import type { TemplateField } from '@/templates/types';
import { TextInput } from './TextInput';
import { ColorPicker } from './ColorPicker';
import { SliderControl } from './SliderControl';
import { ToggleSwitch } from './ToggleSwitch';
import { FontSelector } from './FontSelector';
import { ImageUploader } from './ImageUploader';

interface CustomizePanelProps {
  fields: TemplateField[];
  params: Record<string, any>;
  onParamChange: (key: string, value: any) => void;
  onReset: () => void;
}

export function CustomizePanel({ fields, params, onParamChange, onReset }: CustomizePanelProps) {
  // Group fields
  const groups: Record<string, TemplateField[]> = {};
  for (const field of fields) {
    const group = field.group || 'Content';
    if (!groups[group]) groups[group] = [];
    groups[group].push(field);
  }

  const groupOrder = ['Content', 'Style', 'Brand'];
  const sortedGroups = groupOrder.filter((g) => groups[g]).map((g) => [g, groups[g]] as const);

  return (
    <div className="customize-panel">
      <div className="customize-header">
        <h3 className="customize-title">Customize</h3>
        <button type="button" className="customize-reset" onClick={onReset}>
          Reset
        </button>
      </div>
      <div className="customize-fields">
        {sortedGroups.map(([groupName, groupFields]) => (
          <div key={groupName} className="customize-group">
            <h4 className="customize-group-title">{groupName}</h4>
            {groupFields.map((field) => renderField(field, params[field.key] ?? field.defaultValue, onParamChange))}
          </div>
        ))}
      </div>
    </div>
  );
}

function renderField(field: TemplateField, value: any, onChange: (key: string, value: any) => void) {
  switch (field.type) {
    case 'text':
      return (
        <TextInput
          key={field.key}
          label={field.label}
          value={String(value || '')}
          onChange={(v) => onChange(field.key, v)}
          placeholder={field.placeholder}
          required={field.required}
        />
      );
    case 'textarea':
      return (
        <TextInput
          key={field.key}
          label={field.label}
          value={String(value || '')}
          onChange={(v) => onChange(field.key, v)}
          placeholder={field.placeholder}
          required={field.required}
          multiline
        />
      );
    case 'color':
      return (
        <ColorPicker
          key={field.key}
          label={field.label}
          value={String(value || '#000000')}
          onChange={(v) => onChange(field.key, v)}
        />
      );
    case 'number':
      return (
        <SliderControl
          key={field.key}
          label={field.label}
          value={Number(value || 0)}
          onChange={(v) => onChange(field.key, v)}
          min={field.min}
          max={field.max}
        />
      );
    case 'toggle':
      return (
        <ToggleSwitch
          key={field.key}
          label={field.label}
          value={Boolean(value)}
          onChange={(v) => onChange(field.key, v)}
        />
      );
    case 'select':
      return (
        <FontSelector
          key={field.key}
          label={field.label}
          value={String(value || '')}
          onChange={(v) => onChange(field.key, v)}
          options={field.options}
        />
      );
    case 'image':
      return (
        <ImageUploader
          key={field.key}
          label={field.label}
          value={String(value || '')}
          onChange={(v) => onChange(field.key, v)}
        />
      );
    default:
      return null;
  }
}
