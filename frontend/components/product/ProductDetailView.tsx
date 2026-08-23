'use client';

import React, { useState, useEffect } from 'react';
import { IProduct, IAccessory } from '@/types';
import { Breadcrumbs } from '../catalog/Breadcrumbs';
import { ProductGallery } from './ProductGallery';
import { ProductInfo } from './ProductInfo';
import { ProductSpecs } from './ProductSpecs';
import { ProductDescription } from './ProductDescription';
import { RelatedProducts } from './RelatedProducts';
import { AccessoryCrossSell } from './AccessoryCrossSell';
import { StickyMobileCTA } from './StickyMobileCTA';
import { ProductNotFound } from './ProductNotFound';
import { ProductDetailsSkeleton } from './ProductDetailsSkeleton';
import { WhatsAppCta } from '../home/WhatsAppCta';
import { productService } from '@/services/productService';

interface ProductDetailViewProps {
  slug: string;
  initialProduct?: IProduct | null;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  slug,
  initialProduct,
}) => {
  const [product, setProduct] = useState<IProduct | null>(initialProduct || null);
  const [relatedProducts, setRelatedProducts] = useState<IProduct[]>([]);
  const [accessories, setAccessories] = useState<IAccessory[]>([]);
  const [isLoading, setIsLoading] = useState(!initialProduct);
  const [isNotFound, setIsNotFound] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      if (!initialProduct) {
        setIsLoading(true);
        try {
          const res = await productService.getProductBySlug(slug);
          if (isMounted) {
            if (res.success && res.data) {
              setProduct(res.data);
            } else {
              setIsNotFound(true);
            }
          }
        } catch (err) {
          if (isMounted) setIsNotFound(true);
        } finally {
          if (isMounted) setIsLoading(false);
        }
      }

      // Load related products and accessories
      try {
        const [relRes, accRes] = await Promise.allSettled([
          productService.getRelatedProducts(slug),
          productService.getAccessories({ limit: 4 }),
        ]);

        if (isMounted) {
          if (relRes.status === 'fulfilled' && Array.isArray(relRes.value.data)) {
            setRelatedProducts(relRes.value.data);
          }
          if (accRes.status === 'fulfilled' && accRes.value.success && accRes.value.data) {
            const rawAcc = accRes.value.data as unknown as Record<string, unknown>;
            const items = (
              Array.isArray(rawAcc)
                ? rawAcc
                : Array.isArray(rawAcc.items)
                ? rawAcc.items
                : Array.isArray(rawAcc.products)
                ? rawAcc.products
                : []
            ) as IAccessory[];
            setAccessories(items);
          }
        }
      } catch (err) {
        // Fallback gracefully without breaking view
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [slug, initialProduct]);

  if (isLoading) {
    return <ProductDetailsSkeleton />;
  }

  if (isNotFound || !product) {
    return <ProductNotFound />;
  }

  const primaryCategory = product.categories?.[0];
  const catName = typeof primaryCategory === 'object' && primaryCategory !== null ? primaryCategory.name : primaryCategory;
  const catSlug = typeof primaryCategory === 'object' && primaryCategory !== null ? primaryCategory.slug : primaryCategory;

  const breadcrumbs = [
    { label: 'Laptops', href: '/laptops' },
    ...(catName && catSlug ? [{ label: catName, href: `/categories/${catSlug}` }] : []),
    { label: product.name },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12 pb-24 lg:pb-12">
      {/* 1. BREADCRUMBS */}
      <Breadcrumbs items={breadcrumbs} />

      {/* 2. PRODUCT MAIN 2-COLUMN SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left: Gallery (approx 58%) */}
        <div className="lg:col-span-7">
          <ProductGallery images={product.images || []} productName={product.name} />
        </div>

        {/* Right: Product Info & Actions (approx 42%) */}
        <div className="lg:col-span-5">
          <ProductInfo product={product} />
        </div>
      </div>

      {/* 3. TECHNICAL SPECIFICATIONS */}
      <ProductSpecs product={product} />

      {/* 4. DESCRIPTION */}
      <ProductDescription description={product.description} name={product.name} />

      {/* 5. RELATED PRODUCTS */}
      <RelatedProducts products={relatedProducts} />

      {/* 6. ACCESSORIES CROSS-SELL */}
      <AccessoryCrossSell accessories={accessories} />

      {/* 7. BOTTOM INQUIRY CTA */}
      <WhatsAppCta />

      {/* 8. MOBILE STICKY CTA */}
      <StickyMobileCTA product={product} />
    </div>
  );
};
