import type { APIRoute } from 'astro';
import { renderToPng } from '@/lib/og-engine';
import { getTemplate } from '@/templates/registry';

// In-memory cache for thumbnails (defaults don't change at runtime)
const thumbnailCache = new Map<string, ArrayBuffer>();

export const GET: APIRoute = async ({ params }) => {
  const { id } = params;

  const template = getTemplate(id!);
  if (!template) {
    return new Response(JSON.stringify({ error: 'Template not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    let png = thumbnailCache.get(id!);
    if (!png) {
      const element = template.render(template.defaults);
      png = await renderToPng(element, { width: 600, height: 315 });
      thumbnailCache.set(id!, png);
    }

    return new Response(png, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=604800',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err) {
    console.error(`Thumbnail generation error for ${id}:`, err);
    return new Response(JSON.stringify({ error: 'Failed to generate thumbnail' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
