import React, { ReactNode } from 'react';
import { PackageOpen } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No laptops found',
  description = 'Try changing your filters or searching for another laptop model.',
  action,
  icon,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-14 text-center rounded-3xl border-2 border-dashed border-charcoal-200 bg-white shadow-soft">
      <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-50 border border-brand-200 text-brand-700 mb-4 shadow-xs">
        {icon || <PackageOpen className="w-7 h-7" />}
      </div>
      <h3 className="text-base sm:text-lg font-bold text-charcoal-950 mb-1.5">{title}</h3>
      <p className="text-xs sm:text-sm text-charcoal-500 max-w-md mb-6 leading-relaxed">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
};
