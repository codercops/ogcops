import { useEffect, useState, useCallback, useMemo } from 'react';
import type { TemplateDefinition, TemplateCategory } from '@/templates/types';
import { getAllTemplates, getTemplate } from '@/templates/registry';
import { normalizeColorFields } from '@/templates/utils';
import { useEditorState } from './useEditorState';
import { useSatoriRenderer } from './useSatoriRenderer';
import { useDebounce } from './useDebounce';
import { TemplatePanel } from './TemplatePanel';
import { Canvas } from './Canvas';
import { CustomizePanel } from './CustomizePanel';
import { ExportBar } from './ExportBar';
import { PlatformPreviewStrip } from './PlatformPreviewStrip';
import { MobileEditorTabs } from './MobileEditorTabs';
import { AIProvider, useAI } from './AIContext';
import { AISettingsModal } from './AISettingsModal';
import { AIAutofill } from './AIAutofill';

interface EditorAppProps {
  initialCategory?: TemplateCategory;
}

export function EditorApp({ initialCategory }: EditorAppProps) {
  return (
    <AIProvider>
      <EditorAppInner initialCategory={initialCategory} />
    </AIProvider>
  );
}

function AITopbarButton() {
  const { isConfigured, openSettings } = useAI();
  return (
    <button
      type="button"
      className={`ai-topbar-btn ${isConfigured ? 'configured' : ''}`}
      onClick={openSettings}
      title={isConfigured ? 'AI Settings' : 'Set up AI'}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3l1.912 5.813a2 2 0 0 0 1.275 1.275L21 12l-5.813 1.912a2 2 0 0 0-1.275 1.275L12 21l-1.912-5.813a2 2 0 0 0-1.275-1.275L3 12l5.813-1.912a2 2 0 0 0 1.275-1.275L12 3z" />
      </svg>
      {isConfigured ? 'AI' : 'Set up AI'}
    </button>
  );
}

function AISettingsWrapper() {
  const { settingsOpen, closeSettings } = useAI();
  return <AISettingsModal open={settingsOpen} onClose={closeSettings} />;
}

export interface ParsedEditorQueryParams {
  template: TemplateDefinition | null;
  params: Record<string, any>;
  autofillUrl: string | null;
}

export function parseEditorQueryParams(
  search: string | URLSearchParams,
  defaultTemplate: TemplateDefinition
): ParsedEditorQueryParams {
  const searchParams = typeof search === 'string' ? new URLSearchParams(search) : search;
  const templateId = searchParams.get('template');
  let targetTemplate = defaultTemplate;
  let templateToApply: TemplateDefinition | null = null;

  if (templateId) {
    const found = getTemplate(templateId);
    if (found) {
      targetTemplate = found;
      templateToApply = found;
    }
  }

  const fieldMap = new Map(targetTemplate.fields.map((f) => [f.key, f]));
  const params: Record<string, any> = {};

  searchParams.forEach((value, key) => {
    if (key === 'template' || key === 'autofill') return;
    if (fieldMap.has(key)) {
      const field = fieldMap.get(key)!;
      if (field.type === 'toggle') {
        params[key] = value === 'true' || value === '1';
      } else if (field.type === 'number') {
        const num = Number(value);
        if (Number.isFinite(num)) {
          params[key] = num;
        }
      } else {
        params[key] = value;
      }
    } else if (key in targetTemplate.defaults) {
      const defaultVal = targetTemplate.defaults[key];
      if (typeof defaultVal === 'boolean') {
        params[key] = value === 'true' || value === '1';
      } else if (typeof defaultVal === 'number') {
        const num = Number(value);
        if (Number.isFinite(num)) {
          params[key] = num;
        }
      } else {
        params[key] = value;
      }
    }
  });

  const autofillUrl = searchParams.get('autofill');

  return {
    template: templateToApply,
    params,
    autofillUrl,
  };
}

