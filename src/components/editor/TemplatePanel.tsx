import { useMemo } from 'react';
import type { TemplateDefinition, TemplateCategory } from '@/templates/types';
import { CATEGORY_META, ALL_CATEGORIES } from '@/templates/types';
import { TemplateThumbnail } from './TemplateThumbnail';

interface TemplatePanelProps {
  templates: TemplateDefinition[];
  activeTemplateId: string;
  category: TemplateCategory | 'all';
  searchQuery: string;
  onTemplateSelect: (template: TemplateDefinition) => void;
  onCategoryChange: (category: TemplateCategory | 'all') => void;
  onSearchChange: (query: string) => void;
}

export function TemplatePanel({
  templates,
  activeTemplateId,
  category,
  searchQuery,
  onTemplateSelect,
  onCategoryChange,
  onSearchChange,
}: TemplatePanelProps) {
  const filtered = useMemo(() => {
    let result = templates;
    if (category !== 'all') {
      result = result.filter((t) => t.category === category);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }
    return result;
  }, [templates, category, searchQuery]);

  return (
    <div className="template-panel">
      <div className="template-panel-header">
        <input
          type="search"
          className="template-search"
          placeholder="Search templates..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="template-categories">
        <button
          type="button"
          className={`template-cat-pill ${category === 'all' ? 'active' : ''}`}
          onClick={() => onCategoryChange('all')}
        >
          All
        </button>
        {ALL_CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            className={`template-cat-pill ${category === cat ? 'active' : ''}`}
            onClick={() => onCategoryChange(cat)}
          >
            {CATEGORY_META[cat].icon} {CATEGORY_META[cat].label}
          </button>
        ))}
      </div>
      <div className="template-grid">
        {filtered.map((t) => (
          <TemplateThumbnail
            key={t.id}
            id={t.id}
            name={t.name}
            isActive={t.id === activeTemplateId}
            onClick={() => onTemplateSelect(t)}
          />
        ))}
        {filtered.length === 0 && (
          <div className="template-empty">No templates found</div>
        )}
      </div>
    </div>
  );
}
