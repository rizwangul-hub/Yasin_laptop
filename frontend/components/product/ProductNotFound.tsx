import React from 'react';
import Link from 'next/link';
import { Laptop, ArrowLeft, Search } from 'lucide-react';
import { Button } from '../ui/Button';

export const ProductNotFound: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center bg-warm-bg">
      <div className="max-w-md mx-auto p-8 rounded-3xl bg-white border border-charcoal-200/90 shadow-soft space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-brand-50 border border-brand-200 text-brand-700 flex items-center justify-center mx-auto shadow-xs">
          <Laptop className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-black text-charcoal-950 tracking-tight">
            Laptop Not Found
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-500 leading-relaxed font-medium">
            This laptop unit may have been sold out, updated, or the link may have changed.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link href="/laptops" className="w-full sm:w-auto">
            <Button variant="primary" size="md" className="w-full text-xs font-bold">
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              <span>Browse Laptops</span>
            </Button>
          </Link>

          <Link href="/categories" className="w-full sm:w-auto">
            <Button variant="secondary" size="md" className="w-full text-xs font-bold">
              <Search className="w-4 h-4 mr-1.5" />
              <span>All Categories</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
