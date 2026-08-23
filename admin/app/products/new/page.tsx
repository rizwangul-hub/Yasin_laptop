'use client';

import React, { Suspense } from 'react';
import { ProductForm } from '@/components/products/ProductForm';

export default function NewProductPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">Loading form...</div>}>
      <ProductForm />
    </Suspense>
  );
}
