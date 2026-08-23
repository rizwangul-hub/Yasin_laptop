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
        'rounded-xl bg-slate-900/70 border border-slate-800 backdrop-blur-sm transition-all duration-300',
        hover && 'hover:border-slate-700 hover:shadow-xl hover:shadow-black/40 hover:-translate-y-1',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
