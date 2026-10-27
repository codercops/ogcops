import type { TemplateDefinition } from '../types';
import { autoFontSize, commonFields, isLightColor, mixColors, truncate } from '../utils';

const STEPS = ['Investigating', 'Identified', 'Monitoring', 'Resolved'] as const;

const STATUS_INDEX: Record<string, number> = {
  investigating: 0,
  identified: 1,
  monitoring: 2,
  resolved: 3,
};

const template: TemplateDefinition = {
  id: 'saas-incident',
  name: 'Incident Update',
  category: 'saas',
  description: 'Status-page incident card with the four progress steps filled up to the current status',
  tags: ['saas', 'incident', 'status', 'outage', 'status-page'],
  fields: [
    commonFields.title,
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      defaultValue: 'identified',
      options: [
        { label: 'Investigating', value: 'investigating' },
        { label: 'Identified', value: 'identified' },
        { label: 'Monitoring', value: 'monitoring' },
        { label: 'Resolved', value: 'resolved' },
      ],
      group: 'Content',
    },
    { key: 'update', label: 'Latest Update', type: 'text', defaultValue: 'A fix is rolling out to all regions', placeholder: 'A fix is rolling out to all regions', group: 'Content' },
    { key: 'started', label: 'Started', type: 'text', defaultValue: 'Started 14:05 UTC', placeholder: 'Started 14:05 UTC', group: 'Content' },
    commonFields.siteName,
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    title: 'Elevated API error rates',
    status: 'identified',
    update: 'A fix is rolling out to all regions',
    started: 'Started 14:05 UTC',
    siteName: 'status.acme.dev',
    bgColor: '#0a0a0a',
    accentColor: '#E07A5F',
    textColor: '#FFFFFF',
  },
  render: (params) => {
    const rawTitle = String(params.title || 'Elevated API error rates').trim() || 'Elevated API error rates';
    const titleSize = autoFontSize(rawTitle, [
      { maxLen: 24, size: 64 },
      { maxLen: 40, size: 52 },
      { maxLen: 60, size: 42 },
    ]);
    const title = truncate(rawTitle, 60);
    const rawStatus = String(params.status || 'identified').trim().toLowerCase();
    // An unknown or blank status falls back to the default step. `Object.hasOwn` is
    // needed here: a name every object inherits, like `constructor`, would otherwise
    // resolve to a built-in function and slip past the fallback.
    const statusIndex = Object.hasOwn(STATUS_INDEX, rawStatus)
      ? STATUS_INDEX[rawStatus]
      : STATUS_INDEX.identified;
    const update = truncate(String(params.update || '').trim(), 90);
    const started = truncate(String(params.started || '').trim(), 40);
    const siteName = truncate(String(params.siteName || '').trim(), 40);
    const bgColor = String(params.bgColor || '#0a0a0a');
    const accentColor = String(params.accentColor || '#E07A5F');
    const textColor = String(params.textColor || '#FFFFFF');
    // The label, the reached steps and their connectors are drawn in the accent,
    // so they are darkened when the page background is light.
    const accentInk = isLightColor(bgColor) ? mixColors(accentColor, '#000000', 0.45) : accentColor;

    const steps = STEPS.map((label, index) => {
      const reached = index <= statusIndex;
      return {
        type: 'div',
        props: {
          style: {
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            minWidth: 0,
          },
          children: [
            // Marker and the connector that runs to the next step
            {
              type: 'div',
              props: {
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                },
                children: [
                  {
                    type: 'div',
                    props: {
                      style: {
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '30px',
                        height: '30px',
                        borderRadius: '50%',
                        boxSizing: 'border-box',
                        flexShrink: 0,
                        backgroundColor: reached ? accentInk : 'transparent',
                        border: `2px solid ${reached ? accentInk : `${textColor}33`}`,
                      },
                      children: reached
                        ? [
                            {
                              type: 'div',
                              props: {
                                style: {
                                  display: 'flex',
                                  width: '10px',
                                  height: '10px',
                                  borderRadius: '50%',
                                  backgroundColor: bgColor,
                                },
                                children: '',
                              },
                            },
                          ]
                        : [],
                    },
                  },
                  // The connector is filled once the next step is reached too
                  ...(index < STEPS.length - 1
                    ? [
                        {
                          type: 'div',
                          props: {
                            style: {
                              display: 'flex',
                              flex: 1,
                              height: '2px',
                              marginLeft: '12px',
                              backgroundColor: index + 1 <= statusIndex ? accentInk : `${textColor}1F`,
                            },
                            children: '',
                          },
                        },
                      ]
                    : []),
                ],
              },
            },
            {
              type: 'span',
              props: {
                style: {
                  fontSize: '17px',
                  fontWeight: reached ? 700 : 500,
                  color: reached ? textColor : `${textColor}66`,
                  marginTop: '14px',
                },
                children: label,
              },
            },
          ],
        },
      };
    });

    return {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          width: '1200px',
          height: '630px',
          boxSizing: 'border-box',
          backgroundColor: bgColor,
          fontFamily: 'Inter, sans-serif',
          padding: '64px 80px',
        },
        children: [
          // "Incident" label
          {
            type: 'span',
            props: {
              style: {
                fontSize: '16px',
                fontWeight: 700,
                color: accentInk,
                letterSpacing: '0.16em',
                textTransform: 'uppercase' as const,
              },
              children: 'Incident',
            },
          },
          // Incident title
          {
            type: 'h1',
            props: {
              style: {
                fontSize: `${titleSize}px`,
                fontWeight: 700,
                color: textColor,
                lineHeight: 1.15,
                margin: 0,
                marginTop: '16px',
              },
              children: title,
            },
          },
          // Investigating, Identified, Monitoring, Resolved
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'flex-start',
                width: '100%',
                marginTop: '48px',
              },
              children: steps,
            },
          },
          // Latest update
          ...(update
            ? [
                {
                  type: 'p',
                  props: {
                    style: {
                      fontSize: '22px',
                      fontWeight: 500,
                      color: `${textColor}CC`,
                      lineHeight: 1.4,
                      margin: 0,
                      marginTop: '48px',
                    },
                    children: update,
                  },
                },
              ]
            : []),
          // Started and site name
          ...(started || siteName
            ? [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      marginTop: update ? '18px' : '48px',
                    },
                    children: [
                      ...(started
                        ? [
                            {
                              type: 'span',
                              props: {
                                style: {
                                  fontSize: '18px',
                                  fontWeight: 600,
                                  color: accentInk,
                                },
                                children: started,
                              },
                            },
                          ]
                        : []),
                      ...(started && siteName
                        ? [
                            {
                              type: 'div',
                              props: {
                                style: {
                                  display: 'flex',
                                  width: '4px',
                                  height: '4px',
                                  borderRadius: '50%',
                                  backgroundColor: `${textColor}44`,
                                },
                                children: '',
                              },
                            },
                          ]
                        : []),
                      ...(siteName
                        ? [
                            {
                              type: 'span',
                              props: {
                                style: {
                                  fontSize: '18px',
                                  fontWeight: 500,
                                  color: `${textColor}66`,
                                },
                                children: siteName,
                              },
                            },
                          ]
                        : []),
                    ],
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
