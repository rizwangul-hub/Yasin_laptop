'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
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
import { Filter as FilterIcon, Loader2 } from 'lucide-react';

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
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<boolean>(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);

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

  // Fetch catalog data when params change with request cancellation
  const fetchProducts = useCallback(async () => {
    // Abort previous pending fetch to avoid race conditions
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    if (!data) {
      setIsLoading(true);
    } else {
      setIsFetching(true);
    }
    setError(false);

    try {
      const queryPayload = {
        page: currentPage,
        limit: 12,
        search: currentSearch || undefined,
        sort: currentSort,
        productType: defaultProductType,
        brand: currentFilters.brand ? currentFilters.brand.join(',') : undefined,
        category: currentFilters.category ? currentFilters.category.join(',') : undefined,
        useCase: currentFilters.useCase ? currentFilters.useCase.join(',') : undefined,
        processor: currentFilters.processor ? currentFilters.processor.join(',') : undefined,
        generation: currentFilters.generation ? currentFilters.generation.join(',') : undefined,
        ram: currentFilters.ram ? currentFilters.ram.join(',') : undefined,
        storage: currentFilters.storage ? currentFilters.storage.join(',') : undefined,
        condition: currentFilters.condition ? currentFilters.condition.join(',') : undefined,
        stockStatus: currentFilters.stockStatus,
        minPrice: currentFilters.minPrice ? parseInt(currentFilters.minPrice, 10) : undefined,
        maxPrice: currentFilters.maxPrice ? parseInt(currentFilters.maxPrice, 10) : undefined,
      };

      const res = await productService.getProducts(queryPayload, {
        signal: controller.signal,
      });

      if (res.success && res.data) {
        setData(res.data);
      } else if (res.message !== 'Request canceled') {
        setError(true);
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setError(true);
      }
    } finally {
      setIsLoading(false);
      setIsFetching(false);
    }
  }, [currentPage, currentSearch, currentSort, defaultProductType, currentFilters, data]);

  useEffect(() => {
    fetchProducts();
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, currentSearch, currentSort, defaultProductType, currentFilters]);

  // Handler for sidebar filter changes
  const handleFilterChange = (newFilters: FilterState) => {
    updateUrlParams({
      page: '1',
      brand: newFilters.brand?.join(','),
      category: newFilters.category?.join(','),
      useCase: newFilters.useCase?.join(','),
      processor: newFilters.processor?.join(','),
      generation: newFilters.generation?.join(','),
      ram: newFilters.ram?.join(','),
      storage: newFilters.storage?.join(','),
      condition: newFilters.condition?.join(','),
      stockStatus: newFilters.stockStatus,
      minPrice: newFilters.minPrice,
      maxPrice: newFilters.maxPrice,
    });
  };

  // Handler to clear all filters
  const handleClearAllFilters = () => {
    updateUrlParams({
      page: '1',
      brand: fixedBrand ? fixedBrand : null,
      category: fixedCategory ? fixedCategory : null,
      useCase: null,
      processor: null,
      generation: null,
      ram: null,
      storage: null,
      condition: null,
      stockStatus: null,
      minPrice: null,
      maxPrice: null,
      search: null,
    });
  };

  // Handler to remove a single filter chip
  const handleRemoveSingleFilter = (key: string, value?: string) => {
    if (key === 'search') {
      updateUrlParams({ search: null, page: '1' });
    } else if (key === 'stockStatus') {
      updateUrlParams({ stockStatus: null, page: '1' });
    } else if (key === 'minPrice' || key === 'maxPrice') {
      updateUrlParams({ minPrice: null, maxPrice: null, page: '1' });
    } else {
      const currentList = currentFilters[key as keyof FilterState] as string[] | undefined;
      if (currentList) {
        const nextList = currentList.filter((item) => item !== value);
        updateUrlParams({
          [key]: nextList.length > 0 ? nextList.join(',') : null,
          page: '1',
        });
      }
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
        label: currentFilters.stockStatus === 'available' ? 'In Stock Only' : 'Sold Out',
        value: currentFilters.stockStatus,
      });
    }

    if (currentFilters.minPrice && currentFilters.maxPrice) {
      chips.push({
        key: 'minPrice',
        label: `PKR ${currentFilters.minPrice} - ${currentFilters.maxPrice}`,
        value: `${currentFilters.minPrice}-${currentFilters.maxPrice}`,
      });
    } else if (currentFilters.minPrice) {
      chips.push({
        key: 'minPrice',
        label: `Min PKR ${currentFilters.minPrice}`,
        value: currentFilters.minPrice,
      });
    } else if (currentFilters.maxPrice) {
      chips.push({
        key: 'maxPrice',
        label: `Under PKR ${currentFilters.maxPrice}`,
        value: currentFilters.maxPrice,
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6 sm:space-y-8 bg-warm-bg">
      {/* 1. BREADCRUMBS */}
      <Breadcrumbs items={breadcrumbs} />

      {/* 2. CATALOG HEADER */}
      <div className="space-y-1 sm:space-y-2">
        <h1 className="text-2xl sm:text-4xl font-black text-charcoal-950 tracking-tight">
          {title}
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-600 max-w-2xl font-medium">
          {subtitle}
        </p>
      </div>

      {/* 3. SEARCH & CONTROLS TOOLBAR */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 items-center">
        <div className="md:col-span-8 lg:col-span-9">
          <CatalogSearch
            initialValue={currentSearch}
            onSearch={(value) => updateUrlParams({ search: value, page: '1' })}
          />
        </div>

        <div className="flex items-center justify-between md:justify-end gap-2.5 md:col-span-4 lg:col-span-3">
          {/* Mobile Filter Button */}
          <button
            type="button"
            onClick={() => setIsMobileFilterOpen(true)}
            className="flex lg:hidden items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-charcoal-200 text-xs font-bold text-charcoal-900 hover:bg-charcoal-50 transition-colors shadow-soft"
          >
            <FilterIcon className="w-4 h-4 text-brand-700" />
            <span>Filters</span>
            {activeChips.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-brand-500 text-charcoal-950 text-[10px] flex items-center justify-center font-bold">
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
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8 pt-1 items-start">
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
          {/* Results Count Bar & Fetch Indicator */}
          <div className="flex items-center justify-between text-xs text-charcoal-500 font-medium px-1">
            <span>
              Showing <strong className="text-charcoal-950 font-bold">{data?.items.length || 0}</strong> of{' '}
              <strong className="text-charcoal-950 font-bold">{totalCount}</strong> laptops
            </span>
            {isFetching && (
              <span className="inline-flex items-center gap-1.5 text-xs text-brand-700 font-bold animate-pulse">
                <Loader2 className="w-3 h-3 animate-spin" />
                <span>Updating results...</span>
              </span>
            )}
          </div>

          {/* 2-Column Mobile / Multi-column Desktop Product Grid */}
          {isLoading && (!data || data.items.length === 0) ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-2.5 sm:gap-5">
              {[...Array(6)].map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : error && (!data || data.items.length === 0) ? (
            <CatalogErrorState onRetry={fetchProducts} />
          ) : data && data.items.length > 0 ? (
            <>
              <div
                className={`grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-2.5 sm:gap-5 transition-opacity duration-150 ${
                  isFetching ? 'opacity-65' : 'opacity-100'
                }`}
              >
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
