import { Request, Response } from 'express';
import { cloudinaryService, CloudinaryFolder } from '../services/cloudinaryService';
import { sendSuccess, sendError } from '../utils/apiResponse';

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

    // If Cloudinary is configured, upload to Cloudinary
    if (cloudinaryService.isConfigured()) {
      const uploadResult = await cloudinaryService.uploadImage(image, targetFolder, tags);
      sendSuccess(res, 'Image uploaded successfully to Cloudinary', {
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        width: uploadResult.width,
        height: uploadResult.height,
        format: uploadResult.format,
      });
      return;
    }

    // Fallback if Cloudinary environment credentials are not present in local dev
    // If it is a base64 image data URI, return a safe dev object
    sendSuccess(res, 'Image processed (Local / Development Mode)', {
      url: typeof image === 'string' && image.startsWith('data:') ? image : image,
      publicId: `dev-img-${Date.now()}`,
      width: 800,
      height: 600,
      format: 'webp',
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Image upload failed';
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

    const result = await cloudinaryService.deleteImage(publicId);
    sendSuccess(res, 'Image deleted successfully', { deleted: result });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Image deletion failed';
    sendError(res, message, undefined, 500);
  }
};
