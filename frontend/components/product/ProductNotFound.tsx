import React from 'react';
import Link from 'next/link';
import { Laptop, ArrowLeft, Search } from 'lucide-react';
import { Button } from '../ui/Button';

export const ProductNotFound: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
      <div className="max-w-md mx-auto p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-brand-600/10 border border-brand-500/20 text-brand-400 flex items-center justify-center mx-auto">
          <Laptop className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Laptop Not Found
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            This laptop unit may have been sold, updated, or the link may have expired.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link href="/laptops" className="w-full sm:w-auto">
            <Button variant="primary" size="md" className="w-full text-xs">
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              <span>Browse Laptops</span>
            </Button>
          </Link>

          <Link href="/categories" className="w-full sm:w-auto">
            <Button variant="outline" size="md" className="w-full text-xs">
              <Search className="w-4 h-4 mr-1.5" />
              <span>All Categories</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
