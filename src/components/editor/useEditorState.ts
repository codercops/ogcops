import { useReducer, useMemo, useCallback } from 'react';
import type { TemplateDefinition, TemplateCategory } from '@/templates/types';

export interface EditorState {
  templateId: string;
  category: TemplateCategory | 'all';
  params: Record<string, any>;
  searchQuery: string;
}

type EditorAction =
  | { type: 'SET_TEMPLATE'; template: TemplateDefinition }
  | { type: 'SET_PARAM'; key: string; value: any }
  | { type: 'SET_PARAMS'; params: Record<string, any> }
  | { type: 'RESET_DEFAULTS'; defaults: Record<string, any> }
  | { type: 'SET_CATEGORY'; category: TemplateCategory | 'all' }
  | { type: 'SET_SEARCH'; query: string };

function reducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    case 'SET_TEMPLATE':
      return {
        ...state,
        templateId: action.template.id,
        params: { ...action.template.defaults },
      };
    case 'SET_PARAM':
      return {
        ...state,
        params: { ...state.params, [action.key]: action.value },
      };
    case 'SET_PARAMS':
      return {
        ...state,
        params: { ...state.params, ...action.params },
      };
    case 'RESET_DEFAULTS':
      return {
        ...state,
        params: { ...action.defaults },
      };
    case 'SET_CATEGORY':
      return { ...state, category: action.category };
    case 'SET_SEARCH':
      return { ...state, searchQuery: action.query };
    default:
      return state;
  }
}

export function useEditorState(initialTemplate: TemplateDefinition) {
  const [state, dispatch] = useReducer(reducer, {
    templateId: initialTemplate.id,
    category: initialTemplate.category,
    params: { ...initialTemplate.defaults },
    searchQuery: '',
  });

  const setTemplate = useCallback((template: TemplateDefinition) => {
    dispatch({ type: 'SET_TEMPLATE', template });
  }, []);

  const setParam = useCallback((key: string, value: any) => {
    dispatch({ type: 'SET_PARAM', key, value });
  }, []);

  const setParams = useCallback((params: Record<string, any>) => {
    dispatch({ type: 'SET_PARAMS', params });
  }, []);

  const resetDefaults = useCallback((defaults: Record<string, any>) => {
    dispatch({ type: 'RESET_DEFAULTS', defaults });
  }, []);

  const setCategory = useCallback((category: TemplateCategory | 'all') => {
    dispatch({ type: 'SET_CATEGORY', category });
  }, []);

  const setSearch = useCallback((query: string) => {
    dispatch({ type: 'SET_SEARCH', query });
  }, []);

  // Build query string shared by both URLs
  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    params.set('template', state.templateId);
    for (const [key, value] of Object.entries(state.params)) {
      if (value !== undefined && value !== null && value !== '') {
        params.set(key, String(value));
      }
    }
    return params.toString();
  }, [state.templateId, state.params]);

  // Production URL for sharing / meta tags
  const apiUrl = useMemo(
    () => `https://og.codercops.com/api/og?${queryString}`,
    [queryString]
  );

  // Relative path for actual download (works in dev and prod)
  const downloadUrl = useMemo(
    () => `/api/og?${queryString}`,
    [queryString]
  );

  return {
    state,
    setTemplate,
    setParam,
    setParams,
    resetDefaults,
    setCategory,
    setSearch,
    apiUrl,
    downloadUrl,
  };
}
