import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getApiKey,
  setApiKey,
  removeApiKey,
  clearAllApiKeys,
  getSelectedProvider,
  setSelectedProvider,
  getSelectedModel,
  setSelectedModel,
  hasAnyKeyConfigured,
} from '@/lib/ai/storage';

// Mock localStorage for Node environment
const store: Record<string, string> = {};
const localStorageMock = {
  getItem: vi.fn((key: string) => store[key] ?? null),
  setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
  removeItem: vi.fn((key: string) => { delete store[key]; }),
  key: vi.fn((index: number) => Object.keys(store)[index] ?? null),
  get length() { return Object.keys(store).length; },
  clear: vi.fn(() => { for (const key of Object.keys(store)) delete store[key]; }),
};

Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock, writable: true });

beforeEach(() => {
  localStorageMock.clear();
  vi.clearAllMocks();
});

describe('API Key Storage', () => {
  it('should set and get an API key', () => {
    setApiKey('openai', 'sk-test-123');
    expect(getApiKey('openai')).toBe('sk-test-123');
  });

  it('should return null for unset key', () => {
    expect(getApiKey('openai')).toBeNull();
  });

  it('should store keys independently per provider', () => {
    setApiKey('openai', 'sk-openai');
    setApiKey('anthropic', 'sk-ant-anthropic');
    setApiKey('google', 'google-key');
    expect(getApiKey('openai')).toBe('sk-openai');
    expect(getApiKey('anthropic')).toBe('sk-ant-anthropic');
    expect(getApiKey('google')).toBe('google-key');
  });

  it('should remove only the specified provider key', () => {
    setApiKey('openai', 'sk-openai');
    setApiKey('anthropic', 'sk-ant-key');
    removeApiKey('openai');
    expect(getApiKey('openai')).toBeNull();
    expect(getApiKey('anthropic')).toBe('sk-ant-key');
  });

  it('should overwrite existing key', () => {
    setApiKey('openai', 'sk-old');
    setApiKey('openai', 'sk-new');
    expect(getApiKey('openai')).toBe('sk-new');
  });
});

describe('clearAllApiKeys', () => {
  it('should remove all AI-related entries', () => {
    setApiKey('openai', 'sk-1');
    setApiKey('anthropic', 'sk-2');
    setSelectedProvider('openai');
    setSelectedModel('openai', 'gpt-4o');
    clearAllApiKeys();
    expect(getApiKey('openai')).toBeNull();
    expect(getApiKey('anthropic')).toBeNull();
    expect(getSelectedProvider()).toBeNull();
    expect(getSelectedModel('openai')).toBeNull();
  });

  it('should not remove non-AI localStorage entries', () => {
    store['other-key'] = 'should-stay';
    setApiKey('openai', 'sk-1');
    clearAllApiKeys();
    expect(store['other-key']).toBe('should-stay');
  });
});

describe('Provider Selection', () => {
  it('should set and get selected provider', () => {
    setSelectedProvider('anthropic');
    expect(getSelectedProvider()).toBe('anthropic');
  });

  it('should return null when no provider selected', () => {
    expect(getSelectedProvider()).toBeNull();
  });

  it('should overwrite selected provider', () => {
    setSelectedProvider('openai');
    setSelectedProvider('google');
    expect(getSelectedProvider()).toBe('google');
  });
});

describe('Model Selection', () => {
  it('should set and get model per provider', () => {
    setSelectedModel('openai', 'gpt-4o');
    setSelectedModel('anthropic', 'claude-sonnet-4-6');
    expect(getSelectedModel('openai')).toBe('gpt-4o');
    expect(getSelectedModel('anthropic')).toBe('claude-sonnet-4-6');
  });

  it('should return null for unset model', () => {
    expect(getSelectedModel('openai')).toBeNull();
  });

  it('should remember model when switching providers', () => {
    setSelectedModel('openai', 'gpt-4o');
    setSelectedModel('anthropic', 'claude-haiku-4-5');
    setSelectedProvider('anthropic');
    // OpenAI model should still be remembered
    expect(getSelectedModel('openai')).toBe('gpt-4o');
    expect(getSelectedModel('anthropic')).toBe('claude-haiku-4-5');
  });
});

describe('hasAnyKeyConfigured', () => {
  it('should return false when no keys are set', () => {
    expect(hasAnyKeyConfigured()).toBe(false);
  });

  it('should return true when at least one key is set', () => {
    setApiKey('groq', 'gsk-test');
    expect(hasAnyKeyConfigured()).toBe(true);
  });

  it('should return false after clearing all keys', () => {
    setApiKey('openai', 'sk-test');
    clearAllApiKeys();
    expect(hasAnyKeyConfigured()).toBe(false);
  });

  it('should return true with multiple keys set', () => {
    setApiKey('openai', 'sk-1');
    setApiKey('anthropic', 'sk-2');
    expect(hasAnyKeyConfigured()).toBe(true);
  });
});

describe('Error Handling', () => {
  it('should handle localStorage errors gracefully for getApiKey', () => {
    const originalGetItem = localStorageMock.getItem;
    localStorageMock.getItem = vi.fn(() => { throw new Error('quota exceeded'); });
    expect(getApiKey('openai')).toBeNull();
    localStorageMock.getItem = originalGetItem;
  });

  it('should handle localStorage errors gracefully for setApiKey', () => {
    const originalSetItem = localStorageMock.setItem;
    localStorageMock.setItem = vi.fn(() => { throw new Error('quota exceeded'); });
    // Should not throw
    expect(() => setApiKey('openai', 'sk-test')).not.toThrow();
    localStorageMock.setItem = originalSetItem;
  });

  it('should handle localStorage errors gracefully for hasAnyKeyConfigured', () => {
    Object.defineProperty(localStorageMock, 'length', {
      get: () => { throw new Error('access denied'); },
      configurable: true,
    });
    expect(hasAnyKeyConfigured()).toBe(false);
    // Restore
    Object.defineProperty(localStorageMock, 'length', {
      get: () => Object.keys(store).length,
      configurable: true,
    });
  });
});
