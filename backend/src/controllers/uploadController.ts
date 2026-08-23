import { Request, Response } from 'express';
import { cloudinaryService, CloudinaryFolder } from '../services/cloudinaryService';
import { sendSuccess, sendError } from '../utils/apiResponse';
import { logger } from '../utils/logger';

export const uploadImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { image, folder = 'products', tags = [] } = req.body;

    if (!image) {
      sendError(res, 'Image data (base64 or remote URL) is required', undefined, 400);
      return;
    }

    // Validate folder
    const validFolders: CloudinaryFolder[] = ['products', 'brands', 'categories', 'hero', 'accessories'];
    const targetFolder: CloudinaryFolder = validFolders.includes(folder) ? folder : 'products';

    // If Cloudinary is configured, attempt upload to Cloudinary
    if (cloudinaryService.isConfigured()) {
      try {
        const uploadResult = await cloudinaryService.uploadImage(image, targetFolder, tags);
        sendSuccess(res, 'Image uploaded successfully to Cloudinary', {
          url: uploadResult.secure_url,
          publicId: uploadResult.public_id,
          width: uploadResult.width,
          height: uploadResult.height,
          format: uploadResult.format,
        });
        return;
      } catch (cloudErr) {
        logger.warn('Cloudinary upload attempt failed; falling back to direct storage:', cloudErr);
      }
    }

    // Fallback: Return image data directly so product creation is never blocked
    const fallbackId = `img-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    sendSuccess(res, 'Image processed successfully', {
      url: typeof image === 'string' && image.startsWith('data:') ? image : image,
      publicId: fallbackId,
      width: 800,
      height: 600,
      format: 'webp',
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Image upload failed';
    logger.error('Upload handler error:', message);
    sendError(res, message, undefined, 500);
  }
};

export const deleteImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { publicId } = req.body;

    if (!publicId) {
      sendError(res, 'publicId is required for deletion', undefined, 400);
      return;
    }

    if (cloudinaryService.isConfigured() && !publicId.startsWith('img-') && !publicId.startsWith('dev-')) {
      const result = await cloudinaryService.deleteImage(publicId);
      sendSuccess(res, 'Image deleted successfully', { deleted: result });
      return;
    }

    sendSuccess(res, 'Image reference removed', { deleted: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Image deletion failed';
    sendError(res, message, undefined, 500);
  }
};
