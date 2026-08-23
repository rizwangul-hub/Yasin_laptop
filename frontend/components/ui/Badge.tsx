import React, { HTMLAttributes } from 'react';
import { cn } from '@/lib/formatters';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'danger' | 'warning' | 'info' | 'neutral' | 'brand' | 'accent';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'neutral',
  size = 'md',
  children,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center font-medium rounded-full';

  const variants = {
    success: 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60',
    danger: 'bg-rose-950/80 text-rose-300 border border-rose-800/60',
    warning: 'bg-amber-950/80 text-amber-300 border border-amber-800/60',
    info: 'bg-sky-950/80 text-sky-300 border border-sky-800/60',
    neutral: 'bg-slate-800 text-slate-300 border border-slate-700',
    brand: 'bg-brand-950/80 text-brand-300 border border-brand-800/60',
    accent: 'bg-purple-950/80 text-purple-300 border border-purple-800/60',
  };

  const sizes = {
    sm: 'text-[10px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
  };

  return (
    <span className={cn(baseStyles, variants[variant], sizes[size], className)} {...props}>
      {children}
    </span>
  );
};
