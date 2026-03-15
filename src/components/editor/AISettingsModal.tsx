import { useState, useEffect, useCallback, useRef } from 'react';
import type { AIProvider as AIProviderType } from '@/lib/ai/types';
import { AI_PROVIDERS } from '@/lib/ai/types';
import { getAllProviders, getModelsForProvider, getDefaultModel } from '@/lib/ai/providers';
import {
  getApiKey,
  setApiKey,
  removeApiKey,
  getSelectedProvider,
  setSelectedProvider,
  getSelectedModel,
  setSelectedModel,
} from '@/lib/ai/storage';

interface AISettingsModalProps {
  open: boolean;
  onClose: () => void;
}

type ValidationStatus = 'idle' | 'validating' | 'valid' | 'invalid' | 'error';

const PROVIDERS = getAllProviders();

export function AISettingsModal({ open, onClose }: AISettingsModalProps) {
  const [activeProvider, setActiveProvider] = useState<AIProviderType>(() => getSelectedProvider() ?? 'openai');
  const [keyValue, setKeyValue] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [selectedModel, setModelLocal] = useState('');
  const [status, setStatus] = useState<ValidationStatus>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const overlayRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load stored values when provider changes
  useEffect(() => {
    const storedKey = getApiKey(activeProvider) ?? '';
    setKeyValue(storedKey);
    setShowKey(false);
    const storedModel = getSelectedModel(activeProvider) ?? getDefaultModel(activeProvider) ?? '';
    setModelLocal(storedModel);
    setStatus(storedKey ? 'idle' : 'idle');
    setStatusMessage('');
  }, [activeProvider]);

  // Focus input on open
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  // ESC to close
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  const handleProviderChange = useCallback((id: AIProviderType) => {
    setActiveProvider(id);
    setSelectedProvider(id);
  }, []);

  const handleKeyChange = useCallback(
    (value: string) => {
      const trimmed = value.trim();
      setKeyValue(trimmed);
      setStatus('idle');
      setStatusMessage('');
      // Auto-save as user types
      if (trimmed) {
        setApiKey(activeProvider, trimmed);
      }
    },
    [activeProvider]
  );

  const handleModelChange = useCallback(
    (modelId: string) => {
      setModelLocal(modelId);
      setSelectedModel(activeProvider, modelId);
    },
    [activeProvider]
  );

  const handleValidate = useCallback(async () => {
    if (!keyValue) return;
    setStatus('validating');
    setStatusMessage('');

    try {
      const res = await fetch('/api/ai/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider: activeProvider, apiKey: keyValue }),
      });

      const data = await res.json();
      if (data.valid) {
        setStatus('valid');
        setStatusMessage('Key is valid — ready to use');
      } else {
        setStatus('invalid');
        setStatusMessage(data.error || 'Invalid API key');
      }
    } catch {
      setStatus('error');
      setStatusMessage('Could not reach validation endpoint');
    }
  }, [activeProvider, keyValue]);

  const handleClear = useCallback(() => {
    removeApiKey(activeProvider);
    setKeyValue('');
    setStatus('idle');
    setStatusMessage('');
    setShowKey(false);
  }, [activeProvider]);

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === overlayRef.current) onClose();
    },
    [onClose]
  );

  if (!open) return null;

  const providerConfig = PROVIDERS.find((p) => p.id === activeProvider)!;
  const models = getModelsForProvider(activeProvider);

  return (
    <div className="ai-modal-overlay" ref={overlayRef} onClick={handleOverlayClick}>
      <div className="ai-modal" role="dialog" aria-label="AI Settings">
        {/* Header */}
        <div className="ai-modal-header">
          <h3 className="ai-modal-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3l1.912 5.813a2 2 0 0 0 1.275 1.275L21 12l-5.813 1.912a2 2 0 0 0-1.275 1.275L12 21l-1.912-5.813a2 2 0 0 0-1.275-1.275L3 12l5.813-1.912a2 2 0 0 0 1.275-1.275L12 3z" />
            </svg>
            AI Settings
          </h3>
          <button type="button" className="ai-modal-close" onClick={onClose} aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="ai-modal-body">
          {/* Provider Selection */}
          <div className="ai-field">
            <label className="ai-field-label">Provider</label>
            <div className="ai-provider-grid">
              {PROVIDERS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className={`ai-provider-btn ${activeProvider === p.id ? 'active' : ''}`}
                  onClick={() => handleProviderChange(p.id)}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* API Key */}
          <div className="ai-field">
            <label className="ai-field-label" htmlFor="ai-key-input">API Key</label>
            <div className="ai-key-row">
              <input
                ref={inputRef}
                id="ai-key-input"
                type={showKey ? 'text' : 'password'}
                className="ai-key-input"
                value={keyValue}
                onChange={(e) => handleKeyChange(e.target.value)}
                placeholder={`Paste your ${providerConfig.name} API key`}
                autoComplete="off"
                spellCheck={false}
              />
              <button
                type="button"
                className="ai-key-toggle"
                onClick={() => setShowKey(!showKey)}
                aria-label={showKey ? 'Hide key' : 'Show key'}
                title={showKey ? 'Hide key' : 'Show key'}
              >
                {showKey ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
            <a
              href={providerConfig.apiKeyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ai-key-link"
            >
              Get your {providerConfig.name} API key
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
          </div>

          {/* Model */}
          <div className="ai-field">
            <label className="ai-field-label" htmlFor="ai-model-select">Model</label>
            <select
              id="ai-model-select"
              className="ai-model-select"
              value={selectedModel}
              onChange={(e) => handleModelChange(e.target.value)}
            >
              {models.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} — {m.description}
                </option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="ai-actions">
            <button
              type="button"
              className="ai-btn ai-btn-validate"
              onClick={handleValidate}
              disabled={!keyValue || status === 'validating'}
            >
              {status === 'validating' ? (
                <>
                  <span className="ai-spinner" />
                  Validating...
                </>
              ) : (
                'Validate Key'
              )}
            </button>
            <button
              type="button"
              className="ai-btn ai-btn-clear"
              onClick={handleClear}
              disabled={!keyValue}
            >
              Clear Key
            </button>
          </div>

          {/* Status */}
          {statusMessage && (
            <div className={`ai-status ai-status-${status}`}>
              {status === 'valid' && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
              {(status === 'invalid' || status === 'error') && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
                </svg>
              )}
              {statusMessage}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="ai-modal-footer">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          Your API key is stored locally in your browser. It is never stored on our servers.
        </div>
      </div>
    </div>
  );
}
