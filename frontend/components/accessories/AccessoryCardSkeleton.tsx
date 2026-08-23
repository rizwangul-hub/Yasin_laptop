import React from 'react';
import { Card } from '../ui/Card';
import { Skeleton } from '../ui/Skeleton';

export const AccessoryCardSkeleton: React.FC = () => {
  return (
    <Card className="flex flex-col h-full overflow-hidden bg-slate-900/80 border-slate-800 p-0">
      <Skeleton className="w-full aspect-[4/3] rounded-none bg-slate-850" />
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-2/3" />
        </div>
        <div className="pt-3 border-t border-slate-800 space-y-3">
          <Skeleton className="h-6 w-24" />
          <div className="grid grid-cols-2 gap-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        </div>
      </div>
    </Card>
  );
};
