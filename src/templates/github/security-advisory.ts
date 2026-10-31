import type { TemplateDefinition } from '../types';
import { autoFontSize, commonFields, contrastText, isLightColor, mixColors, truncate } from '../utils';

const SEVERITIES = {
  critical: { label: 'Critical', color: '#8250df' },
  high: { label: 'High', color: '#d1242f' },
  medium: { label: 'Medium', color: '#bf8700' },
  low: { label: 'Low', color: '#1a7f37' },
};

const DEFAULT_TITLE = 'Path traversal in @acme/static-files';

const template: TemplateDefinition = {
  id: 'github-security-advisory',
  name: 'Security Advisory',
  category: 'github',
  description: 'Security fix announcement with severity, advisory ID, affected package versions and site name',
  tags: ['github', 'security', 'advisory', 'vulnerability', 'package'],
  fields: [
    { ...commonFields.title, defaultValue: DEFAULT_TITLE, placeholder: 'Security advisory title' },
    {
      key: 'severity',
      label: 'Severity',
      type: 'select',
      defaultValue: 'high',
      options: [
        { label: 'Critical', value: 'critical' },
        { label: 'High', value: 'high' },
        { label: 'Medium', value: 'medium' },
        { label: 'Low', value: 'low' },
      ],
      group: 'Content',
    },
    { key: 'advisoryId', label: 'Advisory ID', type: 'text', defaultValue: 'GHSA-3x9q-7m2v-p4hc', placeholder: 'GHSA-xxxx-xxxx-xxxx', required: false, group: 'Content' },
    { key: 'packageName', label: 'Package Name', type: 'text', defaultValue: '@acme/static-files', placeholder: '@scope/package', required: false, group: 'Content' },
    { key: 'affected', label: 'Affected Versions', type: 'text', defaultValue: '< 2.4.1', placeholder: '< 2.4.1', required: false, group: 'Content' },
    { key: 'patched', label: 'Fixed Version', type: 'text', defaultValue: '2.4.1', placeholder: '2.4.1', required: false, group: 'Content' },
    commonFields.siteName,
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    title: DEFAULT_TITLE,
    severity: 'high',
    advisoryId: 'GHSA-3x9q-7m2v-p4hc',
    packageName: '@acme/static-files',
    affected: '< 2.4.1',
    patched: '2.4.1',
    siteName: 'Acme Security',
    bgColor: '#0d1117',
    accentColor: '#58a6ff',
    textColor: '#e6edf3',
  },
  render: (params) => {
    const rawTitle = String(params.title ?? '').trim() || DEFAULT_TITLE;
    const title = truncate(rawTitle, 90);
    const rawSeverity = String(params.severity ?? '').trim().toLowerCase();
    const severity = Object.hasOwn(SEVERITIES, rawSeverity)
      ? SEVERITIES[rawSeverity as keyof typeof SEVERITIES]
      : SEVERITIES.high;
    const advisoryId = truncate(String(params.advisoryId ?? '').trim(), 32);
    const packageName = truncate(String(params.packageName ?? '').trim(), 48);
    const affected = truncate(String(params.affected ?? '').trim(), 32);
    const patched = truncate(String(params.patched ?? '').trim(), 32);
    const siteName = truncate(String(params.siteName ?? '').trim(), 40);
    const bgColor = String(params.bgColor || '#0d1117');
    const accentColor = String(params.accentColor || '#58a6ff');
    const textColor = String(params.textColor || '#e6edf3');
    const accentTextColor = isLightColor(bgColor) ? mixColors(accentColor, '#000000', 0.45) : accentColor;
    const details = [
      packageName,
      affected ? `affected ${affected}` : '',
      patched ? `fixed in ${patched}` : '',
    ].filter(Boolean).join(' · ');
    const titleSize = autoFontSize(rawTitle, [
      { maxLen: 28, size: 68 },
      { maxLen: 48, size: 58 },
      { maxLen: 68, size: 48 },
      { maxLen: 90, size: 40 },
    ]);

    return {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '1200px',
          height: '630px',
          padding: '64px 72px',
          boxSizing: 'border-box',
          backgroundColor: bgColor,
          fontFamily: 'Inter, sans-serif',
        },
        children: [
          {
            type: 'div',
            props: {
              style: { display: 'flex', alignItems: 'center', gap: '18px' },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      padding: '10px 20px',
                      borderRadius: '999px',
                      backgroundColor: severity.color,
                    },
                    children: {
                      type: 'span',
                      props: {
                        style: { fontSize: '20px', fontWeight: 700, color: contrastText(severity.color) },
                        children: severity.label,
                      },
                    },
                  },
                },
                ...(advisoryId
                  ? [{
                      type: 'span',
                      props: {
                        style: { fontSize: '20px', fontWeight: 600, color: accentTextColor, fontFamily: 'JetBrains Mono, monospace' },
                        children: advisoryId,
                      },
                    }]
                  : []),
              ],
            },
          },
          {
            type: 'div',
            props: {
              style: { display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1, gap: '24px' },
              children: [
                {
                  type: 'h1',
                  props: {
                    style: { fontSize: `${titleSize}px`, lineHeight: 1.1, fontWeight: 700, color: textColor, margin: 0 },
                    children: title,
                  },
                },
                ...(details
                  ? [{
                      type: 'span',
                      props: {
                        style: { fontSize: '26px', fontWeight: 500, color: textColor },
                        children: details,
                      },
                    }]
                  : []),
              ],
            },
          },
          ...(siteName
            ? [{
                type: 'span',
                props: {
                  style: { fontSize: '22px', fontWeight: 600, color: textColor },
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
