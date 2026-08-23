'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Breadcrumbs, BreadcrumbItem } from './Breadcrumbs';
import { CatalogSearch } from './CatalogSearch';
import { SortDropdown } from './SortDropdown';
import { FilterSidebar, FilterState } from './FilterSidebar';
import { MobileFilterDrawer } from './MobileFilterDrawer';
import { ActiveFilterChips, ActiveFilter } from './ActiveFilterChips';
import { Pagination } from './Pagination';
import { CatalogEmptyState } from './CatalogEmptyState';
import { CatalogErrorState } from './CatalogErrorState';
import { ProductCard } from '../products/ProductCard';
import { ProductCardSkeleton } from '../products/ProductCardSkeleton';
import { productService, IFilterMetadata } from '@/services/productService';
import { IProduct, PaginatedResponse } from '@/types';
import { Filter as FilterIcon, Sparkles } from 'lucide-react';
import { formatPrice } from '@/lib/formatters';

interface ProductCatalogProps {
  title: string;
  subtitle: string;
  breadcrumbs: BreadcrumbItem[];
  defaultProductType?: 'laptop' | 'chromebook' | 'accessory';
  fixedCategory?: string;
  fixedBrand?: string;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  title,
  subtitle,
  breadcrumbs,
  defaultProductType = 'laptop',
  fixedCategory,
  fixedBrand,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // State
  const [data, setData] = useState<PaginatedResponse<IProduct> | null>(null);
  const [filterMeta, setFilterMeta] = useState<IFilterMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<boolean>(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Extract filters from URL query parameters
  const currentFilters = useMemo((): FilterState => {
    return {
      brand: searchParams.get('brand') ? searchParams.get('brand')!.split(',') : fixedBrand ? [fixedBrand] : undefined,
      category: searchParams.get('category') ? searchParams.get('category')!.split(',') : fixedCategory ? [fixedCategory] : undefined,
      useCase: searchParams.get('useCase') ? searchParams.get('useCase')!.split(',') : undefined,
      processor: searchParams.get('processor') ? searchParams.get('processor')!.split(',') : undefined,
      generation: searchParams.get('generation') ? searchParams.get('generation')!.split(',') : undefined,
      ram: searchParams.get('ram') ? searchParams.get('ram')!.split(',') : undefined,
      storage: searchParams.get('storage') ? searchParams.get('storage')!.split(',') : undefined,
      condition: searchParams.get('condition') ? searchParams.get('condition')!.split(',') : undefined,
      stockStatus: searchParams.get('stockStatus') || undefined,
      minPrice: searchParams.get('minPrice') || undefined,
      maxPrice: searchParams.get('maxPrice') || undefined,
    };
  }, [searchParams, fixedBrand, fixedCategory]);

  const currentSearch = searchParams.get('search') || '';
  const currentSort = searchParams.get('sort') || 'featured';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  // Fetch filter metadata once
  useEffect(() => {
    let isMounted = true;
    productService.getFilters(defaultProductType).then((res) => {
      if (isMounted && res.data) {
        setFilterMeta(res.data);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [defaultProductType]);

  // Sync state with URL helper
  const updateUrlParams = useCallback(
    (updates: Record<string, string | null | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === undefined || value === '') {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });

      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  // Load products whenever query parameters change
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(false);

    const query: Record<string, string | number | boolean | undefined> = {
      productType: defaultProductType,
      page: currentPage,
      limit: 12,
      sort: currentSort,
      search: currentSearch || undefined,
      brand: currentFilters.brand?.join(','),
      category: currentFilters.category?.join(','),
      useCase: currentFilters.useCase?.join(','),
      processor: currentFilters.processor?.join(','),
      generation: currentFilters.generation?.join(','),
      ram: currentFilters.ram?.join(','),
      storage: currentFilters.storage?.join(','),
      condition: currentFilters.condition?.join(','),
      stockStatus: currentFilters.stockStatus,
      minPrice: currentFilters.minPrice,
      maxPrice: currentFilters.maxPrice,
    };

    try {
      const res = await productService.getProducts(query);
      if (res.success && res.data) {
        setData(res.data);
      } else {
        setData({
          items: [],
          pagination: {
            page: 1,
            limit: 12,
            total: 0,
            totalPages: 0,
            hasNextPage: false,
            hasPreviousPage: false,
          },
        });
      }
    } catch (err) {
      setError(true);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, currentSort, currentSearch, currentFilters, defaultProductType]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Handle filter changes
  const handleFilterChange = (newFilters: FilterState) => {
    const updates: Record<string, string | null> = {
      page: '1', // Reset to page 1 on filter changes
      brand: newFilters.brand?.join(',') || null,
      category: newFilters.category?.join(',') || null,
      useCase: newFilters.useCase?.join(',') || null,
      processor: newFilters.processor?.join(',') || null,
      generation: newFilters.generation?.join(',') || null,
      ram: newFilters.ram?.join(',') || null,
      storage: newFilters.storage?.join(',') || null,
      condition: newFilters.condition?.join(',') || null,
      stockStatus: newFilters.stockStatus || null,
      minPrice: newFilters.minPrice || null,
      maxPrice: newFilters.maxPrice || null,
    };
    updateUrlParams(updates);
  };

  const handleClearAllFilters = () => {
    const updates: Record<string, string | null> = {
      page: '1',
      search: null,
      brand: null,
      category: null,
      useCase: null,
      processor: null,
      generation: null,
      ram: null,
      storage: null,
      condition: null,
      stockStatus: null,
      minPrice: null,
      maxPrice: null,
      sort: 'featured',
    };
    updateUrlParams(updates);
  };

  const handleRemoveSingleFilter = (key: string, value: string) => {
    const currentVal = currentFilters[key as keyof FilterState];
    if (Array.isArray(currentVal)) {
      const updated = currentVal.filter((v) => v !== value);
      updateUrlParams({
        page: '1',
        [key]: updated.length > 0 ? updated.join(',') : null,
      });
    } else {
      updateUrlParams({
        page: '1',
        [key]: null,
      });
    }
  };

  // Build active filter chips list
  const activeChips = useMemo((): ActiveFilter[] => {
    const chips: ActiveFilter[] = [];

    currentFilters.brand?.forEach((b) => chips.push({ key: 'brand', label: `Brand: ${b.toUpperCase()}`, value: b }));
    currentFilters.category?.forEach((c) => chips.push({ key: 'category', label: `Category: ${c}`, value: c }));
    currentFilters.useCase?.forEach((u) => chips.push({ key: 'useCase', label: `Use: ${u}`, value: u }));
    currentFilters.processor?.forEach((p) => chips.push({ key: 'processor', label: p, value: p }));
    currentFilters.generation?.forEach((g) => chips.push({ key: 'generation', label: g, value: g }));
    currentFilters.ram?.forEach((r) => chips.push({ key: 'ram', label: `RAM: ${r}`, value: r }));
    currentFilters.storage?.forEach((s) => chips.push({ key: 'storage', label: `Storage: ${s}`, value: s }));
    currentFilters.condition?.forEach((c) => chips.push({ key: 'condition', label: `Condition: ${c}`, value: c }));

    if (currentFilters.stockStatus) {
      chips.push({
        key: 'stockStatus',
        label: currentFilters.stockStatus === 'available' ? 'In Stock' : 'Sold Out',
        value: currentFilters.stockStatus,
      });
    }

    if (currentFilters.minPrice || currentFilters.maxPrice) {
      const min = currentFilters.minPrice ? formatPrice(Number(currentFilters.minPrice)) : 'Rs. 0';
      const max = currentFilters.maxPrice ? formatPrice(Number(currentFilters.maxPrice)) : 'Above';
      chips.push({
        key: 'minPrice',
        label: `Price: ${min} – ${max}`,
        value: 'price',
      });
    }

    if (currentSearch) {
      chips.push({
        key: 'search',
        label: `Search: "${currentSearch}"`,
        value: currentSearch,
      });
    }

    return chips;
  }, [currentFilters, currentSearch]);

  const hasAnyFilter = activeChips.length > 0;
  const totalCount = data?.pagination.total || 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6">
      {/* 1. BREADCRUMBS */}
      <Breadcrumbs items={breadcrumbs} />

      {/* 2. CATALOG HEADER */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-brand-400 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Catalog Explorer</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          {title}
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
          {subtitle}
        </p>
      </div>

      {/* 3. SEARCH & CONTROLS TOOLBAR */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pt-2">
        <div className="flex-1 max-w-xl">
          <CatalogSearch
            initialValue={currentSearch}
            onSearch={(value) => updateUrlParams({ page: '1', search: value || null })}
          />
        </div>

        <div className="flex items-center justify-between md:justify-end gap-3">
          {/* Mobile Filter Button */}
          <button
            type="button"
            onClick={() => setIsMobileFilterOpen(true)}
            className="flex lg:hidden items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-200 hover:bg-slate-850 transition-colors shadow-sm"
          >
            <FilterIcon className="w-4 h-4 text-brand-400" />
            <span>Filters</span>
            {activeChips.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-brand-600 text-white text-[10px] flex items-center justify-center font-bold">
                {activeChips.length}
              </span>
            )}
          </button>

          {/* Sort Dropdown */}
          <SortDropdown
            value={currentSort}
            onChange={(value) => updateUrlParams({ sort: value })}
          />
        </div>
      </div>

      {/* 4. ACTIVE FILTER CHIPS */}
      <ActiveFilterChips
        filters={activeChips}
        onRemove={handleRemoveSingleFilter}
        onClearAll={handleClearAllFilters}
      />

      {/* 5. MAIN CONTENT GRID (SIDEBAR + PRODUCTS) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pt-2 items-start">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block lg:col-span-1 sticky top-24">
          <FilterSidebar
            metadata={filterMeta}
            selectedFilters={currentFilters}
            onFilterChange={handleFilterChange}
            onClearAll={handleClearAllFilters}
          />
        </aside>

        {/* Product Results */}
        <div className="lg:col-span-3 space-y-6">
          {/* Results Count Bar */}
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>
              Showing <strong className="text-white">{data?.items.length || 0}</strong> of{' '}
              <strong className="text-white">{totalCount}</strong> laptops
            </span>
          </div>

          {/* Loading Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : error ? (
            <CatalogErrorState onRetry={fetchProducts} />
          ) : data && data.items.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {data.items.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={data.pagination.totalPages}
                onPageChange={(page) => updateUrlParams({ page: String(page) })}
              />
            </>
          ) : (
            <CatalogEmptyState
              hasFilters={hasAnyFilter}
              onClearFilters={handleClearAllFilters}
            />
          )}
        </div>
      </div>

      {/* 6. MOBILE FILTER DRAWER */}
      <MobileFilterDrawer
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        metadata={filterMeta}
        selectedFilters={currentFilters}
        onApplyFilters={handleFilterChange}
        onClearAll={handleClearAllFilters}
        activeCount={activeChips.length}
      />
    </div>
  );
};
