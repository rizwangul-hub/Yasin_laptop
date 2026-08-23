import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { ProductCatalog } from '@/components/catalog/ProductCatalog';

export const metadata: Metadata = {
  title: 'All Laptops | Quality Laptops in Lakki Marwat & Pakistan',
  description: 'Search and filter genuine HP, Dell, Lenovo, Apple, ASUS laptops. Filter by processor, generation, RAM, SSD, condition, and price in Pakistani Rupees.',
};

export default function LaptopsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950" />}>
      <ProductCatalog
        title="All Laptops Catalog"
        subtitle="Explore genuine inspected business, student, programming and high-performance machines with checking warranty."
        breadcrumbs={[{ label: 'Laptops', href: '/laptops' }]}
        defaultProductType="laptop"
      />
    </Suspense>
  );
}
