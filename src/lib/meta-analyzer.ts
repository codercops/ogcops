import type { MetaTags } from './meta-fetcher';

export interface AnalysisIssue {
  severity: 'error' | 'warning' | 'info';
  tag: string;
  message: string;
}

export interface AnalysisResult {
  score: number; // 0-100
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  issues: AnalysisIssue[];
  summary: string;
}

export function analyzeMeta(tags: MetaTags): AnalysisResult {
  const issues: AnalysisIssue[] = [];
  let score = 100;

  // Title checks
  if (!tags.title && !tags.ogTitle) {
    issues.push({ severity: 'error', tag: 'title', message: 'No page title found' });
    score -= 20;
  } else if (tags.title && tags.title.length > 70) {
    issues.push({ severity: 'warning', tag: 'title', message: `Title is ${tags.title.length} chars (recommended: under 70)` });
    score -= 5;
  }

  // Description checks
  if (!tags.description && !tags.ogDescription) {
    issues.push({ severity: 'error', tag: 'description', message: 'No meta description found' });
    score -= 15;
  } else {
    const desc = tags.description || tags.ogDescription || '';
    if (desc.length < 50) {
      issues.push({ severity: 'warning', tag: 'description', message: 'Description is too short (recommended: 50-160 chars)' });
      score -= 5;
    } else if (desc.length > 160) {
      issues.push({ severity: 'warning', tag: 'description', message: `Description is ${desc.length} chars (recommended: under 160)` });
      score -= 3;
    }
  }

  // OG Tags
  if (!tags.ogTitle) {
    issues.push({ severity: 'error', tag: 'og:title', message: 'Missing og:title tag' });
    score -= 10;
  }

  if (!tags.ogDescription) {
    issues.push({ severity: 'warning', tag: 'og:description', message: 'Missing og:description tag' });
    score -= 5;
  }

  if (!tags.ogImage) {
    issues.push({ severity: 'error', tag: 'og:image', message: 'Missing og:image tag — no image will show in social previews' });
    score -= 20;
  } else {
    if (!tags.ogImageWidth || !tags.ogImageHeight) {
      issues.push({ severity: 'info', tag: 'og:image:width/height', message: 'Image dimensions not specified — platforms may crop unexpectedly' });
      score -= 3;
    }
  }

  if (!tags.ogUrl) {
    issues.push({ severity: 'info', tag: 'og:url', message: 'Missing og:url tag' });
    score -= 2;
  }

  if (!tags.ogType) {
    issues.push({ severity: 'info', tag: 'og:type', message: 'Missing og:type tag (defaults to "website")' });
    score -= 2;
  }

  // Twitter Card
  if (!tags.twitterCard) {
    issues.push({ severity: 'warning', tag: 'twitter:card', message: 'Missing twitter:card tag — Twitter/X will use fallback display' });
    score -= 8;
  } else if (tags.twitterCard !== 'summary_large_image' && tags.twitterCard !== 'summary') {
    issues.push({ severity: 'info', tag: 'twitter:card', message: `Card type "${tags.twitterCard}" — consider "summary_large_image" for best visibility` });
  }

  if (!tags.twitterTitle && !tags.ogTitle) {
    issues.push({ severity: 'warning', tag: 'twitter:title', message: 'No twitter:title or og:title for Twitter/X card' });
    score -= 5;
  }

  if (!tags.twitterImage && !tags.ogImage) {
    issues.push({ severity: 'error', tag: 'twitter:image', message: 'No twitter:image or og:image — no image on Twitter/X' });
    score -= 10;
  }

  // Canonical
  if (!tags.canonical) {
    issues.push({ severity: 'info', tag: 'canonical', message: 'No canonical URL specified' });
    score -= 2;
  }

  score = Math.max(0, Math.min(100, score));

  const grade = score >= 90 ? 'A' : score >= 75 ? 'B' : score >= 60 ? 'C' : score >= 40 ? 'D' : 'F';

  const issueCount = issues.filter((i) => i.severity === 'error').length;
  const summary =
    score >= 90
      ? 'Excellent! Your meta tags are well-configured.'
      : score >= 75
        ? 'Good setup with minor improvements possible.'
        : score >= 60
          ? `Decent, but ${issueCount} critical issue${issueCount !== 1 ? 's' : ''} found.`
          : `Needs work — ${issueCount} critical issue${issueCount !== 1 ? 's' : ''} affecting social previews.`;

  return { score, grade, issues, summary };
}
