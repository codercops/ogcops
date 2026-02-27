import type { APIRoute } from 'astro';
import { getAllTemplates, getCategoryCounts } from '@/templates/registry';
import { ALL_CATEGORIES } from '@/templates/types';

export const GET: APIRoute = async () => {
  const templates = getAllTemplates();
  const categoryCounts = getCategoryCounts();

  const response = {
    count: templates.length,
    categories: ALL_CATEGORIES.map((cat) => ({
      id: cat,
      count: categoryCounts[cat] || 0,
    })),
    templates: templates.map((t) => ({
      id: t.id,
      name: t.name,
      category: t.category,
      description: t.description,
      tags: t.tags,
      fields: t.fields,
      defaults: t.defaults,
      thumbnailUrl: `/api/templates/${t.id}/thumbnail.png`,
    })),
  };

  return new Response(JSON.stringify(response), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
