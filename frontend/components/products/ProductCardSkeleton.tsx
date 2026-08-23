import React from 'react';
import { Card } from '../ui/Card';
import { Skeleton } from '../ui/Skeleton';

export const ProductCardSkeleton: React.FC = () => {
  return (
    <Card className="flex flex-col h-full overflow-hidden bg-white border border-charcoal-200/90 shadow-soft p-0 rounded-3xl">
      <Skeleton className="w-full aspect-[4/3] rounded-none bg-charcoal-100" />
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <Skeleton className="h-3 w-16 bg-charcoal-200" />
            <Skeleton className="h-3 w-12 bg-charcoal-200" />
          </div>
          <Skeleton className="h-4 w-4/5 bg-charcoal-200" />
          <Skeleton className="h-3 w-2/3 bg-charcoal-200" />
          <div className="grid grid-cols-2 gap-1.5 pt-2">
            <Skeleton className="h-6 w-full bg-charcoal-100" />
            <Skeleton className="h-6 w-full bg-charcoal-100" />
            <Skeleton className="h-6 w-full col-span-2 bg-charcoal-100" />
          </div>
        </div>

        <div className="pt-3 border-t border-charcoal-100 space-y-3">
          <Skeleton className="h-6 w-28 bg-charcoal-200" />
          <div className="grid grid-cols-2 gap-2">
            <Skeleton className="h-8 w-full bg-charcoal-100" />
            <Skeleton className="h-8 w-full bg-charcoal-100" />
          </div>
        </div>
      </div>
    </Card>
  );
};
