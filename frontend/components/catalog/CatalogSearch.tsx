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
  placeholder = 'Search laptops by name, brand, model or processor...',
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
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
        <Search className="w-4 h-4" />
      </div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-3 rounded-xl bg-slate-900/90 border border-slate-800 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all shadow-inner"
      />
      {searchTerm && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search"
          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
