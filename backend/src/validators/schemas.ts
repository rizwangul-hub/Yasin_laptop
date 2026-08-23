import { z } from 'zod';

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Valid email address is required'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  }),
});

export const productCreateSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Product name is required'),
    brand: z.string().min(1, 'Brand is required'),
    laptopModel: z.string().min(1, 'Model is required'),
    productType: z.enum(['laptop', 'chromebook', 'accessory']).default('laptop'),
    shortDescription: z.string().optional(),
    description: z.string().min(5, 'Description is required'),
    price: z.number().nonnegative('Price must be greater than or equal to 0'),
    previousPrice: z.number().nonnegative().optional(),
    condition: z.enum(['new', 'like-new', 'excellent', 'very-good', 'good', 'fair', 'refurbished', 'used']).default('excellent'),
    stockStatus: z.enum(['available', 'sold_out']).default('available'),
    featured: z.boolean().optional().default(false),
    bestDeal: z.boolean().optional().default(false),
    latestArrival: z.boolean().optional().default(false),
    categories: z.array(z.string()).optional().default([]),
    useCases: z.array(z.string()).optional().default([]),
  }),
});

export const productQuerySchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).optional(),
    limit: z.string().regex(/^\d+$/).optional(),
    search: z.string().optional(),
    brand: z.string().optional(),
    category: z.string().optional(),
    useCase: z.string().optional(),
    productType: z.enum(['laptop', 'chromebook', 'accessory']).optional(),
    minPrice: z.string().regex(/^\d+$/).optional(),
    maxPrice: z.string().regex(/^\d+$/).optional(),
    sort: z.enum(['price_asc', 'price_desc', 'newest', 'featured', 'best_deal']).optional(),
    condition: z.string().optional(),
    stockStatus: z.enum(['available', 'sold_out']).optional(),
  }).optional(),
});

export const categoryCreateSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Category name is required'),
    description: z.string().optional(),
    icon: z.string().optional(),
    parent: z.string().optional(),
  }),
});

export const brandCreateSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Brand name is required'),
    description: z.string().optional(),
  }),
});

export const inquiryCreateSchema = z.object({
  body: z.object({
    productNameSnapshot: z.string().min(1, 'Product name is required'),
    productId: z.string().optional(),
    customerName: z.string().optional(),
    customerPhone: z.string().optional(),
    message: z.string().optional(),
  }),
});

export const businessSettingsSchema = z.object({
  body: z.object({
    businessName: z.string().min(1).optional(),
    ownerName: z.string().min(1).optional(),
    whatsappNumber: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email().optional().or(z.literal('')),
    googleMapsUrl: z.string().optional(),
    description: z.string().optional(),
    businessHours: z.string().optional(),
  }),
});
