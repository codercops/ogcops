import type { TemplateDefinition } from '../types';
import { truncate, commonFields } from '../utils';

const template: TemplateDefinition = {
  id: 'developer-gradient-profile',
  name: 'Gradient Profile',
  category: 'developer',
  description: 'Bold gradient background with centered developer information',
  tags: ['developer', 'gradient', 'profile', 'centered'],
  fields: [
    { key: 'name', label: 'Name', type: 'text' as const, defaultValue: '', placeholder: 'Jane Smith', required: true, group: 'Content' as const },
    { key: 'role', label: 'Role', type: 'text' as const, defaultValue: '', placeholder: 'Full-Stack Developer', group: 'Content' as const },
    { key: 'tagline', label: 'Tagline', type: 'text' as const, defaultValue: '', placeholder: 'A short bio or motto', group: 'Content' as const },
    { key: 'website', label: 'Website', type: 'text' as const, defaultValue: '', placeholder: 'janesmith.dev', group: 'Content' as const },
    commonFields.bgColor,
    commonFields.accentColor,
    { key: 'gradientEnd', label: 'Gradient End', type: 'color' as const, defaultValue: '#7B61FF', group: 'Style' as const },
    commonFields.textColor,
  ],
  defaults: {
    name: 'Jane Smith',
    role: 'Full-Stack Developer',
    tagline: 'Crafting elegant solutions to complex problems',
    website: 'janesmith.dev',
    bgColor: '#0a0a0a',
    accentColor: '#E07A5F',
    gradientEnd: '#7B61FF',
    textColor: '#FFFFFF',
  },
  render: (params) => {
    const name = String(params.name || 'Developer');
    const role = String(params.role || '');
    const tagline = params.tagline ? truncate(String(params.tagline), 100) : '';
    const website = String(params.website || '');
    const bgColor = String(params.bgColor || '#0a0a0a');
    const accentColor = String(params.accentColor || '#E07A5F');
    const gradientEnd = String(params.gradientEnd || '#7B61FF');
    const textColor = String(params.textColor || '#FFFFFF');

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
          background: `linear-gradient(135deg, ${bgColor} 0%, #1a1a2e 100%)`,
          fontFamily: 'Inter, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        },
        children: [
          // Background gradient orbs
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                position: 'absolute',
                left: '-100px',
                top: '-100px',
                width: '400px',
                height: '400px',
                borderRadius: '50%',
                background: `radial-gradient(circle, ${accentColor}22 0%, transparent 70%)`,
              },
              children: '',
            },
          },
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                position: 'absolute',
                right: '-100px',
                bottom: '-100px',
                width: '400px',
                height: '400px',
                borderRadius: '50%',
                background: `radial-gradient(circle, ${gradientEnd}22 0%, transparent 70%)`,
              },
              children: '',
            },
          },
          // Avatar
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${accentColor}, ${gradientEnd})`,
                marginBottom: '32px',
              },
              children: {
                type: 'span',
                props: {
                  style: {
                    fontSize: '48px',
                    fontWeight: 700,
                    color: '#FFFFFF',
                  },
                  children: name.charAt(0).toUpperCase(),
                },
              },
            },
          },
          // Name
          {
            type: 'h1',
            props: {
              style: {
                fontSize: '56px',
                fontWeight: 800,
                color: textColor,
                lineHeight: 1.1,
                margin: 0,
                textAlign: 'center',
                fontFamily: 'Playfair Display, serif',
              },
              children: name,
            },
          },
          // Role
          ...(role
            ? [
                {
                  type: 'span',
                  props: {
                    style: {
                      fontSize: '22px',
                      fontWeight: 600,
                      color: accentColor,
                      marginTop: '12px',
                      textAlign: 'center',
                    },
                    children: role,
                  },
                },
              ]
            : []),
          // Tagline
          ...(tagline
            ? [
                {
                  type: 'p',
                  props: {
                    style: {
                      fontSize: '18px',
                      color: `${textColor}77`,
                      lineHeight: 1.5,
                      margin: 0,
                      marginTop: '20px',
                      textAlign: 'center',
                      maxWidth: '600px',
                    },
                    children: tagline,
                  },
                },
              ]
            : []),
          // Website
          ...(website
            ? [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      marginTop: '28px',
                      padding: '10px 28px',
                      background: `${textColor}08`,
                      borderRadius: '100px',
                      border: `1px solid ${textColor}15`,
                    },
                    children: {
                      type: 'span',
                      props: {
                        style: { fontSize: '16px', color: `${textColor}88` },
                        children: website,
                      },
                    },
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
