import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { ENV } from '../config/env';
import { logger } from '../utils/logger';

export type CloudinaryFolder = 
  | 'products'
  | 'brands'
  | 'categories'
  | 'hero'
  | 'accessories';

const BASE_FOLDER = 'yasin-laptop-hub';

export interface ImageValidationResult {
  valid: boolean;
  error?: string;
}

export const cloudinaryService = {
  isConfigured: (): boolean => {
    return Boolean(ENV.CLOUDINARY_CLOUD_NAME && ENV.CLOUDINARY_API_KEY && ENV.CLOUDINARY_API_SECRET);
  },

  validateImageFile: (mimetype: string, sizeInBytes: number, maxMb = 5): ImageValidationResult => {
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedMimeTypes.includes(mimetype.toLowerCase())) {
      return {
        valid: false,
        error: `Unsupported image format (${mimetype}). Only JPEG, JPG, PNG, and WebP are supported.`,
      };
    }

    const maxBytes = maxMb * 1024 * 1024;
    if (sizeInBytes > maxBytes) {
      return {
        valid: false,
        error: `File size exceeds the ${maxMb}MB limit.`,
      };
    }

    return { valid: true };
  },

  uploadImage: async (
    fileBufferOrPath: string,
    folder: CloudinaryFolder,
    tags: string[] = []
  ): Promise<UploadApiResponse> => {
    if (!cloudinaryService.isConfigured()) {
      throw new Error('Cloudinary credentials are not configured in environment variables.');
    }

    try {
      const result = await cloudinary.uploader.upload(fileBufferOrPath, {
        folder: `${BASE_FOLDER}/${folder}`,
        resource_type: 'image',
        tags: ['yasin-laptop-hub', folder, ...tags],
        transformation: [
          { quality: 'auto', fetch_format: 'auto' }, // Automatic WebP/AVIF compression
        ],
      });
      return result;
    } catch (error) {
      logger.error('Cloudinary Upload Error:', error);
      throw error;
    }
  },

  deleteImage: async (publicId: string): Promise<boolean> => {
    if (!cloudinaryService.isConfigured()) {
      logger.warn('Cloudinary not configured; skipping remote delete for:', publicId);
      return false;
    }

    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return result.result === 'ok';
    } catch (error) {
      logger.error(`Cloudinary Delete Error for ${publicId}:`, error);
      return false;
    }
  },

  getOptimizedUrl: (
    publicId: string,
    options?: { width?: number; height?: number; crop?: string }
  ): string => {
    if (!publicId) return '';
    return cloudinary.url(publicId, {
      quality: 'auto',
      fetch_format: 'auto',
      secure: true,
      ...options,
    });
  },
};
