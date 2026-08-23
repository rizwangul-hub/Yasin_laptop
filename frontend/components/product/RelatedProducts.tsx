import React from 'react';
import { IProduct } from '@/types';
import { ProductCard } from '../products/ProductCard';
import { Laptop } from 'lucide-react';

interface RelatedProductsProps {
  products: IProduct[];
}

export const RelatedProducts: React.FC<RelatedProductsProps> = ({ products }) => {
  if (!products || products.length === 0) return null;

  return (
    <section className="space-y-6 pt-6 border-t border-slate-800">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-brand-600/15 border border-brand-500/20 text-brand-400 flex items-center justify-center">
          <Laptop className="w-4 h-4" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Similar Laptops You May Also Like
          </h2>
          <p className="text-xs text-slate-400">
            Comparable machines matching brand, use case or price bracket.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.slice(0, 4).map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
};
