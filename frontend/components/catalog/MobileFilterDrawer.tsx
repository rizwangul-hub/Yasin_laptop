'use client';

import React, { useState, useEffect } from 'react';
import { X, Filter, RotateCcw } from 'lucide-react';
import { FilterSidebar, FilterState } from './FilterSidebar';
import { IFilterMetadata } from '@/services/productService';
import { Button } from '../ui/Button';

interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  metadata?: IFilterMetadata | null;
  selectedFilters: FilterState;
  onApplyFilters: (newFilters: FilterState) => void;
  onClearAll: () => void;
  activeCount: number;
}

export const MobileFilterDrawer: React.FC<MobileFilterDrawerProps> = ({
  isOpen,
  onClose,
  metadata,
  selectedFilters,
  onApplyFilters,
  onClearAll,
  activeCount,
}) => {
  const [tempFilters, setTempFilters] = useState<FilterState>(selectedFilters);

  useEffect(() => {
    setTempFilters(selectedFilters);
  }, [selectedFilters, isOpen]);

  // Lock background scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleApply = () => {
    onApplyFilters(tempFilters);
    onClose();
  };

  const handleClear = () => {
    setTempFilters({});
    onClearAll();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end lg:hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer Container */}
      <div className="relative z-10 w-full max-h-[85vh] bg-white border-t border-charcoal-200 rounded-t-3xl flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300">
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-charcoal-200 bg-charcoal-50/80">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-brand-600" />
            <h3 className="text-base font-black text-charcoal-950">Filter Catalog</h3>
            {activeCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-brand-500 text-charcoal-950 text-xs flex items-center justify-center font-bold">
                {activeCount}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close filters"
            className="p-1.5 rounded-lg text-charcoal-500 hover:text-charcoal-950 hover:bg-charcoal-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-4 bg-white">
          <FilterSidebar
            metadata={metadata}
            selectedFilters={tempFilters}
            onFilterChange={setTempFilters}
            onClearAll={() => setTempFilters({})}
          />
        </div>

        {/* Drawer Bottom Actions */}
        <div className="p-4 border-t border-charcoal-200 bg-charcoal-50/90 grid grid-cols-2 gap-3">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={handleClear}
            className="text-xs font-bold"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" />
            <span>Reset All</span>
          </Button>

          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={handleApply}
            className="text-xs font-bold"
          >
            <span>Apply Filters</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
