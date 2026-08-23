import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { ProductCatalog } from '@/components/catalog/ProductCatalog';

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const formattedName = params.slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return {
    title: `${formattedName} in Lakki Marwat | Yasin Laptop Hub`,
    description: `Shop inspected ${formattedName.toLowerCase()} with checking warranty at Yasin Laptop Hub in Lakki Marwat, KPK, Pakistan.`,
    openGraph: {
      title: `${formattedName} | Yasin Laptop Hub`,
      description: `Explore quality ${formattedName.toLowerCase()} available for sale with direct WhatsApp support.`,
    },
  };
}

export default function CategoryDetailPage({ params }: CategoryPageProps) {
  const categoryName = params.slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950" />}>
      <ProductCatalog
        title={`${categoryName}`}
        subtitle={`Browse genuine, inspected ${categoryName.toLowerCase()} selected for reliability and performance.`}
        breadcrumbs={[
          { label: 'Categories', href: '/categories' },
          { label: categoryName },
        ]}
        fixedCategory={params.slug}
        defaultProductType="laptop"
      />
    </Suspense>
  );
}
