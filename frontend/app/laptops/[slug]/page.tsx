import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { ProductDetailView } from '@/components/product/ProductDetailView';
import { ProductDetailsSkeleton } from '@/components/product/ProductDetailsSkeleton';
import { productService } from '@/services/productService';
import { DEFAULT_BUSINESS_CONFIG } from '@/lib/business-config';

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const formattedSlugName = params.slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  try {
    const res = await productService.getProductBySlug(params.slug);
    if (res.success && res.data) {
      const product = res.data;
      const specsSummary = [
        product.specs?.processor,
        product.specs?.generation,
        product.specs?.ram ? `${product.specs.ram} RAM` : '',
        product.specs?.storage,
      ]
        .filter(Boolean)
        .join(' • ');

      const title = `${product.name}${specsSummary ? ` (${specsSummary})` : ''} | Yasin Laptop Hub`;
      const description = `Buy ${product.name} with checking warranty in Lakki Marwat, KPK, Pakistan. Condition: ${product.condition || 'Inspected'}. Price: Rs. ${product.price?.toLocaleString('en-PK')}.`;

      const primaryImage = product.images?.find((img) => img.isPrimary || img.isMain) || product.images?.[0];

      return {
        title,
        description,
        alternates: {
          canonical: `/laptops/${product.slug}`,
        },
        openGraph: {
          title,
          description,
          url: `/laptops/${product.slug}`,
          siteName: 'Yasin Laptop Hub',
          images: primaryImage?.url ? [{ url: primaryImage.url, alt: product.name }] : [],
          type: 'website',
        },
      };
    }
  } catch (err) {
    // Fallback if backend API is not reached at build time
  }

  return {
    title: `${formattedSlugName} | Yasin Laptop Hub Lakki Marwat`,
    description: `Inspect ${formattedSlugName} hardware specifications, condition, and pricing at Yasin Laptop Hub in Lakki Marwat, KPK, Pakistan.`,
  };
}

export default async function LaptopDetailPage({ params }: ProductPageProps) {
  let initialProduct = null;

  try {
    const res = await productService.getProductBySlug(params.slug);
    if (res.success && res.data) {
      initialProduct = res.data;
    }
  } catch (err) {
    // Client-side ProductDetailView will perform dynamic hydration/retry
  }

  // Build JSON-LD Schema
  const jsonLd = initialProduct
    ? {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: initialProduct.name,
        image: initialProduct.images?.map((img) => img.url) || [],
        description: initialProduct.description || initialProduct.shortDescription || initialProduct.name,
        brand: {
          '@type': 'Brand',
          name:
            typeof initialProduct.brand === 'object' && initialProduct.brand !== null
              ? initialProduct.brand.name
              : initialProduct.brand || 'Yasin Laptop Hub',
        },
        offers: {
          '@type': 'Offer',
          url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://yasinlaptophub.com'}/laptops/${initialProduct.slug}`,
          priceCurrency: 'PKR',
          price: initialProduct.price,
          availability:
            initialProduct.stockStatus === 'available'
              ? 'https://schema.org/InStock'
              : 'https://schema.org/OutOfStock',
          itemCondition:
            initialProduct.condition === 'new'
              ? 'https://schema.org/NewCondition'
              : initialProduct.condition === 'refurbished'
              ? 'https://schema.org/RefurbishedCondition'
              : 'https://schema.org/UsedCondition',
          seller: {
            '@type': 'Organization',
            name: DEFAULT_BUSINESS_CONFIG.businessName,
          },
        },
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <Suspense fallback={<ProductDetailsSkeleton />}>
        <ProductDetailView slug={params.slug} initialProduct={initialProduct} />
      </Suspense>
    </>
  );
}
