export function containsLocalImage(params: Record<string, unknown>): boolean {
  return Object.values(params).some(
    (value) => typeof value === 'string' && value.trim().toLowerCase().startsWith('data:image/')
  );
}

export function svgToPngBlob(svg: string, width = 1200, height = 630): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext('2d');
      if (!context) return reject(new Error('Canvas is not supported'));
      try {
        context.drawImage(image, 0, 0, width, height);
        canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('Could not create PNG'))), 'image/png');
      } catch (error) {
        reject(error);
      }
    };
    image.onerror = () => reject(new Error('Could not render SVG'));
    image.src = `data:image/svg+xml,${encodeURIComponent(svg)}`;
  });
}
