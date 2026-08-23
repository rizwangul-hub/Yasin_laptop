import React from 'react';
import { Card } from '../ui/Card';
import { Skeleton } from '../ui/Skeleton';

export const CategoryCardSkeleton: React.FC = () => {
  return (
    <Card className="p-5 sm:p-6 h-full flex flex-col justify-between space-y-4">
      <div className="space-y-3">
        <Skeleton className="w-10 h-10 rounded-lg" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
      </div>
      <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="w-4 h-4 rounded-full" />
      </div>
    </Card>
  );
};
