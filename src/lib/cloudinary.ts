const UPLOAD_SEGMENT = '/upload/';

/**
 * Adds Cloudinary auto-format and auto-quality delivery params when missing.
 * Non-Cloudinary URLs are returned unchanged.
 */
export function optimizeCloudinaryUrl(url: string | null | undefined): string {
  if (!url || typeof url !== 'string') {
    return '/placeholder.png';
  }

  if (!/cloudinary\.com/i.test(url)) {
    return url;
  }

  const idx = url.indexOf(UPLOAD_SEGMENT);
  if (idx === -1) {
    return url;
  }

  const afterUpload = url.slice(idx + UPLOAD_SEGMENT.length);
  if (afterUpload.startsWith('f_auto') || afterUpload.includes(',f_auto')) {
    return url;
  }

  return `${url.slice(0, idx + UPLOAD_SEGMENT.length)}f_auto,q_auto/${afterUpload}`;
}

export function isRemoteImageUrl(url: string): boolean {
  return url.startsWith('http://') || url.startsWith('https://');
}
