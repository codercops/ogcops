import type { TemplateDefinition } from '../types';
import { truncate, autoFontSize, commonFields } from '../utils';

const GREEN = '#10b981';
const AMBER = '#f59e0b';
const RED = '#ef4444';

// Fixed, deterministic 90-day incident status pattern (indices 0 to 89).
// Mostly green (operational), with a few amber (degraded) and red (outage) days.
const INCIDENTS: Record<number, string> = {
  14: AMBER,
  38: RED,
  55: AMBER,
  72: AMBER,
  81: RED,
};

const STATUS_CONFIG: Record<string, { color: string; message: string; label: string }> = {
  operational: {
    color: GREEN,
    message: 'All Systems Operational',
    label: 'Operational',
  },
  degraded: {
    color: AMBER,
    message: 'Degraded Performance',
    label: 'Degraded',
  },
  outage: {
    color: RED,
    message: 'Major Outage',
    label: 'Outage',
  },
};

const template: TemplateDefinition = {
  id: 'saas-uptime-status',
  name: 'Uptime Status',
  category: 'saas',
  description: 'Service uptime and status dashboard with 90-day history bars',
  tags: ['saas', 'uptime', 'status', 'monitoring', 'incident'],
  fields: [
    {
      ...commonFields.title,
      label: 'Service Name',
      defaultValue: 'Cloud API Platform',
      placeholder: 'e.g. Cloud API Platform',
    },
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      defaultValue: 'operational',
      options: [
        { label: 'Operational', value: 'operational' },
        { label: 'Degraded Performance', value: 'degraded' },
        { label: 'Major Outage', value: 'outage' },
      ],
      group: 'Content',
    },
    {
      key: 'statusMessage',
      label: 'Status Message',
      type: 'text',
      defaultValue: '',
      placeholder: 'Leave blank for default',
      group: 'Content',
    },
    {
      key: 'uptime',
      label: 'Uptime Percentage',
      type: 'text',
      defaultValue: '99.98%',
      placeholder: '99.98%',
      group: 'Content',
    },
    {
      key: 'period',
      label: 'Period',
      type: 'text',
      defaultValue: 'Last 90 days',
      placeholder: 'Last 90 days',
      group: 'Content',
    },
    commonFields.siteName,
    { ...commonFields.bgColor, defaultValue: '#0b0f19' },
    { ...commonFields.textColor, defaultValue: '#f8fafc' },
    { ...commonFields.accentColor, defaultValue: '#10b981' },
  ],
  defaults: {
    title: 'Cloud API Platform',
    status: 'operational',
    statusMessage: '',
    uptime: '99.98%',
    period: 'Last 90 days',
    siteName: 'status.example.com',
    bgColor: '#0b0f19',
    textColor: '#f8fafc',
    accentColor: '#10b981',
  },
  render: (params) => {
    const serviceName = truncate(String(params.title || 'Cloud API Platform'), 50);
    const rawStatus = String(params.status || 'operational').toLowerCase();
    const activeStatus = STATUS_CONFIG[rawStatus] || STATUS_CONFIG.operational;
    const statusColor = activeStatus.color;
    const statusMessage = params.statusMessage
      ? truncate(String(params.statusMessage), 60)
      : activeStatus.message;
    const statusLabel = activeStatus.label;
    const uptime = String(params.uptime || '99.98%');
    const period = String(params.period ?? 'Last 90 days');
    const siteName = truncate(String(params.siteName || ''), 40);
    const bgColor = String(params.bgColor || '#0b0f19');
    const textColor = String(params.textColor || '#f8fafc');
    const accentColor = String(params.accentColor || '#10b981');

    const nameSize = autoFontSize(serviceName, [
      { maxLen: 20, size: 44 },
      { maxLen: 35, size: 38 },
      { maxLen: 50, size: 32 },
    ]);

    // Today's bar matches the selected status
    const todayColor = rawStatus === 'outage' ? RED : rawStatus === 'degraded' ? AMBER : GREEN;

    // Fixed 90-bar pattern: 84 green, 3 amber, 2 red + today's status bar
    const bars = Array.from({ length: 90 }, (_, i) => ({
      type: 'div',
      props: {
        style: {
          display: 'flex',
          width: '8px',
          height: '42px',
          borderRadius: '2px',
          backgroundColor: i === 89 ? todayColor : (INCIDENTS[i] || GREEN),
        },
        children: '',
      },
    }));

    const legendItem = (color: string, label: string) => ({
      type: 'div',
      props: {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        },
        children: [
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                width: '8px',
                height: '8px',
                borderRadius: '2px',
                backgroundColor: color,
              },
              children: '',
            },
          },
          {
            type: 'span',
            props: {
              style: {
                fontSize: '13px',
                color: `${textColor}70`,
              },
              children: label,
            },
          },
        ],
      },
    });

    return {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          width: '1200px',
          height: '630px',
          backgroundColor: bgColor,
          fontFamily: 'Inter, sans-serif',
          padding: '48px 60px',
          justifyContent: 'space-between',
          boxSizing: 'border-box',
        },
        children: [
          // Top header: Service Name + optional site name
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                      flex: 1,
                      minWidth: 0,
                      paddingRight: '24px',
                    },
                    children: [
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: '12px',
                            fontWeight: 700,
                            letterSpacing: '1.5px',
                            textTransform: 'uppercase',
                            color: accentColor,
                          },
                          children: 'SYSTEM STATUS',
                        },
                      },
                      {
                        type: 'h1',
                        props: {
                          style: {
                            fontSize: `${nameSize}px`,
                            fontWeight: 700,
                            color: textColor,
                            margin: 0,
                          },
                          children: serviceName,
                        },
                      },
                    ],
                  },
                },
                ...(siteName
                  ? [
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            alignItems: 'center',
                            padding: '8px 16px',
                            borderRadius: '8px',
                            backgroundColor: `${textColor}0c`,
                            border: `1px solid ${textColor}18`,
                            flexShrink: 0,
                          },
                          children: [
                            {
                              type: 'span',
                              props: {
                                style: {
                                  fontSize: '15px',
                                  fontWeight: 600,
                                  color: `${textColor}99`,
                                  fontFamily: 'JetBrains Mono, monospace',
                                },
                                children: siteName,
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
          // Status alert banner with green/amber/red indicator and message
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                padding: '16px 24px',
                borderRadius: '12px',
                backgroundColor: `${statusColor}14`,
                border: `1px solid ${statusColor}35`,
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                    },
                    children: [
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            backgroundColor: `${statusColor}30`,
                          },
                          children: [
                            {
                              type: 'div',
                              props: {
                                style: {
                                  display: 'flex',
                                  width: '12px',
                                  height: '12px',
                                  borderRadius: '50%',
                                  backgroundColor: statusColor,
                                },
                                children: '',
                              },
                            },
                          ],
                        },
                      },
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: '22px',
                            fontWeight: 600,
                            color: textColor,
                          },
                          children: statusMessage,
                        },
                      },
                    ],
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      padding: '6px 14px',
                      borderRadius: '16px',
                      backgroundColor: `${statusColor}22`,
                      border: `1px solid ${statusColor}44`,
                      flexShrink: 0,
                    },
                    children: [
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: '13px',
                            fontWeight: 700,
                            color: statusColor,
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                          },
                          children: statusLabel,
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
          // 90-day history panel
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                padding: '22px 28px',
                borderRadius: '14px',
                backgroundColor: `${textColor}08`,
                border: `1px solid ${textColor}15`,
              },
              children: [
                // Top row: Uptime history header + uptime percentage & period
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'baseline',
                      justifyContent: 'space-between',
                      width: '100%',
                      marginBottom: '16px',
                    },
                    children: [
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: '17px',
                            fontWeight: 600,
                            color: `${textColor}cc`,
                          },
                          children: 'Uptime History',
                        },
                      },
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            alignItems: 'baseline',
                            gap: '10px',
                          },
                          children: [
                            {
                              type: 'span',
                              props: {
                                style: {
                                  fontSize: '24px',
                                  fontWeight: 700,
                                  color: textColor,
                                  fontFamily: 'JetBrains Mono, monospace',
                                  lineHeight: 1,
                                },
                                children: uptime,
                              },
                            },
                            ...(period
                              ? [
                                  {
                                    type: 'span',
                                    props: {
                                      style: {
                                        fontSize: '14px',
                                        fontWeight: 500,
                                        color: `${textColor}70`,
                                      },
                                      children: period,
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
                // 90 thin status bars evenly spaced across the content width
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      height: '42px',
                    },
                    children: bars,
                  },
                },
                // History labels
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      width: '100%',
                      marginTop: '12px',
                    },
                    children: [
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: '14px',
                            fontWeight: 500,
                            color: `${textColor}60`,
                          },
                          children: '90 days ago',
                        },
                      },
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: '14px',
                            fontWeight: 500,
                            color: `${textColor}60`,
                          },
                          children: 'Today',
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
          // Bottom legend
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      gap: '20px',
                    },
                    children: [
                      legendItem(GREEN, 'Operational'),
                      legendItem(AMBER, 'Degraded'),
                      legendItem(RED, 'Outage'),
                    ],
                  },
                },
                {
                  type: 'span',
                  props: {
                    style: {
                      fontSize: '13px',
                      color: `${textColor}50`,
                    },
                    children: 'Real-time incident & uptime tracking',
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
