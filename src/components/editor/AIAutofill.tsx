import { useState, useCallback } from 'react';
import { useAI } from './AIContext';
import { getApiKey, getSelectedProvider, getSelectedModel } from '@/lib/ai/storage';
import { getDefaultModel } from '@/lib/ai/providers';

interface AIAutofillProps {
  onAutofill: (result: { templateId: string; fields: Record<string, string>; colors?: Record<string, string> }) => void;
}

type Step = 'idle' | 'fetching' | 'analyzing' | 'generating' | 'done' | 'error';

export function AIAutofill({ onAutofill }: AIAutofillProps) {
  const { isConfigured, openSettings } = useAI();
  const [url, setUrl] = useState('');
  const [step, setStep] = useState<Step>('idle');
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  const handleAutofill = useCallback(async () => {
    if (!url.trim()) return;

    if (!isConfigured) {
      openSettings();
      return;
    }

    const provider = getSelectedProvider();
    const apiKey = provider ? getApiKey(provider) : null;
    const model = provider ? (getSelectedModel(provider) ?? getDefaultModel(provider)) : null;

    if (!provider || !apiKey || !model) {
      openSettings();
      return;
    }

    setError(null);
    setStep('fetching');

    try {
      setStep('analyzing');

      const res = await fetch('/api/ai/autofill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider,
          apiKey,
          model,
          url: url.trim().startsWith('http') ? url.trim() : `https://${url.trim()}`,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: 'Autofill failed' }));
        throw new Error(data.error || `HTTP ${res.status}`);
      }

      setStep('generating');
      const result = await res.json();

      onAutofill(result);
      setStep('done');
      setTimeout(() => {
        setStep('idle');
        setExpanded(false);
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Autofill failed');
      setStep('error');
    }
  }, [url, isConfigured, openSettings, onAutofill]);

  if (!expanded) {
    return (
      <button
        type="button"
        className="ai-autofill-trigger"
        onClick={() => setExpanded(true)}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3l1.912 5.813a2 2 0 0 0 1.275 1.275L21 12l-5.813 1.912a2 2 0 0 0-1.275 1.275L12 21l-1.912-5.813a2 2 0 0 0-1.275-1.275L3 12l5.813-1.912a2 2 0 0 0 1.275-1.275L12 3z" />
        </svg>
        Smart Autofill
      </button>
    );
  }

  return (
    <div className="ai-autofill">
      <div className="ai-autofill-header">
        <span className="ai-autofill-title">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3l1.912 5.813a2 2 0 0 0 1.275 1.275L21 12l-5.813 1.912a2 2 0 0 0-1.275 1.275L12 21l-1.912-5.813a2 2 0 0 0-1.275-1.275L3 12l5.813-1.912a2 2 0 0 0 1.275-1.275L12 3z" />
          </svg>
          Smart Autofill
        </span>
        <button type="button" className="ai-autofill-close" onClick={() => { setExpanded(false); setStep('idle'); setError(null); }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
      <p className="ai-autofill-desc">Paste a URL and we'll generate your OG image automatically.</p>
      <div className="ai-autofill-input-row">
        <input
          type="url"
          className="ai-autofill-input"
          placeholder="https://example.com/blog-post"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleAutofill(); }}
          disabled={step !== 'idle' && step !== 'error'}
        />
        <button
          type="button"
          className="ai-btn ai-btn-validate"
          onClick={handleAutofill}
          disabled={!url.trim() || (step !== 'idle' && step !== 'error')}
          style={{ flexShrink: 0 }}
        >
          {step === 'idle' || step === 'error' ? 'Generate' : 'Working...'}
        </button>
      </div>

      {(step !== 'idle' && step !== 'error') && (
        <div className="ai-autofill-steps">
          <div className={`ai-autofill-step ${step === 'fetching' || step === 'analyzing' || step === 'generating' || step === 'done' ? 'done' : ''}`}>
            {step === 'fetching' ? <span className="ai-spinner-dark" /> : '✓'} Fetching page content
          </div>
          <div className={`ai-autofill-step ${step === 'analyzing' || step === 'generating' || step === 'done' ? 'active' : ''} ${step === 'generating' || step === 'done' ? 'done' : ''}`}>
            {step === 'analyzing' ? <span className="ai-spinner-dark" /> : step === 'generating' || step === 'done' ? '✓' : '○'} Selecting best template
          </div>
          <div className={`ai-autofill-step ${step === 'generating' || step === 'done' ? 'active' : ''} ${step === 'done' ? 'done' : ''}`}>
            {step === 'generating' ? <span className="ai-spinner-dark" /> : step === 'done' ? '✓' : '○'} Generating content
          </div>
        </div>
      )}

      {error && (
        <div className="ai-status ai-status-error" style={{ marginTop: '8px' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
          </svg>
          {error}
        </div>
      )}
    </div>
  );
}
