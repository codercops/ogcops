/**
 * Copies text to the clipboard using the modern Clipboard API,
 * falling back to document.execCommand('copy') with a temporary textarea
 * if the modern API is unavailable or rejects.
 *
 * Returns true if copying succeeded, false otherwise.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (typeof navigator !== 'undefined' && typeof navigator.clipboard?.writeText === 'function') {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Modern Clipboard API rejected; proceed to fallback.
    }
  }

  if (typeof document !== 'undefined' && typeof document.createElement === 'function' && document.body) {
    let successful = false;
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    try {
      ta.select?.();
      successful = Boolean(document.execCommand?.('copy'));
    } catch {
      successful = false;
    } finally {
      if (ta.parentNode) {
        ta.parentNode.removeChild(ta);
      } else if (typeof document.body.removeChild === 'function') {
        document.body.removeChild(ta);
      }
    }
    return successful;
  }

  return false;
}

export { copyToClipboard as copyTextToClipboard };
