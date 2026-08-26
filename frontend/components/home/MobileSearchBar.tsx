'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ArrowRight } from 'lucide-react';

export const MobileSearchBar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/laptops?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      router.push('/laptops');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
      <form
        onSubmit={handleSearch}
        className="relative flex items-center w-full rounded-2xl bg-white border border-charcoal-200 shadow-soft hover:border-brand-500/80 transition-all p-1.5 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-400/30"
      >
        <div className="flex items-center justify-center pl-3.5 pr-2 text-brand-700">
          <Search className="w-5 h-5" />
        </div>

        <input
          id="mobile-search-input"
          name="search"
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search laptops, brands, models..."
          className="flex-1 w-full py-2.5 sm:py-3 bg-transparent text-sm sm:text-base text-charcoal-950 placeholder:text-charcoal-400 focus:outline-none font-medium"
        />

        <button
          type="submit"
          className="inline-flex items-center justify-center px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-brand-500 hover:bg-brand-400 text-charcoal-950 font-bold text-xs sm:text-sm shadow-xs transition-all hover:scale-105 active:scale-95 shrink-0"
        >
          <span>Search</span>
          <ArrowRight className="w-3.5 h-3.5 ml-1 hidden sm:inline" />
        </button>
      </form>
    </div>
  );
};
