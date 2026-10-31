import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import React from 'react';
import { parseEditorQueryParams } from '@/components/editor/EditorApp';
import { editorReducer, type EditorState } from '@/components/editor/useEditorState';
import { AIAutofill } from '@/components/editor/AIAutofill';
import { AIProvider } from '@/components/editor/AIContext';
import { CustomizePanel } from '@/components/editor/CustomizePanel';
import { FixItButton } from '@/components/preview/FixItButton';
import { getTemplate } from '@/templates/registry';

describe('Editor Query Parameter Parsing', () => {
  const defaultTemplate = getTemplate('blog-minimal-dark')!;

  it('supports selecting a template via ?template=quote-centered-serif', () => {
    const result = parseEditorQueryParams('?template=quote-centered-serif', defaultTemplate);
    expect(result.template).toBeDefined();
    expect(result.template?.id).toBe('quote-centered-serif');
    expect(result.template?.category).toBe('quote');
    expect(result.params).toEqual({});
  });

  it('supports field prefill such as /create?title=Hello&description=World', () => {
    const result = parseEditorQueryParams('?title=Hello&description=World', defaultTemplate);
    expect(result.template).toBeNull();
    expect(result.params).toEqual({
      title: 'Hello',
      description: 'World',
    });
  });

  it('supports template selection with field prefill', () => {
    const result = parseEditorQueryParams(
      '?template=quote-centered-serif&quote=Hello%20World&author=Ada%20Lovelace',
      defaultTemplate
    );
    expect(result.template?.id).toBe('quote-centered-serif');
    expect(result.params).toEqual({
      quote: 'Hello World',
      author: 'Ada Lovelace',
    });
  });

  it('safely ignores unknown template IDs', () => {
    const result = parseEditorQueryParams(
      '?template=unknown-template-xyz&title=Fallback%20Title',
      defaultTemplate
    );
    expect(result.template).toBeNull();
    expect(result.params).toEqual({
      title: 'Fallback Title',
    });
  });

  it('safely ignores unknown field keys for the active template', () => {
    const result = parseEditorQueryParams(
      '?template=quote-centered-serif&quote=Valid&unknownParam=ignored&title=ignoredForQuote',
      defaultTemplate
    );
    expect(result.template?.id).toBe('quote-centered-serif');
    expect(result.params).toEqual({
      quote: 'Valid',
    });
    expect(result.params.unknownParam).toBeUndefined();
    expect(result.params.title).toBeUndefined();
  });

  it('extracts ?autofill= parameter for AIAutofill', () => {
    const result = parseEditorQueryParams(
      '?autofill=https%3A%2F%2Fexample.com%2Fblog-post',
      defaultTemplate
    );
    expect(result.autofillUrl).toBe('https://example.com/blog-post');
    expect(result.params.autofill).toBeUndefined();
  });

  it('converts number field parameters when present', () => {
    const ecommerceTemplate = getTemplate('ecommerce-product-card');
    expect(ecommerceTemplate).toBeDefined();
    const result = parseEditorQueryParams(
      '?template=ecommerce-product-card&rating=5&title=Sneakers',
      ecommerceTemplate!
    );
    expect(result.params.rating).toBe(5);
    expect(result.params.title).toBe('Sneakers');
  });

  it('ignores invalid numeric query parameter rating=abc without NaN reaching editor state or UI', () => {
    const result = parseEditorQueryParams(
      '?template=ecommerce-product-card&rating=abc',
      defaultTemplate
    );
    expect(result.template).toBeDefined();
    expect(result.template?.id).toBe('ecommerce-product-card');
    expect(result.params.rating).toBeUndefined();

    // Verify rating remains valid in editor state
    const template = result.template!;
    const stateAfterTemplate = editorReducer(
      {
        templateId: defaultTemplate.id,
        category: defaultTemplate.category,
        params: { ...defaultTemplate.defaults },
        searchQuery: '',
      },
      { type: 'SET_TEMPLATE', template }
    );
    const finalState =
      Object.keys(result.params).length > 0
        ? editorReducer(stateAfterTemplate, { type: 'SET_PARAMS', params: result.params })
        : stateAfterTemplate;

    expect(finalState.params.rating).toBe(template.defaults.rating);
    expect(Number.isFinite(finalState.params.rating)).toBe(true);

    // Verify no NaN reaches the UI
    const html = renderToString(
      React.createElement(
        AIProvider,
        null,
        React.createElement(CustomizePanel, {
          fields: template.fields,
          params: finalState.params,
          onParamChange: () => {},
          onReset: () => {},
        })
      )
    );
    expect(html).not.toContain('NaN');
    expect(html).toContain(String(template.defaults.rating));
  });
});

describe('editorReducer state transitions', () => {
  const blogTemplate = getTemplate('blog-minimal-dark')!;
  const quoteTemplate = getTemplate('quote-centered-serif')!;

  const initialState: EditorState = {
    templateId: blogTemplate.id,
    category: blogTemplate.category,
    params: { ...blogTemplate.defaults },
    searchQuery: '',
  };

  it('updates template and applies overridden params sequentially', () => {
    const stateAfterTemplate = editorReducer(initialState, {
      type: 'SET_TEMPLATE',
      template: quoteTemplate,
    });
    expect(stateAfterTemplate.templateId).toBe('quote-centered-serif');
    expect(stateAfterTemplate.params.quote).toBe(quoteTemplate.defaults.quote);

    const stateAfterParams = editorReducer(stateAfterTemplate, {
      type: 'SET_PARAMS',
      params: { quote: 'Custom Quote Text' },
    });
    expect(stateAfterParams.templateId).toBe('quote-centered-serif');
    expect(stateAfterParams.params.quote).toBe('Custom Quote Text');
    expect(stateAfterParams.params.author).toBe(quoteTemplate.defaults.author);
  });
});

describe('AIAutofill initialUrl and SSR hydration safety', () => {
  it('renders collapsed trigger button when initialUrl is undefined (initial SSR/client render)', () => {
    const html = renderToString(
      React.createElement(
        AIProvider,
        null,
        React.createElement(AIAutofill, { onAutofill: () => {} })
      )
    );
    expect(html).toContain('ai-autofill-trigger');
    expect(html).toContain('Smart Autofill');
    expect(html).not.toContain('ai-autofill-input');
  });

  it('renders expanded form with prefilled URL when initialUrl is provided', () => {
    const html = renderToString(
      React.createElement(
        AIProvider,
        null,
        React.createElement(AIAutofill, {
          onAutofill: () => {},
          initialUrl: 'https://example.com/article',
        })
      )
    );
    expect(html).toContain('ai-autofill-input');
    expect(html).toContain('https://example.com/article');
  });
});

describe('Preview and Template Links', () => {
  it('FixItButton retains title and description query parameters in editor link', () => {
    const html = renderToString(
      React.createElement(FixItButton, {
        meta: {
          title: 'My Custom Page',
          description: 'A great description',
        },
      })
    );
    expect(html).toContain(
      '/create?title=My%20Custom%20Page&amp;description=A%20great%20description'
    );
  });

  it('FixItButton retains siteName query parameter in editor link when present', () => {
    const html = renderToString(
      React.createElement(FixItButton, {
        meta: {
          title: 'My Custom Page',
          description: 'A great description',
          ogSiteName: 'GitHub',
        },
      })
    );
    expect(html).toContain(
      '/create?title=My%20Custom%20Page&amp;description=A%20great%20description&amp;siteName=GitHub'
    );
  });
});
