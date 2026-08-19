const UPLOAD_SEGMENT = '/upload/';

/**
 * Checks if the URL points to Cloudinary.
 */
export function isCloudinaryUrl(url: string): boolean {
  return /cloudinary\.com/i.test(url);
}

/**
 * Adds Cloudinary auto-format and auto-quality params when missing.
 * Non-Cloudinary URLs are returned unchanged.
 */
export function withCloudinaryAuto(url: string): string {
  if (!url || !isCloudinaryUrl(url)) return url;

  const idx = url.indexOf(UPLOAD_SEGMENT);
  if (idx === -1) return url;

  const afterUpload = url.slice(idx + UPLOAD_SEGMENT.length);
  if (afterUpload.startsWith('f_auto') || afterUpload.includes(',f_auto')) {
    return url;
  }

  return `${url.slice(0, idx + UPLOAD_SEGMENT.length)}f_auto,q_auto/${afterUpload}`;
}

/**
 * Null-safe wrapper used by optimized image components.
 */
export function optimizeCloudinaryUrl(url: string | null | undefined): string {
  if (!url || typeof url !== 'string') {
    return '/placeholder.png';
  }
  return withCloudinaryAuto(url);
}

export function mapCloudinaryImages(images: string[]): string[] {
  return images.map(withCloudinaryAuto);
}

export function isRemoteImageUrl(url: string): boolean {
  return url.startsWith('http://') || url.startsWith('https://');
}
