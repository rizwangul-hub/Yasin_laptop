import React from 'react';
import { ArrowDownUp } from 'lucide-react';

interface SortDropdownProps {
  value?: string;
  onChange: (value: string) => void;
}

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured First' },
  { value: 'newest', label: 'Newest Arrivals' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'best_deal', label: 'Best Deals First' },
  { value: 'name_asc', label: 'Name: A to Z' },
  { value: 'name_desc', label: 'Name: Z to A' },
];

export const SortDropdown: React.FC<SortDropdownProps> = ({ value = 'featured', onChange }) => {
  return (
    <div className="flex items-center gap-2">
      <div className="hidden sm:flex items-center gap-1.5 text-xs text-charcoal-500 font-medium">
        <ArrowDownUp className="w-3.5 h-3.5 text-brand-600" />
        <span>Sort:</span>
      </div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-3.5 py-2.5 rounded-xl bg-white border border-charcoal-200 text-xs font-bold text-charcoal-900 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-400/30 cursor-pointer shadow-soft"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-white text-charcoal-900 font-medium">
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};
