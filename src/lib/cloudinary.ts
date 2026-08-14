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
}
