import React, { HTMLAttributes } from 'react';
import { cn } from '@/lib/formatters';

export const Skeleton: React.FC<HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => {
  return (
    <div
      className={cn('animate-pulse rounded-xl bg-charcoal-200/80', className)}
      {...props}
    />
  );
};
