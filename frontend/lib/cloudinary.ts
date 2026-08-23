/**
 * Cloudinary Image URL Optimization Utility
 * Automatically injects optimal delivery transformations:
 * - f_auto: delivers WebP/AVIF based on browser support
 * - q_auto: optimal visual quality compression
 * - w_{width}, c_limit: right-sized image delivery avoiding huge downloads
 */

interface CloudinaryTransformOptions {
  width?: number;
  height?: number;
  quality?: 'auto' | 'auto:good' | 'auto:eco' | 'auto:low' | number;
  format?: 'auto' | 'webp' | 'avif' | 'jpg' | 'png';
  crop?: 'limit' | 'fill' | 'fit' | 'thumb' | 'scale';
}

export function getOptimizedImageUrl(
  url?: string | null,
  options: CloudinaryTransformOptions = {}
): string {
  if (!url) return '';

  // Only transform Cloudinary URLs
  if (!url.includes('res.cloudinary.com') || !url.includes('/upload/')) {
    return url;
  }

  // If already transformed with f_auto/q_auto, return as-is or adjust
  if (url.includes('/f_auto') || url.includes('/q_auto')) {
    return url;
  }

  const {
    width,
    height,
    quality = 'auto',
    format = 'auto',
    crop = 'limit',
  } = options;

  const transforms: string[] = [`f_${format}`, `q_${quality}`];

  if (width) {
    transforms.push(`w_${width}`);
  }
  if (height) {
    transforms.push(`h_${height}`);
  }
  if (width || height) {
    transforms.push(`c_${crop}`);
  }

  const transformString = transforms.join(',');

  // Insert transformations immediately after `/upload/`
  return url.replace('/upload/', `/upload/${transformString}/`);
}

/**
 * Pre-configured presets for consistent high-performance delivery
 */
export const ImagePresets = {
  // Product Card thumbnail in grids (2-col mobile, 4-col desktop)
  productCard: (url?: string | null) =>
    getOptimizedImageUrl(url, { width: 450, crop: 'limit', quality: 'auto' }),

  // Small square thumbnail in lists / admin table / cart
  thumbnail: (url?: string | null) =>
    getOptimizedImageUrl(url, { width: 150, height: 150, crop: 'fill', quality: 'auto' }),

  // High-res product gallery main view
  productDetail: (url?: string | null) =>
    getOptimizedImageUrl(url, { width: 900, crop: 'limit', quality: 'auto' }),

  // Fullscreen modal lightbox zoom
  lightbox: (url?: string | null) =>
    getOptimizedImageUrl(url, { width: 1400, crop: 'limit', quality: 'auto' }),

  // Hero carousel slides
  heroSlide: (url?: string | null) =>
    getOptimizedImageUrl(url, { width: 1200, crop: 'limit', quality: 'auto' }),
};
