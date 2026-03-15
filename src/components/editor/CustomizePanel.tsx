import { useMemo, type ReactNode } from 'react';
import type { TemplateField, TemplateCategory } from '@/templates/types';
import { TextInput } from './TextInput';
import { ColorPicker } from './ColorPicker';
import { SliderControl } from './SliderControl';
import { ToggleSwitch } from './ToggleSwitch';
import { FontSelector } from './FontSelector';
import { ImageUploader } from './ImageUploader';
import { AIGenerateButton } from './AIGenerateButton';

interface CustomizePanelProps {
  fields: TemplateField[];
  params: Record<string, any>;
  onParamChange: (key: string, value: any) => void;
  onReset: () => void;
  category?: TemplateCategory;
  autofill?: ReactNode;
}

export function CustomizePanel({ fields, params, onParamChange, onReset, category, autofill }: CustomizePanelProps) {
  // Group fields
  const groups: Record<string, TemplateField[]> = {};
  for (const field of fields) {
    const group = field.group || 'Content';
    if (!groups[group]) groups[group] = [];
    groups[group].push(field);
  }

  const groupOrder = ['Content', 'Style', 'Brand'];
  const sortedGroups = groupOrder.filter((g) => groups[g]).map((g) => [g, groups[g]] as const);

  // Build string values map for AI context
  const currentValues = useMemo(() => {
    const vals: Record<string, string> = {};
    for (const [k, v] of Object.entries(params)) {
      if (typeof v === 'string' && v.trim()) vals[k] = v;
    }
    return vals;
  }, [params]);

  return (
    <div className="customize-panel">
      <div className="customize-header">
        <h3 className="customize-title">Customize</h3>
        <button type="button" className="customize-reset" onClick={onReset}>
          Reset
        </button>
      </div>
      {autofill}
      <div className="customize-fields">
        {sortedGroups.map(([groupName, groupFields]) => (
          <div key={groupName} className="customize-group">
            <h4 className="customize-group-title">{groupName}</h4>
            {groupFields.map((field) =>
              renderField(field, params[field.key] ?? field.defaultValue, onParamChange, category, currentValues)
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function renderField(
  field: TemplateField,
  value: any,
  onChange: (key: string, value: any) => void,
  category?: TemplateCategory,
  currentValues?: Record<string, string>
) {
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
          action={
            <AIGenerateButton
              fieldName={field.label}
              category={category}
              currentValues={currentValues}
              onSelect={(v) => onChange(field.key, v)}
            />
          }
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
          action={
            <AIGenerateButton
              fieldName={field.label}
              category={category}
              currentValues={currentValues}
              onSelect={(v) => onChange(field.key, v)}
            />
          }
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
