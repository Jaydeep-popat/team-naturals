<<<<<<< HEAD
/**
 * Apply Cloudinary auto-format/quality transforms to product image URLs only.
 * Local/static assets should pass through unchanged.
 */
export function isCloudinaryUrl(url: string): boolean {
  return /cloudinary\.com/i.test(url);
}

export function withCloudinaryAuto(url: string): string {
  if (!url || !isCloudinaryUrl(url)) return url;
  if (url.includes('/upload/f_auto') || url.includes('/upload/f_auto,')) return url;

  const uploadIndex = url.indexOf('/upload/');
  if (uploadIndex === -1) return url;

  const prefix = url.slice(0, uploadIndex + '/upload/'.length);
  const suffix = url.slice(uploadIndex + '/upload/'.length);
  return `${prefix}f_auto,q_auto/${suffix}`;
}

export function mapCloudinaryImages(images: string[]): string[] {
  return images.map(withCloudinaryAuto);
=======
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
>>>>>>> origin/yugal
}
