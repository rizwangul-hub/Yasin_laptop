import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/laptops`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/chromebooks`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/accessories`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/laptop-shop-lakki-marwat`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  // Dynamic Product routes
  let dynamicProductRoutes: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${API_BASE_URL}/products?limit=500`, { next: { revalidate: 3600 } });
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.data?.items) {
        dynamicProductRoutes = data.data.items.map((p: any) => ({
          url: `${SITE_URL}/laptops/${p.slug}`,
          lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
          changeFrequency: 'weekly',
          priority: 0.7,
        }));
      }
    }
  } catch (err) {
    // API offline during static build fallback
  }

  // Dynamic Category routes
  let dynamicCategoryRoutes: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${API_BASE_URL}/categories`, { next: { revalidate: 3600 } });
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.data) {
        dynamicCategoryRoutes = data.data.map((c: any) => ({
          url: `${SITE_URL}/categories/${c.slug}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.75,
        }));
      }
    }
  } catch (err) {
    // Fallback
  }

  // Dynamic Brand routes
  let dynamicBrandRoutes: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${API_BASE_URL}/brands`, { next: { revalidate: 3600 } });
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.data) {
        dynamicBrandRoutes = data.data.map((b: any) => ({
          url: `${SITE_URL}/laptops/brand/${b.slug}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.75,
        }));
      }
    }
  } catch (err) {
    // Fallback
  }

  return [
    ...staticRoutes,
    ...dynamicProductRoutes,
    ...dynamicCategoryRoutes,
    ...dynamicBrandRoutes,
  ];
}
