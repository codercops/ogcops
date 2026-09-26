import { defineMiddleware } from 'astro:middleware';

// CORS for the public API, applied to every response on these paths,
// including preflights the routes don't handle themselves. Route handlers can still set their own
// values; these only fill in what is missing.
const CORS_RULES: [RegExp, Record<string, string>][] = [
  [
    /^\/api\/og$/,
    {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  ],
  [/^\/api\/templates\/[^/]+\/thumbnail\.png$/, { 'Access-Control-Allow-Origin': '*' }],
  [/^\/api\/templates$/, { 'Access-Control-Allow-Origin': '*' }],
  [/^\/api\/preview$/, { 'Access-Control-Allow-Origin': '*' }],
];

export const onRequest = defineMiddleware(async ({ url, request }, next) => {
  const rule = CORS_RULES.find(([pattern]) => pattern.test(url.pathname))?.[1];
  if (!rule) return next();

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: rule });
  }

  const response = await next();
  // Copy the response: bodies from the edge cache come with immutable headers.
  const withCors = new Response(response.body, response);
  for (const [name, value] of Object.entries(rule)) {
    if (!withCors.headers.has(name)) withCors.headers.set(name, value);
  }
  return withCors;
});
