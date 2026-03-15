import type { AIProvider } from './types';

const PREFIX = 'ogcops-ai';
const PROVIDER_KEY = `${PREFIX}-provider`;
const modelKey = (provider: AIProvider) => `${PREFIX}-model-${provider}`;
const apiKeyKey = (provider: AIProvider) => `${PREFIX}-key-${provider}`;

function safeGet(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // localStorage may be full or unavailable (e.g. private browsing)
  }
}

function safeRemove(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

export function getApiKey(provider: AIProvider): string | null {
  return safeGet(apiKeyKey(provider));
}

export function setApiKey(provider: AIProvider, key: string): void {
  safeSet(apiKeyKey(provider), key);
}

export function removeApiKey(provider: AIProvider): void {
  safeRemove(apiKeyKey(provider));
}

export function clearAllApiKeys(): void {
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(PREFIX)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((key) => localStorage.removeItem(key));
  } catch {
    // ignore
  }
}

export function getSelectedProvider(): AIProvider | null {
  return safeGet(PROVIDER_KEY) as AIProvider | null;
}

export function setSelectedProvider(provider: AIProvider): void {
  safeSet(PROVIDER_KEY, provider);
}

export function getSelectedModel(provider: AIProvider): string | null {
  return safeGet(modelKey(provider));
}

export function setSelectedModel(provider: AIProvider, modelId: string): void {
  safeSet(modelKey(provider), modelId);
}

export function hasAnyKeyConfigured(): boolean {
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(`${PREFIX}-key-`)) {
        const value = localStorage.getItem(key);
        if (value && value.length > 0) return true;
      }
    }
  } catch {
    // ignore
  }
  return false;
}
