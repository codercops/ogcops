interface CanvasProps {
  svg: string | null;
  loading: boolean;
  error: string | null;
}

export function Canvas({ svg, loading, error }: CanvasProps) {
  if (loading) {
    return (
      <div className="canvas-wrapper">
        <div className="canvas-loading">
          <div className="canvas-spinner" />
          <span>Loading renderer...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="canvas-wrapper">
        <div className="canvas-error">
          <span>Render error: {error}</span>
        </div>
      </div>
    );
  }

  if (!svg) {
    return (
      <div className="canvas-wrapper">
        <div className="canvas-placeholder">
          <span>Select a template to begin</span>
        </div>
      </div>
    );
  }

  const dataUri = `data:image/svg+xml,${encodeURIComponent(svg)}`;

  return (
    <div className="canvas-wrapper">
      <div className="canvas-frame">
        <img
          src={dataUri}
          alt="OG Image Preview"
          className="canvas-image"
          width={1200}
          height={630}
        />
      </div>
    </div>
  );
}
