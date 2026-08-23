'use client';

import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

interface CatalogSearchProps {
  initialValue?: string;
  onSearch: (value: string) => void;
  placeholder?: string;
}

export const CatalogSearch: React.FC<CatalogSearchProps> = ({
  initialValue = '',
  onSearch,
  placeholder = 'What laptop are you looking for? (e.g. HP EliteBook, Core i5, ThinkPad)',
}) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);

  useEffect(() => {
    setSearchTerm(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchTerm !== initialValue) {
        onSearch(searchTerm.trim());
      }
    }, 400);

    return () => clearTimeout(handler);
  }, [searchTerm, initialValue, onSearch]);

  const handleClear = () => {
    setSearchTerm('');
    onSearch('');
  };

  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-charcoal-400">
        <Search className="w-4 h-4" />
      </div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-3 rounded-2xl bg-white border border-charcoal-200 text-sm text-charcoal-950 placeholder:text-charcoal-400 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-400/30 transition-all shadow-soft"
      />
      {searchTerm && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search"
          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-charcoal-400 hover:text-charcoal-900 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
