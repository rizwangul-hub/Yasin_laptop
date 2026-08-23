import React, { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/formatters';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'whatsapp';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';
    
    const variants = {
      primary: 'bg-brand-600 hover:bg-brand-500 text-white focus:ring-brand-500 shadow-md shadow-brand-600/20',
      secondary: 'bg-slate-800 hover:bg-slate-700 text-slate-100 focus:ring-slate-600 border border-slate-700',
      outline: 'border border-slate-700 hover:bg-slate-800/60 text-slate-200 focus:ring-slate-500',
      ghost: 'text-slate-300 hover:bg-slate-800/50 hover:text-white',
      whatsapp: 'bg-emerald-600 hover:bg-emerald-500 text-white focus:ring-emerald-500 shadow-md shadow-emerald-600/20',
    };

    const sizes = {
      sm: 'text-xs px-3 py-1.5 gap-1.5',
      md: 'text-sm px-4 py-2 gap-2',
      lg: 'text-base px-6 py-3 gap-2.5',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
