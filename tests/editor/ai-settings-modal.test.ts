import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import React from 'react';
import { AISettingsModal } from '@/components/editor/AISettingsModal';

describe('AISettingsModal accessibility', () => {
  it('renders dialog with aria-modal, accessible heading, provider group, and status region', () => {
    const html = renderToString(
      React.createElement(AISettingsModal, { open: true, onClose: () => {} }),
    );

    // 1. aria-modal="true" on the dialog element
    expect(html).toMatch(/<div[^>]*role="dialog"[^>]*aria-modal="true"/);

    // 2. aria-labelledby resolves to the "AI Settings" heading
    const dialogLabelMatch = html.match(/role="dialog"[^>]*aria-labelledby="([^"]+)"/);
    expect(dialogLabelMatch).not.toBeNull();
    const headingId = dialogLabelMatch![1];

    const headingMatch = html.match(new RegExp(`<h3[^>]*id="${headingId}"[^>]*>(.*?)</h3>`));
    expect(headingMatch).not.toBeNull();
    expect(headingMatch![1]).toContain('AI Settings');

    // 3. Provider buttons have aria-pressed="true" on the selected provider and "false" on others
    const pressedTrueMatches = [...html.matchAll(/<button[^>]*class="[^"]*ai-provider-btn[^"]*"[^>]*aria-pressed="true"[^>]*>(.*?)<\/button>/g)];
    const pressedFalseMatches = [...html.matchAll(/<button[^>]*class="[^"]*ai-provider-btn[^"]*"[^>]*aria-pressed="false"[^>]*>(.*?)<\/button>/g)];

    expect(pressedTrueMatches).toHaveLength(1);
    expect(pressedTrueMatches[0][1]).toContain('OpenAI');
    expect(pressedFalseMatches.length).toBeGreaterThanOrEqual(1);

    // 4. Provider group wiring: role="group" with aria-labelledby pointing to the Provider label
    const groupMatch = html.match(/role="group"[^>]*aria-labelledby="([^"]+)"/);
    expect(groupMatch).not.toBeNull();
    const providerLabelId = groupMatch![1];

    const providerLabelMatch = html.match(new RegExp(`<label[^>]*id="${providerLabelId}"[^>]*>(.*?)</label>`));
    expect(providerLabelMatch).not.toBeNull();
    expect(providerLabelMatch![1]).toContain('Provider');

    // 5. role="status" container is mounted at all times
    expect(html).toMatch(/<div[^>]*role="status"/);
  });

  it('renders nothing when closed', () => {
    const html = renderToString(
      React.createElement(AISettingsModal, { open: false, onClose: () => {} }),
    );
    expect(html).toBe('');
  });
});
