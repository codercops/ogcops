const REPO = 'codercops/ogcops';
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

let cached: { count: number; timestamp: number } | null = null;

export async function getStarCount(): Promise<number | null> {
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.count;
  }

  try {
    const res = await fetch(`https://api.github.com/repos/${REPO}`, {
      headers: { Accept: 'application/vnd.github.v3+json' },
    });
    if (!res.ok) return cached?.count ?? null;

    const data = await res.json();
    const count = data.stargazers_count ?? 0;
    cached = { count, timestamp: Date.now() };
    return count;
  } catch {
    return cached?.count ?? null;
  }
}

export function formatStarCount(count: number): string {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1).replace(/\.0$/, '')}k`;
  }
  return String(count);
}
