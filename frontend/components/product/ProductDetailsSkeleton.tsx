import React from 'react';
import { Skeleton } from '../ui/Skeleton';

export const ProductDetailsSkeleton: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12 bg-warm-bg">
      {/* Breadcrumb skeleton */}
      <Skeleton className="h-4 w-48 bg-charcoal-200" />

      {/* Main 2-column skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left gallery */}
        <div className="lg:col-span-7 space-y-4">
          <Skeleton className="w-full aspect-[4/3] rounded-3xl bg-white border border-charcoal-200" />
          <div className="flex gap-3">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="w-20 h-20 rounded-2xl shrink-0 bg-white border border-charcoal-200" />
            ))}
          </div>
        </div>

        {/* Right info */}
        <div className="lg:col-span-5 space-y-6">
          <div className="flex gap-2">
            <Skeleton className="h-6 w-20 rounded-lg bg-charcoal-200" />
            <Skeleton className="h-6 w-28 rounded-lg bg-charcoal-200" />
          </div>
          <Skeleton className="h-10 w-4/5 bg-charcoal-200" />
          <Skeleton className="h-4 w-full bg-charcoal-200" />
          <Skeleton className="h-28 w-full rounded-3xl bg-white border border-charcoal-200" />
          <Skeleton className="h-14 w-full rounded-2xl bg-white border border-charcoal-200" />
          <div className="grid grid-cols-2 gap-3">
            <Skeleton className="h-12 w-full rounded-xl bg-charcoal-200" />
            <Skeleton className="h-12 w-full rounded-xl bg-charcoal-200" />
          </div>
        </div>
      </div>

      {/* Specs skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-48 rounded-3xl bg-white border border-charcoal-200" />
        ))}
      </div>
    </div>
  );
};
