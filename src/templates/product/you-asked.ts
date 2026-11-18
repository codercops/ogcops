import type { SatoriElement, TemplateDefinition } from '../types';
import { autoFontSize, commonFields, isLightColor, mixColors, truncate } from '../utils';

const template: TemplateDefinition = {
  id: 'product-you-asked',
  name: 'You Asked',
  category: 'product',
  description: 'A customer request card announcing the feature your users asked for.',
  tags: ['feedback', 'request', 'votes', 'shipped', 'product'],
  fields: [
    { ...commonFields.title, defaultValue: 'Dark mode is here' },
    { key: 'request', label: 'Request', type: 'textarea', defaultValue: 'Please add a dark mode for working late', placeholder: 'What did your users ask for?', group: 'Content' },
    { key: 'votes', label: 'Votes', type: 'text', defaultValue: '248', placeholder: '248', group: 'Content' },
    { key: 'voteLabel', label: 'Vote Label', type: 'text', defaultValue: 'votes', placeholder: 'votes', group: 'Content' },
    { key: 'version', label: 'Version', type: 'text', defaultValue: 'v2.4', placeholder: 'v2.4', group: 'Content' },
    commonFields.siteName,
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    title: 'Dark mode is here',
    request: 'Please add a dark mode for working late',
    votes: '248',
    voteLabel: 'votes',
    version: 'v2.4',
    siteName: 'notewell.app',
    bgColor: '#0a0a0a',
    accentColor: '#E07A5F',
    textColor: '#FFFFFF',
  },
  render: (params) => {
    const titleValue = String(params.title ?? '').trim();
    const request = String(params.request ?? '').trim();
    const votes = String(params.votes ?? '').trim();
    const voteLabel = String(params.voteLabel ?? '').trim();
    const version = truncate(String(params.version ?? '').trim(), 24);
    const siteName = truncate(String(params.siteName ?? '').trim(), 40);
    const bgInput = String(params.bgColor ?? '').trim();
    const accentInput = String(params.accentColor ?? '').trim();
    const textInput = String(params.textColor ?? '').trim();
    const bgColor = bgInput || '#0a0a0a';
    const accentColor = accentInput || '#E07A5F';
    const textColor = textInput || '#FFFFFF';
    const title = truncate(titleValue, 64);
    const titleSize = autoFontSize(titleValue, [
      { maxLen: 24, size: 64 },
      { maxLen: 40, size: 54 },
      { maxLen: 56, size: 46 },
      { maxLen: 80, size: 38 },
    ]);
    const voteSize = autoFontSize(votes, [
      { maxLen: 4, size: 40 },
      { maxLen: 6, size: 32 },
      { maxLen: 8, size: 24 },
    ]);
    const voteText = truncate(votes, 9);
    const lightBackground = isLightColor(bgColor);
    const accentInk = lightBackground ? mixColors(accentColor, '#000000', 0.45) : accentColor;
    const voteColor = lightBackground ? accentInk : textColor;
    const cardBorder = mixColors(bgColor, lightBackground ? accentInk : textColor, 0.35);
    const requestText = truncate(request, 100);
    const pillText = version ? `Shipped in ${version}` : 'Shipped';

    const requestCard: SatoriElement = {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'stretch',
          width: '100%',
          minHeight: '118px',
          border: `1px solid ${cardBorder}`,
          borderRadius: '16px',
          background: mixColors(bgColor, textColor, 0.06),
          overflow: 'hidden',
        },
        children: [
          ...(votes
            ? [{
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexShrink: 0,
                    width: '170px',
                    padding: '22px 18px',
                    borderRight: `1px solid ${cardBorder}`,
                    overflow: 'hidden',
                  },
                  children: [
                    {
                      type: 'span',
                      props: {
                        style: {
                          display: 'flex',
                          maxWidth: '134px',
                          overflow: 'hidden',
                          fontFamily: 'JetBrains Mono, monospace',
                          fontSize: `${voteSize}px`,
                          fontWeight: 700,
                          lineHeight: 1,
                          color: voteColor,
                        },
                        children: voteText,
                      },
                    },
                    ...(voteLabel
                      ? [{
                          type: 'span',
                          props: {
                            style: {
                              display: 'flex',
                              marginTop: '8px',
                              maxWidth: '134px',
                              overflow: 'hidden',
                              whiteSpace: 'nowrap',
                              textOverflow: 'ellipsis',
                              fontSize: '17px',
                              lineHeight: 1.1,
                              color: `${textColor}99`,
                            },
                            children: truncate(voteLabel, 14),
                          },
                        }]
                      : []),
                  ],
                },
              }]
            : []),
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flex: 1,
                alignItems: 'center',
                minWidth: 0,
                padding: '24px 30px',
                overflow: 'hidden',
              },
              children: {
                type: 'p',
                props: {
                  style: {
                    display: 'flex',
                    maxHeight: '76px',
                    margin: 0,
                    overflow: 'hidden',
                    fontSize: '28px',
                    lineHeight: 1.35,
                    color: `${textColor}aa`,
                  },
                  children: `“${requestText}”`,
                },
              },
            },
          },
        ],
      },
    };

    return {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          width: '1200px',
          height: '630px',
          padding: '64px 72px',
          background: bgColor,
          fontFamily: 'Inter, sans-serif',
          overflow: 'hidden',
        },
        children: [
          ...(request ? [requestCard] : []),
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                marginTop: request ? '20px' : 0,
                padding: '8px 18px',
                borderRadius: '999px',
                background: mixColors(bgColor, accentColor, 0.14),
                border: `1px solid ${cardBorder}`,
                overflow: 'hidden',
              },
              children: {
                type: 'span',
                props: {
                  style: {
                    display: 'flex',
                    maxWidth: '1000px',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    fontSize: '18px',
                    fontWeight: 600,
                    color: accentInk,
                  },
                  children: pillText,
                },
              },
            },
          },
          {
            type: 'h1',
            props: {
              style: {
                display: 'flex',
                maxWidth: '1056px',
                margin: '30px 0 0',
                overflow: 'hidden',
                fontSize: `${titleSize}px`,
                fontWeight: 700,
                lineHeight: 1.08,
                color: textColor,
              },
              children: title,
            },
          },
          ...(siteName
            ? [{
                type: 'span',
                props: {
                  style: {
                    display: 'flex',
                    marginTop: '22px',
                    fontSize: '18px',
                    color: `${textColor}88`,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  },
                  children: siteName,
                },
              }]
            : []),
        ],
      },
    };
  },
};

export default template;