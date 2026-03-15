import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { AIProvider } from '@/lib/ai/types';
import {
  getApiKey,
  getSelectedProvider,
  getSelectedModel,
  hasAnyKeyConfigured,
  setSelectedProvider as storeProvider,
  setSelectedModel as storeModel,
} from '@/lib/ai/storage';
import { getDefaultModel } from '@/lib/ai/providers';

interface AIContextValue {
  /** Whether any provider has a saved key */
  isConfigured: boolean;
  /** Currently selected provider */
  provider: AIProvider | null;
  /** Currently selected model */
  model: string | null;
  /** Open the AI settings modal */
  openSettings: () => void;
  /** Close the AI settings modal */
  closeSettings: () => void;
  /** Whether the settings modal is open */
  settingsOpen: boolean;
  /** Call the AI generate endpoint */
  generate: (prompt: string, systemPrompt?: string) => Promise<string>;
  /** Refresh state from localStorage (call after settings change) */
  refresh: () => void;
}

const AICtx = createContext<AIContextValue | null>(null);

export function AIProvider({ children }: { children: ReactNode }) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);
  const [provider, setProvider] = useState<AIProvider | null>(null);
  const [model, setModel] = useState<string | null>(null);

  const refresh = useCallback(() => {
    setIsConfigured(hasAnyKeyConfigured());
    const p = getSelectedProvider();
    setProvider(p);
    setModel(p ? getSelectedModel(p) ?? getDefaultModel(p) ?? null : null);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const openSettings = useCallback(() => setSettingsOpen(true), []);
  const closeSettings = useCallback(() => {
    setSettingsOpen(false);
    refresh();
  }, [refresh]);

  const generate = useCallback(
    async (prompt: string, systemPrompt?: string): Promise<string> => {
      const currentProvider = getSelectedProvider();
      if (!currentProvider) throw new Error('No AI provider configured');

      const apiKey = getApiKey(currentProvider);
      if (!apiKey) throw new Error('No API key configured');

      const currentModel =
        getSelectedModel(currentProvider) ?? getDefaultModel(currentProvider);
      if (!currentModel) throw new Error('No model selected');

      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: currentProvider,
          apiKey,
          model: currentModel,
          prompt,
          systemPrompt,
          maxTokens: 300,
          temperature: 0.8,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Generation failed' }));
        throw new Error(err.error || `HTTP ${res.status}`);
      }

      const data = await res.json();
      return data.content;
    },
    []
  );

  return (
    <AICtx.Provider
      value={{
        isConfigured,
        provider,
        model,
        openSettings,
        closeSettings,
        settingsOpen,
        generate,
        refresh,
      }}
    >
      {children}
    </AICtx.Provider>
  );
}

export function useAI(): AIContextValue {
  const ctx = useContext(AICtx);
  if (!ctx) throw new Error('useAI must be used within <AIProvider>');
  return ctx;
}
