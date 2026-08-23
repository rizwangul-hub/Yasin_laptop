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
    <div className="w-full bg-white border border-charcoal-200/90 rounded-3xl p-5 shadow-soft space-y-2">
      <div className="flex items-center justify-between pb-3 border-b border-charcoal-200/80">
        <h3 className="text-sm font-black text-charcoal-950 tracking-wide uppercase">Filters</h3>
        <button
          type="button"
          onClick={onClearAll}
          className="text-xs text-rose-600 hover:text-rose-700 flex items-center gap-1 font-bold transition-colors"
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
                className="flex items-center justify-between text-xs text-charcoal-700 hover:text-charcoal-950 cursor-pointer select-none py-1 font-medium"
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                      isChecked
                        ? 'bg-brand-500 border-brand-600 text-charcoal-950'
                        : 'border-charcoal-300 bg-white'
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
                className="flex items-center justify-between text-xs text-charcoal-700 hover:text-charcoal-950 cursor-pointer select-none py-1 font-medium"
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                      isChecked
                        ? 'bg-brand-500 border-brand-600 text-charcoal-950'
                        : 'border-charcoal-300 bg-white'
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
        <div className="space-y-1.5 text-xs font-medium">
          <button
            type="button"
            onClick={() => handlePriceRangeSelect(0, 30000)}
            className="w-full text-left py-1 text-charcoal-600 hover:text-brand-800"
          >
            Under Rs. 30,000
          </button>
          <button
            type="button"
            onClick={() => handlePriceRangeSelect(30000, 50000)}
            className="w-full text-left py-1 text-charcoal-600 hover:text-brand-800"
          >
            Rs. 30,000 – Rs. 50,000
          </button>
          <button
            type="button"
            onClick={() => handlePriceRangeSelect(50000, 75000)}
            className="w-full text-left py-1 text-charcoal-600 hover:text-brand-800"
          >
            Rs. 50,000 – Rs. 75,000
          </button>
          <button
            type="button"
            onClick={() => handlePriceRangeSelect(75000, 100000)}
            className="w-full text-left py-1 text-charcoal-600 hover:text-brand-800"
          >
            Rs. 75,000 – Rs. 100,000
          </button>
          <button
            type="button"
            onClick={() => handlePriceRangeSelect(100000, 9999999)}
            className="w-full text-left py-1 text-charcoal-600 hover:text-brand-800"
          >
            Above Rs. 100,000
          </button>

          {/* Custom Price Range Form */}
          <form onSubmit={handleApplyCustomPrice} className="pt-2 border-t border-charcoal-200/80 space-y-2">
            <span className="text-[11px] text-charcoal-500 block font-bold">Custom Range:</span>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Min"
                value={customMin}
                onChange={(e) => setCustomMin(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-xl bg-charcoal-50 border border-charcoal-200 text-xs text-charcoal-950 placeholder:text-charcoal-400 focus:outline-none focus:border-brand-500"
              />
              <input
                type="number"
                placeholder="Max"
                value={customMax}
                onChange={(e) => setCustomMax(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-xl bg-charcoal-50 border border-charcoal-200 text-xs text-charcoal-950 placeholder:text-charcoal-400 focus:outline-none focus:border-brand-500"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 rounded-xl bg-charcoal-900 hover:bg-charcoal-800 text-white text-xs font-bold transition-colors"
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
                className="flex items-center justify-between text-xs text-charcoal-700 hover:text-charcoal-950 cursor-pointer select-none py-1 font-medium"
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                      isChecked
                        ? 'bg-brand-500 border-brand-600 text-charcoal-950'
                        : 'border-charcoal-300 bg-white'
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
                className={`px-2 py-1.5 rounded-xl text-xs font-bold border text-center transition-all ${
                  isChecked
                    ? 'bg-brand-500 text-charcoal-950 border-brand-600 shadow-xs'
                    : 'bg-charcoal-50 text-charcoal-700 border-charcoal-200 hover:border-charcoal-300'
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
                className={`px-2 py-1.5 rounded-xl text-xs font-bold border text-center transition-all ${
                  isChecked
                    ? 'bg-brand-500 text-charcoal-950 border-brand-600 shadow-xs'
                    : 'bg-charcoal-50 text-charcoal-700 border-charcoal-200 hover:border-charcoal-300'
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
                className={`px-2 py-1.5 rounded-xl text-xs font-bold border text-center transition-all ${
                  isChecked
                    ? 'bg-brand-500 text-charcoal-950 border-brand-600 shadow-xs'
                    : 'bg-charcoal-50 text-charcoal-700 border-charcoal-200 hover:border-charcoal-300'
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
                className="flex items-center justify-between text-xs text-charcoal-700 hover:text-charcoal-950 cursor-pointer select-none py-1 font-medium"
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                      isChecked
                        ? 'bg-brand-500 border-brand-600 text-charcoal-950'
                        : 'border-charcoal-300 bg-white'
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
        <div className="space-y-1.5 text-xs font-medium">
          <label className="flex items-center gap-2 text-charcoal-700 hover:text-charcoal-950 cursor-pointer select-none">
            <input
              type="radio"
              name="stockStatus"
              checked={!selectedFilters.stockStatus}
              onChange={() => onFilterChange({ ...selectedFilters, stockStatus: undefined })}
              className="accent-brand-600"
            />
            <span>All Units</span>
          </label>
          <label className="flex items-center gap-2 text-charcoal-700 hover:text-charcoal-950 cursor-pointer select-none">
            <input
              type="radio"
              name="stockStatus"
              checked={selectedFilters.stockStatus === 'available'}
              onChange={() => onFilterChange({ ...selectedFilters, stockStatus: 'available' })}
              className="accent-brand-600"
            />
            <span>In Stock Only</span>
          </label>
          <label className="flex items-center gap-2 text-charcoal-700 hover:text-charcoal-950 cursor-pointer select-none">
            <input
              type="radio"
              name="stockStatus"
              checked={selectedFilters.stockStatus === 'sold_out'}
              onChange={() => onFilterChange({ ...selectedFilters, stockStatus: 'sold_out' })}
              className="accent-brand-600"
            />
            <span>Sold Out Only</span>
          </label>
        </div>
      </FilterGroup>
    </div>
  );
};
