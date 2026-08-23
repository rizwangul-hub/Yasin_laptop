import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { ProductCatalog } from '@/components/catalog/ProductCatalog';

interface BrandCatalogPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: BrandCatalogPageProps): Promise<Metadata> {
  const brandName = params.slug.toUpperCase();

  return {
    title: `${brandName} Laptops in Lakki Marwat | Yasin Laptop Hub`,
    description: `Explore tested ${brandName} business, student and performance laptops at Yasin Laptop Hub in Lakki Marwat, KPK, Pakistan. Checking warranty and original chargers included.`,
    openGraph: {
      title: `${brandName} Laptops | Yasin Laptop Hub`,
      description: `Shop authentic ${brandName} laptops with direct WhatsApp inquiry and verified specifications.`,
    },
  };
}

export default function BrandCatalogPage({ params }: BrandCatalogPageProps) {
  const brandName = params.slug.toUpperCase();

  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950" />}>
      <ProductCatalog
        title={`${brandName} Laptops`}
        subtitle={`Explore our complete collection of genuine, inspected ${brandName} laptops available at Yasin Laptop Hub.`}
        breadcrumbs={[
          { label: 'Laptops', href: '/laptops' },
          { label: 'Brands', href: '/brands' },
          { label: brandName },
        ]}
        fixedBrand={params.slug}
        defaultProductType="laptop"
      />
    </Suspense>
  );
}
