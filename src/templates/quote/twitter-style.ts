import type { TemplateDefinition } from '../types';
import { truncate, autoFontSize, commonFields } from '../utils';

const template: TemplateDefinition = {
  id: 'quote-twitter-style',
  name: 'Twitter Style',
  category: 'quote',
  description: 'Tweet layout with avatar area, handle, and verified badge',
  tags: ['quote', 'twitter', 'social', 'tweet'],
  fields: [
    { key: 'quote', label: 'Tweet Text', type: 'textarea', defaultValue: 'The best error message is the one that never shows up.', placeholder: 'Enter tweet text...', required: true, group: 'Content' },
    commonFields.author,
    { key: 'handle', label: 'Handle', type: 'text', defaultValue: '@developer', placeholder: '@username', group: 'Content' },
    { key: 'likes', label: 'Likes', type: 'text', defaultValue: '2,847', placeholder: '2,847', group: 'Content' },
    { key: 'retweets', label: 'Retweets', type: 'text', defaultValue: '412', placeholder: '412', group: 'Content' },
    commonFields.bgColor,
    commonFields.accentColor,
  ],
  defaults: {
    quote: 'The best error message is the one that never shows up.',
    author: 'Thomas Fuchs',
    handle: '@thomasfuchs',
    likes: '2,847',
    retweets: '412',
    bgColor: '#0a0a0a',
    accentColor: '#1DA1F2',
  },
  render: (params) => {
    const quote = truncate(String(params.quote || 'The best error message is the one that never shows up.'), 280);
    const author = String(params.author || 'Developer');
    const handle = String(params.handle || '@developer');
    const likes = String(params.likes || '');
    const retweets = String(params.retweets || '');
    const bgColor = String(params.bgColor || '#0a0a0a');
    const accentColor = String(params.accentColor || '#1DA1F2');
    const quoteSize = autoFontSize(quote, [
      { maxLen: 60, size: 40 },
      { maxLen: 120, size: 32 },
      { maxLen: 200, size: 26 },
      { maxLen: 280, size: 22 },
    ]);

    return {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '1200px',
          height: '630px',
          backgroundColor: bgColor,
          fontFamily: 'Inter, sans-serif',
          padding: '60px',
        },
        children: [
          // Card
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                backgroundColor: '#16181C',
                borderRadius: '20px',
                padding: '40px 48px',
                border: '1px solid #2F3336',
              },
              children: [
                // Author row
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      marginBottom: '24px',
                    },
                    children: [
                      // Avatar
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '52px',
                            height: '52px',
                            borderRadius: '50%',
                            backgroundColor: accentColor,
                          },
                          children: {
                            type: 'span',
                            props: {
                              style: {
                                fontSize: '24px',
                                fontWeight: 700,
                                color: '#FFFFFF',
                              },
                              children: author.charAt(0).toUpperCase(),
                            },
                          },
                        },
                      },
                      // Name + handle
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            flexDirection: 'column',
                          },
                          children: [
                            {
                              type: 'span',
                              props: {
                                style: {
                                  fontSize: '20px',
                                  fontWeight: 700,
                                  color: '#E7E9EA',
                                },
                                children: author,
                              },
                            },
                            {
                              type: 'span',
                              props: {
                                style: {
                                  fontSize: '16px',
                                  color: '#71767B',
                                },
                                children: handle,
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                // Tweet text
                {
                  type: 'p',
                  props: {
                    style: {
                      fontSize: `${quoteSize}px`,
                      color: '#E7E9EA',
                      lineHeight: 1.5,
                      margin: 0,
                      marginBottom: '32px',
                    },
                    children: quote,
                  },
                },
                // Engagement row
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      gap: '40px',
                      borderTop: '1px solid #2F3336',
                      paddingTop: '20px',
                    },
                    children: [
                      ...(retweets
                        ? [
                            {
                              type: 'div',
                              props: {
                                style: { display: 'flex', alignItems: 'center', gap: '8px' },
                                children: [
                                  {
                                    type: 'span',
                                    props: {
                                      style: { fontSize: '16px', fontWeight: 700, color: '#E7E9EA' },
                                      children: retweets,
                                    },
                                  },
                                  {
                                    type: 'span',
                                    props: {
                                      style: { fontSize: '16px', color: '#71767B' },
                                      children: 'Retweets',
                                    },
                                  },
                                ],
                              },
                            },
                          ]
                        : []),
                      ...(likes
                        ? [
                            {
                              type: 'div',
                              props: {
                                style: { display: 'flex', alignItems: 'center', gap: '8px' },
                                children: [
                                  {
                                    type: 'span',
                                    props: {
                                      style: { fontSize: '16px', fontWeight: 700, color: '#E7E9EA' },
                                      children: likes,
                                    },
                                  },
                                  {
                                    type: 'span',
                                    props: {
                                      style: { fontSize: '16px', color: '#71767B' },
                                      children: 'Likes',
                                    },
                                  },
                                ],
                              },
                            },
                          ]
                        : []),
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    };
  },
};

export default template;
