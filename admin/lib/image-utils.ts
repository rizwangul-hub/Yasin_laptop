/**
 * Client-side Image Optimization & Compression Utility
 * Resizes large camera photos (e.g. 5MB-15MB) down to max 1400px JPEG (~200KB-350KB)
 * before uploading to prevent Vercel 4.5MB payload limit errors and network timeouts.
 */
export async function compressImageFile(file: File, maxWidth = 1400, maxHeight = 1400, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    // If SVG or small WebP/GIF, convert directly
    if (file.type === 'image/svg+xml' || file.type === 'image/gif') {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
      return;
    }

    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };

    reader.onerror = reject;

    img.onload = () => {
      let width = img.width;
      let height = img.height;

      if (width > maxWidth || height > maxHeight) {
        if (width > height) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        // Fallback to original base64
        resolve(reader.result as string);
        return;
      }

      // Smooth scaling
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);

      // Output as optimized JPEG
      const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
      resolve(compressedDataUrl);
    };

    img.onerror = () => {
      // Fallback
      const fallbackReader = new FileReader();
      fallbackReader.onload = () => resolve(fallbackReader.result as string);
      fallbackReader.onerror = reject;
      fallbackReader.readAsDataURL(file);
    };

    reader.readAsDataURL(file);
  });
}
