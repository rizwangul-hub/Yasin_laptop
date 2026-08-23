import React, { HTMLAttributes } from 'react';
import { cn } from '@/lib/formatters';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({
  className,
  hover = false,
  children,
  ...props
}) => {
  return (
    <div
      className={cn(
        'rounded-2xl bg-white border border-charcoal-200/90 shadow-soft transition-all duration-300',
        hover && 'hover:border-brand-500/60 hover:shadow-soft-md hover:-translate-y-1',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
