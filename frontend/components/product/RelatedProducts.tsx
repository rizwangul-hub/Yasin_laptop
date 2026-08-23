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
    <section className="space-y-6 pt-8 border-t border-charcoal-200/80">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-brand-100 border border-brand-300 text-brand-900 flex items-center justify-center shadow-xs">
          <Laptop className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-charcoal-950 tracking-tight">
            Similar Laptops You May Also Like
          </h2>
          <p className="text-xs text-charcoal-500 font-medium">
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
