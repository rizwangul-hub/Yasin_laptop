'use client';

import React, { useState, useEffect } from 'react';
import { ProductForm, IProductFormData } from '@/components/products/ProductForm';
import { adminApiClient } from '@/lib/api-client';
import { Loader2 } from 'lucide-react';

interface EditProductPageProps {
  params: {
    id: string;
  };
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const [productData, setProductData] = useState<IProductFormData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminApiClient<any>(`/products/id/${params.id}`)
      .then((res) => {
        if (res.success && res.data) {
          const p = res.data;
          setProductData({
            name: p.name,
            slug: p.slug,
            brand: typeof p.brand === 'object' && p.brand !== null ? p.brand._id : p.brand || '',
            laptopModel: p.laptopModel || '',
            productType: p.productType || 'laptop',
            description: p.description || '',
            shortDescription: p.shortDescription || '',
            price: p.price || 0,
            previousPrice: p.previousPrice,
            condition: p.condition || 'excellent',
            stockStatus: p.stockStatus || 'available',
            warranty: p.warranty || '',
            chargerIncluded: Boolean(p.chargerIncluded),
            featured: Boolean(p.featured),
            bestDeal: Boolean(p.bestDeal),
            latestArrival: Boolean(p.latestArrival),
            categories: Array.isArray(p.categories) ? p.categories.map((c: any) => typeof c === 'object' ? c._id : c) : [],
            useCases: Array.isArray(p.useCases) ? p.useCases.map((u: any) => typeof u === 'object' ? u._id : u) : [],
            images: Array.isArray(p.images) ? p.images : [],
            specs: {
              processor: p.specs?.processor || '',
              generation: p.specs?.generation || '',
              ram: p.specs?.ram || '',
              ramType: p.specs?.ramType || '',
              storage: p.specs?.storage || '',
              storageType: p.specs?.storageType || '',
              displaySize: p.specs?.displaySize || '',
              displayResolution: p.specs?.displayResolution || '',
              graphics: p.specs?.graphics || '',
              battery: p.specs?.battery || '',
              operatingSystem: p.specs?.operatingSystem || '',
              color: p.specs?.color || '',
            },
            seoTitle: p.seoTitle || '',
            seoDescription: p.seoDescription || '',
          });
        } else {
          setError('Product not found');
        }
      })
      .catch(() => setError('Failed to load product for editing'))
      .finally(() => setIsLoading(false));
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-xs text-slate-400 gap-2">
        <Loader2 className="w-5 h-5 animate-spin text-brand-400" />
        <span>Loading product specifications...</span>
      </div>
    );
  }

  if (error || !productData) {
    return (
      <div className="p-8 text-center text-xs text-rose-400 bg-rose-950/20 rounded-2xl border border-rose-900/40">
        {error || 'Unable to retrieve product details.'}
      </div>
    );
  }

  return <ProductForm initialData={productData} productId={params.id} />;
}
