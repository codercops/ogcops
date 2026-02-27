export type TemplateFieldType = 'text' | 'textarea' | 'color' | 'select' | 'number' | 'toggle' | 'image';

export type TemplateCategory =
  | 'blog'
  | 'product'
  | 'saas'
  | 'github'
  | 'event'
  | 'podcast'
  | 'developer'
  | 'newsletter'
  | 'quote'
  | 'ecommerce'
  | 'job'
  | 'tutorial';

export interface TemplateField {
  key: string;
  label: string;
  type: TemplateFieldType;
  defaultValue: string | number | boolean;
  placeholder?: string;
  required?: boolean;
  options?: { label: string; value: string }[];
  min?: number;
  max?: number;
  group?: 'Content' | 'Style' | 'Brand';
}

export interface FontData {
  name: string;
  data: ArrayBuffer;
  weight: number;
  style: 'normal' | 'italic';
}

export type SatoriElement = {
  type: string;
  props: Record<string, any>;
};

export interface TemplateDefinition {
  id: string;
  name: string;
  category: TemplateCategory;
  description: string;
  tags: string[];
  fields: TemplateField[];
  defaults: Record<string, string | number | boolean>;
  render: (params: Record<string, any>) => SatoriElement;
}

export interface TemplateListItem {
  id: string;
  name: string;
  category: TemplateCategory;
  description: string;
  tags: string[];
  fields: TemplateField[];
  defaults: Record<string, string | number | boolean>;
  thumbnailUrl: string;
}

export const CATEGORY_META: Record<TemplateCategory, { label: string; description: string; icon: string }> = {
  blog: { label: 'Blog / Article', description: 'Blog posts, articles, and editorial content', icon: '📝' },
  product: { label: 'Product Launch', description: 'Product announcements and launches', icon: '🚀' },
  saas: { label: 'SaaS / Landing', description: 'SaaS products and landing pages', icon: '💻' },
  github: { label: 'GitHub / OSS', description: 'Open source and GitHub projects', icon: '🐙' },
  event: { label: 'Event / Conference', description: 'Events, conferences, and meetups', icon: '🎪' },
  podcast: { label: 'Podcast / Video', description: 'Podcasts, videos, and audio content', icon: '🎙️' },
  developer: { label: 'Developer / Portfolio', description: 'Developer profiles and portfolios', icon: '👩‍💻' },
  newsletter: { label: 'Newsletter', description: 'Newsletter issues and digests', icon: '📧' },
  quote: { label: 'Social / Quote', description: 'Quotes and social media posts', icon: '💬' },
  ecommerce: { label: 'E-commerce', description: 'Products, sales, and commerce', icon: '🛒' },
  job: { label: 'Job Posting', description: 'Job listings and hiring posts', icon: '💼' },
  tutorial: { label: 'Tutorial / Course', description: 'Tutorials, courses, and education', icon: '🎓' },
};

export const ALL_CATEGORIES: TemplateCategory[] = [
  'blog', 'product', 'saas', 'github', 'event', 'podcast',
  'developer', 'newsletter', 'quote', 'ecommerce', 'job', 'tutorial',
];
