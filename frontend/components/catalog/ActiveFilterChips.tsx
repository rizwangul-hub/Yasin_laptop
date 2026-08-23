import React from 'react';
import { X, RotateCcw } from 'lucide-react';

export interface ActiveFilter {
  key: string;
  label: string;
  value: string;
}

interface ActiveFilterChipsProps {
  filters: ActiveFilter[];
  onRemove: (key: string, value: string) => void;
  onClearAll: () => void;
}

export const ActiveFilterChips: React.FC<ActiveFilterChipsProps> = ({
  filters,
  onRemove,
  onClearAll,
}) => {
  if (filters.length === 0) return null;

  return (
    <div className="flex items-center gap-2 flex-wrap pt-2">
      <span className="text-xs text-charcoal-500 font-bold mr-1">Active Filters:</span>
      {filters.map((filter, index) => (
        <span
          key={`${filter.key}-${filter.value}-${index}`}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-brand-50 text-charcoal-950 border border-brand-300 shadow-xs"
        >
          <span className="font-bold">{filter.label}</span>
          <button
            type="button"
            onClick={() => onRemove(filter.key, filter.value)}
            aria-label={`Remove ${filter.label}`}
            className="text-charcoal-500 hover:text-charcoal-950 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </span>
      ))}

      <button
        type="button"
        onClick={onClearAll}
        className="inline-flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 font-bold px-2 py-1 transition-colors ml-1"
      >
        <RotateCcw className="w-3 h-3" />
        <span>Clear All</span>
      </button>
    </div>
  );
};
