export function getOptimizedAdminThumbnail(url?: string | null): string {
  if (!url) return '';
  if (!url.includes('res.cloudinary.com') || !url.includes('/upload/')) {
    return url;
  }
  if (url.includes('/f_auto') || url.includes('/q_auto')) {
    return url;
  }
  return url.replace('/upload/', '/upload/f_auto,q_auto,w_160,h_160,c_fill/');
}
