import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { ProductCatalog } from '@/components/catalog/ProductCatalog';

export const metadata: Metadata = {
  title: 'Laptop Accessories | Original Chargers, Bags, Stands, SSDs in Lakki Marwat',
  description: 'Original laptop power adapters, padded backpacks, ergonomic cooling stands, mice, RAM modules, and NVMe SSD upgrades at Yasin Laptop Hub.',
};

export default function AccessoriesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-warm-bg" />}>
      <ProductCatalog
        title="Laptop Accessories & Upgrades"
        subtitle="Complete your computing setup with original power adapters, ergonomic stands, protective sleeves, and high-speed SSDs."
        breadcrumbs={[{ label: 'Accessories', href: '/accessories' }]}
        defaultProductType="accessory"
      />
    </Suspense>
  );
}
