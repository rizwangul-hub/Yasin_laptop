import React from 'react';
import { X, RotateCcw } from 'lucide-react';
import { formatPrice } from '@/lib/formatters';

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
      <span className="text-xs text-slate-400 font-medium mr-1">Active Filters:</span>
      {filters.map((filter, index) => (
        <span
          key={`${filter.key}-${filter.value}-${index}`}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs bg-brand-950/80 text-brand-300 border border-brand-800/60"
        >
          <span className="font-medium">{filter.label}</span>
          <button
            type="button"
            onClick={() => onRemove(filter.key, filter.value)}
            aria-label={`Remove ${filter.label}`}
            className="hover:text-white transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </span>
      ))}

      <button
        type="button"
        onClick={onClearAll}
        className="inline-flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 font-medium px-2 py-1 transition-colors ml-1"
      >
        <RotateCcw className="w-3 h-3" />
        <span>Clear All</span>
      </button>
    </div>
  );
};
