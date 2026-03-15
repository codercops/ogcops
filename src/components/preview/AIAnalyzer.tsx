import { useState, useCallback } from 'react';
import type { MetaTags } from '@/lib/meta-fetcher';
import { getApiKey, getSelectedProvider, getSelectedModel, hasAnyKeyConfigured } from '@/lib/ai/storage';
import { getProvider, getDefaultModel } from '@/lib/ai/providers';

interface AIAnalyzerProps {
  meta: MetaTags;
  url: string;
}

interface AnalysisSection {
  good: string[];
  improvements: string[];
  issues: string[];
  score: number;
  suggestedTitle?: string;
  suggestedDescription?: string;
}

export function AIAnalyzer({ meta, url }: AIAnalyzerProps) {
  const [analysis, setAnalysis] = useState<AnalysisSection | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isConfigured = hasAnyKeyConfigured();

  const handleAnalyze = useCallback(async () => {
    const provider = getSelectedProvider();
    if (!provider) return;
    const apiKey = getApiKey(provider);
    const providerConfig = getProvider(provider);
    if (!apiKey || !providerConfig) return;
    const model = getSelectedModel(provider) ?? getDefaultModel(provider);
    if (!model) return;

    setLoading(true);
    setError(null);

    const metaSummary = Object.entries(meta)
      .filter(([, v]) => v)
      .map(([k, v]) => `${k}: ${String(v).slice(0, 200)}`)
      .join('\n');

    const systemPrompt = `You are an SEO and social media expert. Analyze meta tags for social sharing best practices. Return valid JSON only.`;

    const prompt = `Analyze these meta tags for the URL: ${url}

META TAGS:
${metaSummary}

Return JSON with this shape:
{
  "score": <1-10 quality rating>,
  "good": ["things done well"],
  "improvements": ["suggestions to improve"],
  "issues": ["critical problems"],
  "suggestedTitle": "better title if current is weak (max 60 chars)",
  "suggestedDescription": "better description if current is weak (max 155 chars)"
}

Consider: title length/quality, description quality, OG image presence/dimensions, Twitter card type, missing tags (og:locale, twitter:image:alt), platform-specific truncation risks.`;

    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider,
          apiKey,
          model,
          prompt,
          systemPrompt,
          maxTokens: 500,
          temperature: 0.3,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: 'Analysis failed' }));
        throw new Error(data.error || `HTTP ${res.status}`);
      }

      const data = await res.json();
      const content = data.content.trim();

      // Parse JSON response
      let parsed: AnalysisSection;
      try {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        parsed = JSON.parse(jsonMatch ? jsonMatch[0] : content);
      } catch {
        throw new Error('Could not parse AI response');
      }

      setAnalysis(parsed);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setLoading(false);
    }
  }, [meta, url]);

  if (!isConfigured) {
    return null; // Don't show AI analyzer if no key configured
  }

  return (
    <div className="ai-analyzer">
      {!analysis && (
        <button
          type="button"
          className="ai-analyzer-btn"
          onClick={handleAnalyze}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="ai-spinner-dark" />
              Analyzing...
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3l1.912 5.813a2 2 0 0 0 1.275 1.275L21 12l-5.813 1.912a2 2 0 0 0-1.275 1.275L12 21l-1.912-5.813a2 2 0 0 0-1.275-1.275L3 12l5.813-1.912a2 2 0 0 0 1.275-1.275L12 3z" />
              </svg>
              Analyze with AI
            </>
          )}
        </button>
      )}

      {error && (
        <div className="ai-analyzer-error">{error}</div>
      )}

      {analysis && (
        <div className="ai-analyzer-results">
          <div className="ai-analyzer-header">
            <h4 className="ai-analyzer-title">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3l1.912 5.813a2 2 0 0 0 1.275 1.275L21 12l-5.813 1.912a2 2 0 0 0-1.275 1.275L12 21l-1.912-5.813a2 2 0 0 0-1.275-1.275L3 12l5.813-1.912a2 2 0 0 0 1.275-1.275L12 3z" />
              </svg>
              AI Analysis
            </h4>
            <div className="ai-analyzer-score">
              <span className="ai-analyzer-score-num">{analysis.score}/10</span>
              <div className="ai-analyzer-score-bar">
                <div className="ai-analyzer-score-fill" style={{ width: `${analysis.score * 10}%` }} />
              </div>
            </div>
          </div>

          {analysis.good?.length > 0 && (
            <div className="ai-analyzer-section">
              <h5 className="ai-analyzer-section-title ai-section-good">Good</h5>
              <ul className="ai-analyzer-list">
                {analysis.good.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>
          )}

          {analysis.improvements?.length > 0 && (
            <div className="ai-analyzer-section">
              <h5 className="ai-analyzer-section-title ai-section-warn">Improvements</h5>
              <ul className="ai-analyzer-list">
                {analysis.improvements.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>
          )}

          {analysis.issues?.length > 0 && (
            <div className="ai-analyzer-section">
              <h5 className="ai-analyzer-section-title ai-section-error">Issues</h5>
              <ul className="ai-analyzer-list">
                {analysis.issues.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>
          )}

          {(analysis.suggestedTitle || analysis.suggestedDescription) && (
            <div className="ai-analyzer-section">
              <h5 className="ai-analyzer-section-title">Suggested Rewrites</h5>
              {analysis.suggestedTitle && (
                <div className="ai-analyzer-suggestion">
                  <span className="ai-analyzer-suggestion-label">Title:</span>
                  <span>{analysis.suggestedTitle}</span>
                </div>
              )}
              {analysis.suggestedDescription && (
                <div className="ai-analyzer-suggestion">
                  <span className="ai-analyzer-suggestion-label">Description:</span>
                  <span>{analysis.suggestedDescription}</span>
                </div>
              )}
            </div>
          )}

          <a href={`/create?autofill=${encodeURIComponent(url)}`} className="ai-analyzer-cta">
            Create OG Image for this URL
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
        </div>
      )}
    </div>
  );
}
