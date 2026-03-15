import { useState, useCallback } from 'react';
import { useAI } from './AIContext';
import { generateSuggestions } from '@/lib/ai/generate';
import { AISuggestionPicker } from './AISuggestionPicker';
import type { GenerateContext } from '@/lib/ai/prompts';

interface AIGenerateButtonProps {
  fieldName: string;
  category?: string;
  currentValues?: Record<string, string>;
  onSelect: (value: string) => void;
}

export function AIGenerateButton({ fieldName, category, currentValues, onSelect }: AIGenerateButtonProps) {
  const { isConfigured, openSettings } = useAI();
  const [showPicker, setShowPicker] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const doGenerate = useCallback(async () => {
    setLoading(true);
    setError(null);
    setSuggestions([]);
    setShowPicker(true);

    const ctx: GenerateContext = {
      fieldName,
      category,
      currentValues,
      count: 3,
    };

    try {
      const results = await generateSuggestions(ctx);
      setSuggestions(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed');
      setShowPicker(false);
    } finally {
      setLoading(false);
    }
  }, [fieldName, category, currentValues]);

  const handleClick = useCallback(() => {
    if (!isConfigured) {
      openSettings();
      return;
    }
    doGenerate();
  }, [isConfigured, openSettings, doGenerate]);

  const handleSelect = useCallback(
    (value: string) => {
      onSelect(value);
      setShowPicker(false);
    },
    [onSelect]
  );

  const handleClose = useCallback(() => {
    setShowPicker(false);
  }, []);

  return (
    <div className="ai-generate-wrapper">
      <button
        type="button"
        className={`ai-generate-btn ${error ? 'error' : ''}`}
        onClick={handleClick}
        title={isConfigured ? `Generate ${fieldName} with AI` : 'Set up AI to generate suggestions'}
      >
        {loading ? (
          <span className="ai-spinner-dark" />
        ) : (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3l1.912 5.813a2 2 0 0 0 1.275 1.275L21 12l-5.813 1.912a2 2 0 0 0-1.275 1.275L12 21l-1.912-5.813a2 2 0 0 0-1.275-1.275L3 12l5.813-1.912a2 2 0 0 0 1.275-1.275L12 3z" />
          </svg>
        )}
        AI
      </button>
      {showPicker && (
        <AISuggestionPicker
          suggestions={suggestions}
          onSelect={handleSelect}
          onRegenerate={doGenerate}
          onClose={handleClose}
          loading={loading}
        />
      )}
      {error && !showPicker && (
        <div className="ai-generate-error" title={error}>
          {error}
        </div>
      )}
    </div>
  );
}
