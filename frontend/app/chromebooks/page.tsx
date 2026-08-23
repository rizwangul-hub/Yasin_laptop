import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { ProductCatalog } from '@/components/catalog/ProductCatalog';

export const metadata: Metadata = {
  title: 'Chromebooks | Lightweight & Budget Laptops in Lakki Marwat',
  description: 'Fast, secure and long battery life Chromebooks. Ideal for students, online classes, homework, and web browsing at Yasin Laptop Hub.',
};

export default function ChromebooksPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-warm-bg" />}>
      <ProductCatalog
        title="Chromebooks Catalog"
        subtitle="Portable, cloud-ready laptops with exceptional battery endurance for students and everyday web browsing."
        breadcrumbs={[{ label: 'Chromebooks', href: '/chromebooks' }]}
        defaultProductType="chromebook"
      />
    </Suspense>
  );
}
