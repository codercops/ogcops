import type { APIRoute } from 'astro';
import { incrementVisitors, getVisitors, hasUpstashCredentials } from '../../lib/upstash';

const SITE = 'ogcops';
const HEADERS = {
  'Content-Type': 'application/json',
  'Cache-Control': 'no-store',
};

export const POST: APIRoute = async () => {
  if (!hasUpstashCredentials()) return new Response(null, { status: 204 });
  try {
    const counts = await incrementVisitors(SITE);
    return new Response(JSON.stringify(counts), { headers: HEADERS });
  } catch {
    return new Response(JSON.stringify({ today: 0, total: 0 }), { status: 500, headers: HEADERS });
  }
};

export const GET: APIRoute = async () => {
  if (!hasUpstashCredentials()) return new Response(null, { status: 204 });
  try {
    const counts = await getVisitors(SITE);
    return new Response(JSON.stringify(counts), { headers: HEADERS });
  } catch {
    return new Response(JSON.stringify({ today: 0, total: 0 }), { status: 500, headers: HEADERS });
  }
};
