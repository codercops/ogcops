import type { AnalysisResult } from '@/lib/meta-analyzer';
import type { MetaTags } from '@/lib/meta-fetcher';

interface MetaTagReportProps {
  analysis: AnalysisResult;
  meta: MetaTags;
}

export function MetaTagReport({ analysis, meta }: MetaTagReportProps) {
  const gradeColors: Record<string, string> = {
    A: '#22c55e',
    B: '#84cc16',
    C: '#eab308',
    D: '#f97316',
    F: '#ef4444',
  };

  return (
    <div className="meta-report">
      <div className="meta-report-header">
        <div className="meta-score" style={{ borderColor: gradeColors[analysis.grade] }}>
          <span className="meta-score-grade" style={{ color: gradeColors[analysis.grade] }}>
            {analysis.grade}
          </span>
          <span className="meta-score-number">{analysis.score}/100</span>
        </div>
        <div className="meta-score-summary">
          <h3>Meta Tag Score</h3>
          <p>{analysis.summary}</p>
        </div>
      </div>

      {analysis.issues.length > 0 && (
        <div className="meta-issues">
          <h4>Issues Found</h4>
          <div className="meta-issues-list">
            {analysis.issues.map((issue, i) => (
              <div key={i} className={`meta-issue meta-issue-${issue.severity}`}>
                <span className="meta-issue-badge">{issue.severity}</span>
                <span className="meta-issue-tag">{issue.tag}</span>
                <span className="meta-issue-msg">{issue.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <details className="meta-tags-details">
        <summary>All Meta Tags</summary>
        <table className="meta-tags-table">
          <thead>
            <tr>
              <th>Tag</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(meta)
              .filter(([, v]) => v)
              .map(([key, value]) => (
                <tr key={key}>
                  <td className="meta-tag-key">{key}</td>
                  <td className="meta-tag-value">{String(value).slice(0, 200)}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </details>
    </div>
  );
}
