import React from 'react';
import { Laptop, RotateCcw } from 'lucide-react';
import { Button } from '../ui/Button';

interface CatalogEmptyStateProps {
  hasFilters: boolean;
  onClearFilters: () => void;
}

export const CatalogEmptyState: React.FC<CatalogEmptyStateProps> = ({
  hasFilters,
  onClearFilters,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-14 text-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 space-y-4">
      <div className="w-14 h-14 rounded-2xl bg-slate-800/80 text-slate-400 flex items-center justify-center">
        <Laptop className="w-7 h-7" />
      </div>
      <div className="space-y-1 max-w-sm">
        <h3 className="text-base sm:text-lg font-bold text-slate-100">
          {hasFilters ? 'No laptops match your criteria' : 'Catalog Inventory Loading'}
        </h3>
        <p className="text-xs sm:text-sm text-slate-400">
          {hasFilters
            ? 'Try adjusting your search terms, removing some specifications, or widening your price range.'
            : 'Verified laptops will populate as inventory is cataloged.'}
        </p>
      </div>

      {hasFilters && (
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={onClearFilters}
          className="text-xs"
        >
          <RotateCcw className="w-3.5 h-3.5 mr-1" />
          <span>Reset All Filters</span>
        </Button>
      )}
    </div>
  );
};
