'use client';

import Image, { type ImageProps } from 'next/image';
import { optimizeCloudinaryUrl, isRemoteImageUrl } from '@/src/lib/cloudinary';

type OptimizedImageProps = Omit<ImageProps, 'src'> & {
  src: string | null | undefined;
};

export function OptimizedImage({
  src,
  alt,
  unoptimized,
  ...props
}: OptimizedImageProps) {
  const optimizedSrc = optimizeCloudinaryUrl(src);
  const shouldUnoptimize =
    unoptimized ?? (isRemoteImageUrl(optimizedSrc) && !/cloudinary\.com/i.test(optimizedSrc));

  return (
    <Image
      src={optimizedSrc}
      alt={alt}
      unoptimized={shouldUnoptimize}
      {...props}
    />
  );
}
