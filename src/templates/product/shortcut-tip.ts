import type { SatoriElement, TemplateDefinition } from '../types';
import { truncate, autoFontSize, mixColors, commonFields } from '../utils';

const MAX_KEY_LENGTH = 10;

// Plain text keys on purpose: symbols like ⌘ may be missing from the bundled fonts.
const DEFAULT_KEYS = ['Ctrl', 'K'];

function keyText(value: unknown): string {
  return truncate(String(value ?? '').trim(), MAX_KEY_LENGTH);
}

const template: TemplateDefinition = {
  id: 'product-shortcut-tip',
  name: 'Shortcut Tip',
  category: 'product',
  description: 'A "Pro tip" pill, a keyboard shortcut drawn as keycaps, and the feature it unlocks',
  tags: ['shortcut', 'keyboard', 'tip', 'product', 'keycap'],
  fields: [
    commonFields.title,
    commonFields.description,
    { key: 'key1', label: 'Key 1', type: 'text', defaultValue: 'Ctrl', placeholder: 'Ctrl', group: 'Content' },
    { key: 'key2', label: 'Key 2', type: 'text', defaultValue: 'K', placeholder: 'K', group: 'Content' },
    { key: 'key3', label: 'Key 3 (optional)', type: 'text', defaultValue: '', placeholder: 'Leave empty for two keys', group: 'Content' },
    { key: 'label', label: 'Label', type: 'text', defaultValue: 'Pro tip', placeholder: 'Pro tip', group: 'Content' },
    commonFields.siteName,
    { ...commonFields.bgColor, defaultValue: '#0f172a' },
    { ...commonFields.accentColor, defaultValue: '#38bdf8' },
    { ...commonFields.textColor, defaultValue: '#f8fafc' },
  ],
  defaults: {
    title: 'Open the command palette',
    description: 'Jump to any page or action without leaving the keyboard.',
    key1: 'Ctrl',
    key2: 'K',
    key3: '',
    label: 'Pro tip',
    siteName: '',
    bgColor: '#0f172a',
    accentColor: '#38bdf8',
    textColor: '#f8fafc',
  },
  render: (params) => {
    const title = truncate(String(params.title || 'Open the command palette'), 50);
    const description = params.description ? truncate(String(params.description), 90) : '';
    const label = keyText(params.label);
    const siteName = String(params.siteName || '');
    const bgColor = String(params.bgColor || '#0f172a');
    const accentColor = String(params.accentColor || '#38bdf8');
    const textColor = String(params.textColor || '#f8fafc');

    // Two or three keys; an empty third key is simply left out.
    const keys = [keyText(params.key1) || DEFAULT_KEYS[0], keyText(params.key2) || DEFAULT_KEYS[1]];
    const key3 = keyText(params.key3);
    if (key3) keys.push(key3);

    const keyChars = keys.join('').length;
    const keySize = autoFontSize('x'.repeat(keyChars), [
      { maxLen: 6, size: 72 },
      { maxLen: 10, size: 64 },
      { maxLen: 16, size: 52 },
      { maxLen: 30, size: 42 },
    ]);
    const titleSize = autoFontSize(title, [
      { maxLen: 24, size: 44 },
      { maxLen: 38, size: 38 },
      { maxLen: 50, size: 32 },
    ]);

    // Keycap colors come from the background so they work on light and dark themes.
    const keyFace = mixColors(bgColor, textColor, 0.1);
    const keySide = mixColors(bgColor, textColor, 0.28);
    const keyEdge = mixColors(bgColor, '#000000', 0.5);

    const keycaps: SatoriElement[] = [];
    keys.forEach((key, index) => {
      if (index > 0) {
        keycaps.push({
          type: 'div',
          props: {
            style: {
              display: 'flex',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: `${Math.round(keySize * 0.6)}px`,
              fontWeight: 400,
              color: `${textColor}66`,
              margin: '0 24px',
            },
            children: '+',
          },
        });
      }
      keycaps.push({
        type: 'div',
        props: {
          style: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: `${Math.round(keySize * 1.9)}px`,
            padding: `${Math.round(keySize * 0.3)}px ${Math.round(keySize * 0.45)}px`,
            background: keyFace,
            borderRadius: '18px',
            borderTop: `2px solid ${keySide}`,
            borderLeft: `2px solid ${keySide}`,
            borderRight: `2px solid ${keySide}`,
            borderBottom: `10px solid ${keyEdge}`,
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: `${keySize}px`,
            fontWeight: 700,
            color: textColor,
          },
          children: key,
        },
      });
    });

    return {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '1200px',
          height: '630px',
          background: bgColor,
          fontFamily: 'Inter, sans-serif',
        },
        children: [
          // "Pro tip" pill
          ...(label
            ? [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      padding: '8px 22px',
                      borderRadius: '999px',
                      background: `${accentColor}22`,
                      border: `1px solid ${accentColor}66`,
                      marginBottom: '48px',
                    },
                    children: {
                      type: 'span',
                      props: {
                        style: {
                          fontSize: '20px',
                          fontWeight: 600,
                          color: accentColor,
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase',
                        },
                        children: label,
                      },
                    },
                  },
                },
              ]
            : []),
          // Keycaps
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              },
              children: keycaps,
            },
          },
          // Feature name
          {
            type: 'h1',
            props: {
              style: {
                display: 'flex',
                fontSize: `${titleSize}px`,
                fontWeight: 700,
                color: textColor,
                lineHeight: 1.15,
                margin: 0,
                marginTop: '56px',
                textAlign: 'center',
                letterSpacing: '-0.02em',
              },
              children: title,
            },
          },
          // One-line description
          ...(description
            ? [
                {
                  type: 'p',
                  props: {
                    style: {
                      display: 'flex',
                      fontSize: '24px',
                      fontWeight: 400,
                      color: `${textColor}99`,
                      lineHeight: 1.4,
                      margin: 0,
                      marginTop: '14px',
                      textAlign: 'center',
                    },
                    children: description,
                  },
                },
              ]
            : []),
          // Site name
          ...(siteName
            ? [
                {
                  type: 'span',
                  props: {
                    style: {
                      fontSize: '18px',
                      color: `${textColor}55`,
                      marginTop: '40px',
                    },
                    children: siteName,
                  },
                },
              ]
            : []),
        ],
      },
    };
  },
};

export default template;
