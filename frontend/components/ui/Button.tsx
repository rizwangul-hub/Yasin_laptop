import React, { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/formatters';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'whatsapp' | 'danger' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

    const variants = {
      primary:
        'bg-brand-500 hover:bg-brand-400 text-charcoal-950 font-bold focus:ring-brand-500 shadow-sm hover:shadow border border-brand-500 hover:border-brand-400',
      secondary:
        'bg-white hover:bg-charcoal-100 text-charcoal-800 focus:ring-charcoal-400 border border-charcoal-200 shadow-sm hover:border-charcoal-300',
      outline:
        'border border-charcoal-300 hover:bg-charcoal-100 text-charcoal-800 focus:ring-charcoal-500',
      ghost:
        'text-charcoal-600 hover:text-charcoal-900 hover:bg-charcoal-100/70',
      whatsapp:
        'bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold focus:ring-[#25D366] shadow-sm shadow-[#25D366]/20',
      danger:
        'bg-rose-600 hover:bg-rose-500 text-white focus:ring-rose-500 shadow-sm',
      dark:
        'bg-charcoal-900 hover:bg-charcoal-800 text-white font-medium focus:ring-charcoal-700 shadow-sm',
    };

    const sizes = {
      sm: 'text-xs px-3.5 py-2 gap-1.5 rounded-lg',
      md: 'text-sm px-5 py-2.5 gap-2 rounded-xl',
      lg: 'text-base px-6 py-3.5 gap-2.5 rounded-xl font-semibold',
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
