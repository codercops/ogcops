import { usePreviewState } from './usePreviewState';
import { URLInput } from './URLInput';
import { PlatformGrid } from './PlatformGrid';
import { MetaTagReport } from './MetaTagReport';
import { FixItButton } from './FixItButton';
import { AIAnalyzer } from './AIAnalyzer';

export function PreviewApp() {
  const { url, setUrl, loading, error, data, checkUrl } = usePreviewState();

  return (
    <div className="preview-app">
      <div className="preview-header">
        <h1>Social Media Preview Checker</h1>
        <p>Enter a URL to see how it looks across 8 social platforms.</p>
      </div>

      <URLInput
        value={url}
        onChange={setUrl}
        onSubmit={() => checkUrl(url)}
        loading={loading}
      />

      {error && (
        <div className="preview-error">
          <span>{error}</span>
        </div>
      )}

      {data && (
        <div className="preview-results">
          <MetaTagReport analysis={data.analysis} meta={data.meta} />
          <AIAnalyzer meta={data.meta} url={data.url} />
          <PlatformGrid platforms={data.platforms} />
          <FixItButton meta={data.meta} />
        </div>
      )}

      {!data && !loading && !error && (
        <div className="preview-empty">
          <div className="preview-empty-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </div>
          <p>Enter a URL above to analyze its meta tags and preview how it appears on social media platforms.</p>
        </div>
      )}
    </div>
  );
}
