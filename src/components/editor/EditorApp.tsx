import { useEffect, useState, useCallback, useMemo } from 'react';
import type { TemplateDefinition, TemplateCategory } from '@/templates/types';
import { getAllTemplates, getTemplate } from '@/templates/registry';
import { useEditorState } from './useEditorState';
import { useSatoriRenderer } from './useSatoriRenderer';
import { useDebounce } from './useDebounce';
import { TemplatePanel } from './TemplatePanel';
import { Canvas } from './Canvas';
import { CustomizePanel } from './CustomizePanel';
import { ExportBar } from './ExportBar';
import { PlatformPreviewStrip } from './PlatformPreviewStrip';
import { MobileEditorTabs } from './MobileEditorTabs';

interface EditorAppProps {
  initialCategory?: TemplateCategory;
}

export function EditorApp({ initialCategory }: EditorAppProps) {
  // Import templates directly — functions can't cross the Astro→React serialization boundary
  const templates = useMemo(() => getAllTemplates(), []);

  const defaultTemplate = useMemo(() => {
    if (initialCategory) {
      return templates.find((t) => t.category === initialCategory) || templates[0];
    }
    return templates[0];
  }, [templates, initialCategory]);

  const { state, setTemplate, setParam, resetDefaults, setCategory, setSearch, apiUrl, downloadUrl } =
    useEditorState(defaultTemplate);

  const { svg, loading, error, render } = useSatoriRenderer();
  const [mobileTab, setMobileTab] = useState<'templates' | 'customize' | 'export'>('customize');

  // Find current template definition (use registry lookup to ensure render function is present)
  const currentTemplate = useMemo(
    () => getTemplate(state.templateId) || defaultTemplate,
    [state.templateId, defaultTemplate]
  );

  // Debounce params for rendering
  const debouncedParams = useDebounce(state.params, 150);

  // Re-render on param or template change
  useEffect(() => {
    if (currentTemplate) {
      const element = currentTemplate.render(debouncedParams);
      render(element);
    }
  }, [currentTemplate, debouncedParams, render]);

  // Set initial category if provided
  useEffect(() => {
    if (initialCategory) {
      setCategory(initialCategory);
    }
  }, [initialCategory, setCategory]);

  const handleTemplateSelect = useCallback(
    (template: TemplateDefinition) => {
      setTemplate(template);
      // On mobile, switch to Customize tab so user sees the canvas and form
      if (typeof window !== 'undefined' && window.innerWidth <= 768) {
        setMobileTab('customize');
      }
    },
    [setTemplate]
  );

  const handleReset = useCallback(() => {
    if (currentTemplate) {
      resetDefaults(currentTemplate.defaults);
    }
  }, [currentTemplate, resetDefaults]);

  return (
    <div className="editor-layout">
      {/* Top Bar */}
      <div className="editor-topbar">
        <a href="/" className="editor-logo">
          <img src="/logo.svg" alt="OGCOPS" className="editor-logo-img" width="100" height="25" />
        </a>
        <div className="editor-topbar-template">
          <span className="editor-topbar-label">Template:</span>
          <span className="editor-topbar-name">{currentTemplate.name}</span>
        </div>
        <ExportBar apiUrl={apiUrl} downloadUrl={downloadUrl} params={state.params} templateId={state.templateId} />
      </div>

      {/* Mobile Tabs */}
      <div className="editor-mobile-tabs-wrapper">
        <MobileEditorTabs activeTab={mobileTab} onTabChange={setMobileTab} />
      </div>

      {/* Desktop 3-Panel Layout */}
      <div className="editor-panels">
        {/* Left: Template Browser */}
        <div className={`editor-left ${mobileTab === 'templates' ? 'mobile-show' : 'mobile-hide'}`}>
          <TemplatePanel
            templates={templates}
            activeTemplateId={state.templateId}
            category={state.category}
            searchQuery={state.searchQuery}
            onTemplateSelect={handleTemplateSelect}
            onCategoryChange={setCategory}
            onSearchChange={setSearch}
          />
        </div>

        {/* Center: Canvas + Platform Previews */}
        <div className={`editor-center ${mobileTab !== 'templates' ? 'mobile-show' : 'mobile-hide'}`}>
          <Canvas svg={svg} loading={loading} error={error} />
          <PlatformPreviewStrip
            svg={svg}
            title={String(state.params.title || '')}
            description={String(state.params.description || '')}
            siteName={String(state.params.siteName || '')}
          />
        </div>

        {/* Right: Customize */}
        <div className={`editor-right ${mobileTab === 'customize' || mobileTab === 'export' ? 'mobile-show' : 'mobile-hide'}`}>
          {mobileTab === 'export' ? (
            <div className="editor-export-mobile">
              <ExportBar apiUrl={apiUrl} downloadUrl={downloadUrl} params={state.params} templateId={state.templateId} />
            </div>
          ) : (
            <CustomizePanel
              fields={currentTemplate.fields}
              params={state.params}
              onParamChange={setParam}
              onReset={handleReset}
            />
          )}
        </div>
      </div>
    </div>
  );
}
