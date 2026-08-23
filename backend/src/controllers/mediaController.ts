import { Request, Response } from 'express';
import { Product } from '../models/Product';
import { HeroMedia } from '../models/HeroMedia';
import { sendSuccess, sendError } from '../utils/apiResponse';
import { isDatabaseConnected } from '../config/database';
import { cloudinaryService } from '../services/cloudinaryService';

interface IMediaEntry {
  url: string;
  publicId: string;
  usedIn: string[];
  lastSeen: Date;
}

interface IImageItem {
  url: string;
  publicId?: string;
}

export const getMediaLibrary = async (_req: Request, res: Response): Promise<void> => {
  if (!isDatabaseConnected()) {
    sendSuccess(res, 'Database offline; returning empty media list', []);
    return;
  }

  const [products, heroSlides] = await Promise.all([
    Product.find({ isDeleted: false }).select('name images').lean(),
    HeroMedia.find({ isActive: true }).select('title image').lean(),
  ]);

  const mediaMap = new Map<string, IMediaEntry>();

  (products as unknown as Array<{ name: string; images?: IImageItem[] }>).forEach((p) => {
    p.images?.forEach((img: IImageItem) => {
      if (img.url) {
        const existing = mediaMap.get(img.url);
        const entry: IMediaEntry = existing || {
          url: img.url,
          publicId: img.publicId || '',
          usedIn: [] as string[],
          lastSeen: new Date(),
        };
        entry.usedIn.push(`Product: ${p.name}`);
        mediaMap.set(img.url, entry);
      }
    });
  });

  (heroSlides as unknown as Array<{ title?: string; image?: IImageItem }>).forEach((h) => {
    if (h.image?.url) {
      const existing = mediaMap.get(h.image.url);
      const entry: IMediaEntry = existing || {
        url: h.image.url,
        publicId: h.image.publicId || '',
        usedIn: [] as string[],
        lastSeen: new Date(),
      };
      entry.usedIn.push(`Hero: ${h.title || 'Slide'}`);
      mediaMap.set(h.image.url, entry);
    }
  });

  const mediaList = Array.from(mediaMap.values());
  sendSuccess(res, 'Media library fetched successfully', mediaList);
};

export const deleteMedia = async (req: Request, res: Response): Promise<void> => {
  const { publicId, url, force = false } = req.body;

  if (!publicId && !url) {
    sendError(res, 'publicId or url required', undefined, 400);
    return;
  }

  if (isDatabaseConnected() && !force) {
    const referencingProducts = await Product.find({
      isDeleted: false,
      'images.url': url,
    }).select('name');

    if (referencingProducts.length > 0) {
      sendError(
        res,
        `Cannot delete image: It is currently referenced by ${referencingProducts.length} product(s). Remove it from the product first.`,
        { products: referencingProducts.map((p) => p.name) },
        400
      );
      return;
    }
  }

  if (publicId && cloudinaryService.isConfigured()) {
    await cloudinaryService.deleteImage(publicId);
  }

  sendSuccess(res, 'Media asset deleted successfully', { deleted: true });
};
