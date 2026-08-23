import React, { HTMLAttributes } from 'react';
import { cn } from '@/lib/formatters';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'danger' | 'warning' | 'info' | 'neutral' | 'brand' | 'accent' | 'dark';
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
    success: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
    danger: 'bg-rose-50 text-rose-700 border border-rose-200',
    warning: 'bg-amber-50 text-amber-900 border border-amber-300 font-semibold',
    info: 'bg-sky-50 text-sky-800 border border-sky-200',
    neutral: 'bg-charcoal-100 text-charcoal-700 border border-charcoal-200',
    brand: 'bg-brand-50 text-charcoal-950 border border-brand-300 font-bold',
    accent: 'bg-purple-50 text-purple-800 border border-purple-200',
    dark: 'bg-charcoal-900 text-white border border-charcoal-800',
  };

  const sizes = {
    sm: 'text-[10px] px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1',
  };

  return (
    <span className={cn(baseStyles, variants[variant], sizes[size], className)} {...props}>
      {children}
    </span>
  );
};
