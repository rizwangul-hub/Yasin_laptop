'use client';

import React, { useState } from 'react';
import { FilterGroup } from './FilterGroup';
import { IFilterMetadata } from '@/services/productService';
import { formatPrice } from '@/lib/formatters';
import { RotateCcw, Check } from 'lucide-react';

export interface FilterState {
  brand?: string[];
  category?: string[];
  useCase?: string[];
  processor?: string[];
  generation?: string[];
  ram?: string[];
  storage?: string[];
  condition?: string[];
  stockStatus?: string;
  minPrice?: string;
  maxPrice?: string;
}

interface FilterSidebarProps {
  metadata?: IFilterMetadata | null;
  selectedFilters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  onClearAll: () => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  metadata,
  selectedFilters,
  onFilterChange,
  onClearAll,
}) => {
  const [customMin, setCustomMin] = useState(selectedFilters.minPrice || '');
  const [customMax, setCustomMax] = useState(selectedFilters.maxPrice || '');

  const toggleMultiSelect = (key: keyof FilterState, value: string) => {
    const currentList = (selectedFilters[key] as string[]) || [];
    const isSelected = currentList.includes(value);

    let updatedList: string[];
    if (isSelected) {
      updatedList = currentList.filter((item) => item !== value);
    } else {
      updatedList = [...currentList, value];
    }

    onFilterChange({
      ...selectedFilters,
      [key]: updatedList.length > 0 ? updatedList : undefined,
    });
  };

  const handlePriceRangeSelect = (min: number, max: number) => {
    onFilterChange({
      ...selectedFilters,
      minPrice: min > 0 ? String(min) : undefined,
      maxPrice: max < 9000000 ? String(max) : undefined,
    });
    setCustomMin(min > 0 ? String(min) : '');
    setCustomMax(max < 9000000 ? String(max) : '');
  };

  const handleApplyCustomPrice = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange({
      ...selectedFilters,
      minPrice: customMin ? customMin : undefined,
      maxPrice: customMax ? customMax : undefined,
    });
  };

  const brands = metadata?.brands || [
    { name: 'HP', slug: 'hp' },
    { name: 'Dell', slug: 'dell' },
    { name: 'Lenovo', slug: 'lenovo' },
    { name: 'Apple', slug: 'apple' },
    { name: 'ASUS', slug: 'asus' },
    { name: 'Acer', slug: 'acer' },
  ];

  const categories = metadata?.categories || [
    { name: 'Business Laptops', slug: 'business-laptops' },
    { name: 'Student Laptops', slug: 'student-laptops' },
    { name: 'Programming & Dev', slug: 'programming-laptops' },
    { name: 'Chromebooks', slug: 'chromebooks' },
    { name: 'High Performance', slug: 'high-performance' },
    { name: 'Accessories', slug: 'accessories' },
  ];

  const useCases = metadata?.useCases || [
    { name: 'Business', slug: 'business' },
    { name: 'Student', slug: 'student' },
    { name: 'Programming', slug: 'programming' },
    { name: 'Gaming', slug: 'gaming' },
    { name: 'Freelancing', slug: 'freelancing' },
  ];

  const processors = metadata?.processors || [
    'Intel Core i3',
    'Intel Core i5',
    'Intel Core i7',
    'Intel Core i9',
    'AMD Ryzen 5',
    'AMD Ryzen 7',
    'Apple M1',
    'Apple M2',
  ];

  const generations = metadata?.generations || [
    '8th Gen',
    '9th Gen',
    '10th Gen',
    '11th Gen',
    '12th Gen',
    '13th Gen',
  ];

  const ramOptions = metadata?.ramOptions || ['4GB', '8GB', '16GB', '32GB', '64GB'];
  const storageOptions = metadata?.storageOptions || ['128GB', '256GB', '512GB', '1TB'];
  const conditions = metadata?.conditions || ['new', 'like-new', 'excellent', 'very-good', 'good', 'fair'];

  return (
    <div className="w-full bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-2">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <h3 className="text-sm font-bold text-white tracking-wide">Filters</h3>
        <button
          type="button"
          onClick={onClearAll}
          className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 font-medium transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Clear All</span>
        </button>
      </div>

      {/* 1. BRAND FILTER */}
      <FilterGroup title="Brand" count={selectedFilters.brand?.length}>
        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
          {brands.map((b) => {
            const isChecked = selectedFilters.brand?.includes(b.slug);
            return (
              <label
                key={b.slug}
                className="flex items-center justify-between text-xs text-slate-300 hover:text-white cursor-pointer select-none py-1"
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                      isChecked ? 'bg-brand-600 border-brand-500 text-white' : 'border-slate-700 bg-slate-950'
                    }`}
                  >
                    {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span>{b.name}</span>
                </div>
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={isChecked}
                  onChange={() => toggleMultiSelect('brand', b.slug)}
                />
              </label>
            );
          })}
        </div>
      </FilterGroup>

      {/* 2. CATEGORY FILTER */}
      <FilterGroup title="Category" count={selectedFilters.category?.length}>
        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
          {categories.map((c) => {
            const isChecked = selectedFilters.category?.includes(c.slug);
            return (
              <label
                key={c.slug}
                className="flex items-center justify-between text-xs text-slate-300 hover:text-white cursor-pointer select-none py-1"
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                      isChecked ? 'bg-brand-600 border-brand-500 text-white' : 'border-slate-700 bg-slate-950'
                    }`}
                  >
                    {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span>{c.name}</span>
                </div>
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={isChecked}
                  onChange={() => toggleMultiSelect('category', c.slug)}
                />
              </label>
            );
          })}
        </div>
      </FilterGroup>

      {/* 3. PRICE RANGE FILTER */}
      <FilterGroup title="Price Range (PKR)" defaultOpen={true}>
        <div className="space-y-2 text-xs">
          <button
            type="button"
            onClick={() => handlePriceRangeSelect(0, 30000)}
            className="w-full text-left py-1 text-slate-400 hover:text-brand-300"
          >
            Under Rs. 30,000
          </button>
          <button
            type="button"
            onClick={() => handlePriceRangeSelect(30000, 50000)}
            className="w-full text-left py-1 text-slate-400 hover:text-brand-300"
          >
            Rs. 30,000 – Rs. 50,000
          </button>
          <button
            type="button"
            onClick={() => handlePriceRangeSelect(50000, 75000)}
            className="w-full text-left py-1 text-slate-400 hover:text-brand-300"
          >
            Rs. 50,000 – Rs. 75,000
          </button>
          <button
            type="button"
            onClick={() => handlePriceRangeSelect(75000, 100000)}
            className="w-full text-left py-1 text-slate-400 hover:text-brand-300"
          >
            Rs. 75,000 – Rs. 100,000
          </button>
          <button
            type="button"
            onClick={() => handlePriceRangeSelect(100000, 9999999)}
            className="w-full text-left py-1 text-slate-400 hover:text-brand-300"
          >
            Above Rs. 100,000
          </button>

          {/* Custom Price Range Form */}
          <form onSubmit={handleApplyCustomPrice} className="pt-2 border-t border-slate-800 space-y-2">
            <span className="text-[11px] text-slate-400 block font-medium">Custom Range:</span>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Min"
                value={customMin}
                onChange={(e) => setCustomMin(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-500"
              />
              <input
                type="number"
                placeholder="Max"
                value={customMax}
                onChange={(e) => setCustomMax(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-500"
              />
            </div>
            <button
              type="submit"
              className="w-full py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
            >
              Apply Price
            </button>
          </form>
        </div>
      </FilterGroup>

      {/* 4. PROCESSOR FILTER */}
      <FilterGroup title="Processor" count={selectedFilters.processor?.length} defaultOpen={false}>
        <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
          {processors.map((proc) => {
            const isChecked = selectedFilters.processor?.includes(proc);
            return (
              <label
                key={proc}
                className="flex items-center justify-between text-xs text-slate-300 hover:text-white cursor-pointer select-none py-1"
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                      isChecked ? 'bg-brand-600 border-brand-500 text-white' : 'border-slate-700 bg-slate-950'
                    }`}
                  >
                    {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span>{proc}</span>
                </div>
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={isChecked}
                  onChange={() => toggleMultiSelect('processor', proc)}
                />
              </label>
            );
          })}
        </div>
      </FilterGroup>

      {/* 5. GENERATION FILTER */}
      <FilterGroup title="Generation" count={selectedFilters.generation?.length} defaultOpen={false}>
        <div className="grid grid-cols-2 gap-1.5">
          {generations.map((gen) => {
            const isChecked = selectedFilters.generation?.includes(gen);
            return (
              <button
                key={gen}
                type="button"
                onClick={() => toggleMultiSelect('generation', gen)}
                className={`px-2 py-1.5 rounded-lg text-xs font-medium border text-center transition-all ${
                  isChecked
                    ? 'bg-brand-600 text-white border-brand-500 shadow-sm'
                    : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                {gen}
              </button>
            );
          })}
        </div>
      </FilterGroup>

      {/* 6. RAM FILTER */}
      <FilterGroup title="RAM Capacity" count={selectedFilters.ram?.length} defaultOpen={false}>
        <div className="grid grid-cols-3 gap-1.5">
          {ramOptions.map((ram) => {
            const isChecked = selectedFilters.ram?.includes(ram);
            return (
              <button
                key={ram}
                type="button"
                onClick={() => toggleMultiSelect('ram', ram)}
                className={`px-2 py-1.5 rounded-lg text-xs font-medium border text-center transition-all ${
                  isChecked
                    ? 'bg-brand-600 text-white border-brand-500 shadow-sm'
                    : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                {ram}
              </button>
            );
          })}
        </div>
      </FilterGroup>

      {/* 7. STORAGE FILTER */}
      <FilterGroup title="Storage Capacity" count={selectedFilters.storage?.length} defaultOpen={false}>
        <div className="grid grid-cols-2 gap-1.5">
          {storageOptions.map((st) => {
            const isChecked = selectedFilters.storage?.includes(st);
            return (
              <button
                key={st}
                type="button"
                onClick={() => toggleMultiSelect('storage', st)}
                className={`px-2 py-1.5 rounded-lg text-xs font-medium border text-center transition-all ${
                  isChecked
                    ? 'bg-brand-600 text-white border-brand-500 shadow-sm'
                    : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                {st}
              </button>
            );
          })}
        </div>
      </FilterGroup>

      {/* 8. CONDITION FILTER */}
      <FilterGroup title="Condition" count={selectedFilters.condition?.length} defaultOpen={false}>
        <div className="space-y-1.5">
          {conditions.map((cond) => {
            const isChecked = selectedFilters.condition?.includes(cond);
            return (
              <label
                key={cond}
                className="flex items-center justify-between text-xs text-slate-300 hover:text-white cursor-pointer select-none py-1"
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                      isChecked ? 'bg-brand-600 border-brand-500 text-white' : 'border-slate-700 bg-slate-950'
                    }`}
                  >
                    {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span className="capitalize">{cond.replace('-', ' ')}</span>
                </div>
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={isChecked}
                  onChange={() => toggleMultiSelect('condition', cond)}
                />
              </label>
            );
          })}
        </div>
      </FilterGroup>

      {/* 9. STOCK STATUS FILTER */}
      <FilterGroup title="Stock Availability" defaultOpen={false}>
        <div className="space-y-1.5 text-xs">
          <label className="flex items-center gap-2 text-slate-300 hover:text-white cursor-pointer select-none">
            <input
              type="radio"
              name="stockStatus"
              checked={!selectedFilters.stockStatus}
              onChange={() => onFilterChange({ ...selectedFilters, stockStatus: undefined })}
              className="text-brand-500"
            />
            <span>All Units</span>
          </label>
          <label className="flex items-center gap-2 text-slate-300 hover:text-white cursor-pointer select-none">
            <input
              type="radio"
              name="stockStatus"
              checked={selectedFilters.stockStatus === 'available'}
              onChange={() => onFilterChange({ ...selectedFilters, stockStatus: 'available' })}
              className="text-brand-500"
            />
            <span>In Stock Only</span>
          </label>
          <label className="flex items-center gap-2 text-slate-300 hover:text-white cursor-pointer select-none">
            <input
              type="radio"
              name="stockStatus"
              checked={selectedFilters.stockStatus === 'sold_out'}
              onChange={() => onFilterChange({ ...selectedFilters, stockStatus: 'sold_out' })}
              className="text-brand-500"
            />
            <span>Sold Out Only</span>
          </label>
        </div>
      </FilterGroup>
    </div>
  );
};
