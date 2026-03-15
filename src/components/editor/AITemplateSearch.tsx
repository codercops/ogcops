import { useState, useCallback, useRef } from 'react';
import type { TemplateDefinition } from '@/templates/types';
import { getApiKey, getSelectedProvider, getSelectedModel, hasAnyKeyConfigured } from '@/lib/ai/storage';
import { getDefaultModel } from '@/lib/ai/providers';
import { buildRecommenderPrompt, parseRecommenderResponse, type TemplateRecommendation } from '@/lib/ai/recommender';

interface AITemplateSearchProps {
  templates: TemplateDefinition[];
  onTemplateSelect: (template: TemplateDefinition) => void;
}

export function AITemplateSearch({ templates, onTemplateSelect }: AITemplateSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<(TemplateRecommendation & { template: TemplateDefinition })[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const isConfigured = hasAnyKeyConfigured();

  const doSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim() || searchQuery.trim().length < 3) {
      setResults([]);
      return;
    }

    const provider = getSelectedProvider();
    const apiKey = provider ? getApiKey(provider) : null;
    const model = provider ? (getSelectedModel(provider) ?? getDefaultModel(provider)) : null;

    if (!provider || !apiKey || !model) return;

    setLoading(true);
    setError(null);

    try {
      const { prompt, systemPrompt } = buildRecommenderPrompt(searchQuery);

      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider,
          apiKey,
          model,
          prompt,
          systemPrompt,
          maxTokens: 400,
          temperature: 0.3,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: 'Search failed' }));
        throw new Error(data.error || `HTTP ${res.status}`);
      }

      const data = await res.json();
      const recommendations = parseRecommenderResponse(data.content);

      // Match recommendations to actual templates
      const matched = recommendations
        .map((rec) => {
          const template = templates.find((t) => t.id === rec.id);
          return template ? { ...rec, template } : null;
        })
        .filter((r): r is NonNullable<typeof r> => r !== null);

      setResults(matched);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setLoading(false);
    }
  }, [templates]);

  const handleInputChange = useCallback((value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!value.trim()) {
      setResults([]);
      return;
    }
    // Don't auto-search — wait for Enter
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      doSearch(query);
    }
  }, [query, doSearch]);

  if (!isConfigured) return null;

  return (
    <div className="ai-template-search">
      <div className="ai-template-search-row">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ai-template-search-icon">
          <path d="M12 3l1.912 5.813a2 2 0 0 0 1.275 1.275L21 12l-5.813 1.912a2 2 0 0 0-1.275 1.275L12 21l-1.912-5.813a2 2 0 0 0-1.275-1.275L3 12l5.813-1.912a2 2 0 0 0 1.275-1.275L12 3z" />
        </svg>
        <input
          type="text"
          className="ai-template-search-input"
          placeholder="Describe your OG image... (Enter to search)"
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        {loading && <span className="ai-spinner-dark" />}
      </div>

      {error && (
        <div className="ai-template-search-error">{error}</div>
      )}

      {results.length > 0 && (
        <div className="ai-template-search-results">
          {results.map((r) => (
            <button
              key={r.id}
              type="button"
              className="ai-template-search-result"
              onClick={() => onTemplateSelect(r.template)}
            >
              <img
                src={`/api/templates/${r.id}/thumbnail.png`}
                alt={r.template.name}
                className="ai-template-search-thumb"
                loading="lazy"
              />
              <div className="ai-template-search-info">
                <span className="ai-template-search-name">{r.template.name}</span>
                <span className="ai-template-search-reason">{r.reason}</span>
                <span className="ai-template-search-score">{r.score}% match</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