function EditorAppInner({ initialCategory }: EditorAppProps) {
  // Import templates directly — functions can't cross the Astro→React serialization boundary
  const templates = useMemo(() => getAllTemplates(), []);

  const defaultTemplate = useMemo(() => {
    if (initialCategory) {
      return templates.find((t) => t.category === initialCategory) || templates[0];
    }
    return templates[0];
  }, [templates, initialCategory]);

  const { state, setTemplate, setParam, setParams, resetDefaults, setCategory, setSearch, apiUrl, downloadUrl } =
    useEditorState(defaultTemplate);

  const { svg, loading, error, render } = useSatoriRenderer();
  const [mobileTab, setMobileTab] = useState<'templates' | 'customize' | 'export'>('customize');
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth <= 768 : false
  );
  const [autofillUrl, setAutofillUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    setIsMobile(mq.matches);
    return () => mq.removeEventListener('change', handler);
  }, []);

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
      const mergedParams = { ...currentTemplate.defaults, ...debouncedParams };
      const normalizedParams = normalizeColorFields(currentTemplate, mergedParams);
      const element = currentTemplate.render(normalizedParams);
      render(element);
    }
  }, [currentTemplate, debouncedParams, render]);

  // Set initial category if provided
  useEffect(() => {
    if (initialCategory) {
      setCategory(initialCategory);
    }
  }, [initialCategory, setCategory]);

  // Parse query parameters after mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const parsed = parseEditorQueryParams(window.location.search, defaultTemplate);
    if (parsed.template) {
      setTemplate(parsed.template);
      setCategory(parsed.template.category);
    }
    if (Object.keys(parsed.params).length > 0) {
      setParams(parsed.params);
    }
    if (parsed.autofillUrl) {
      setAutofillUrl(parsed.autofillUrl);
    }
  }, [defaultTemplate, setTemplate, setCategory, setParams]);

  const handleTemplateSelect = useCallback(
    (template: TemplateDefinition) => {
      setTemplate(template);
      if (isMobile) {
        setMobileTab('customize');
      }
    },
    [setTemplate, isMobile]
  );

  const handleReset = useCallback(() => {
    if (currentTemplate) {
      resetDefaults(currentTemplate.defaults);
    }
  }, [currentTemplate, resetDefaults]);

  const handleAutofill = useCallback(
    (result: { templateId: string; fields: Record<string, string>; colors?: Record<string, string> }) => {
      // Switch template
      const template = getTemplate(result.templateId);
      if (template) {
        setTemplate(template);
        // Apply autofilled fields after template switch
        setTimeout(() => {
          const merged = { ...result.fields };
          if (result.colors) Object.assign(merged, result.colors);
          setParams(merged);
        }, 0);
      } else {
        // If template not found, just apply fields to current template
        const merged = { ...result.fields };
        if (result.colors) Object.assign(merged, result.colors);
        setParams(merged);
      }
      if (isMobile) setMobileTab('customize');
    },
    [setTemplate, setParams, isMobile]
  );

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
        <AITopbarButton />
        <ExportBar apiUrl={apiUrl} downloadUrl={downloadUrl} params={state.params} templateId={state.templateId} svg={svg} />
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

        {/* Right: Customize / Export */}
        <div className={`editor-right ${mobileTab === 'customize' || mobileTab === 'export' ? 'mobile-show' : 'mobile-hide'}`}>
          {mobileTab === 'export' ? (
            <div className="editor-export-mobile">
              <div className="editor-export-preview">
                <Canvas svg={svg} loading={loading} error={error} />
              </div>
              {/* The topbar ExportBar always mounts and owns the shortcuts, so this second one opts out. */}
              <ExportBar apiUrl={apiUrl} downloadUrl={downloadUrl} params={state.params} templateId={state.templateId} svg={svg} shortcuts={false} />
              <PlatformPreviewStrip
                svg={svg}
                title={String(state.params.title || '')}
                description={String(state.params.description || '')}
                siteName={String(state.params.siteName || '')}
              />
            </div>
          ) : (
            <>
            <CustomizePanel
              fields={currentTemplate.fields}
              params={state.params}
              onParamChange={setParam}
              onReset={handleReset}
              category={currentTemplate.category}
              autofill={<AIAutofill onAutofill={handleAutofill} initialUrl={autofillUrl} />}
            />
            </>
          )}
        </div>
      </div>

      {/* AI Settings Modal */}
      <AISettingsWrapper />
    </div>
  );
}
