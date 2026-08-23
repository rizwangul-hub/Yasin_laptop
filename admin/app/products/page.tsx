'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { adminApiClient } from '@/lib/api-client';
import {
  Laptop,
  Plus,
  Search,
  Copy,
  Edit,
  Trash2,
  ExternalLink,
  Sparkles,
  Tag,
  Check,
  Loader2,
  RefreshCw,
  CheckSquare,
  Square,
} from 'lucide-react';

interface IAdminProduct {
  _id: string;
  name: string;
  slug: string;
  sku?: string;
  brand?: { name: string };
  productType: string;
  price: number;
  condition: string;
  stockStatus: 'available' | 'sold_out';
  publicationStatus?: 'draft' | 'published' | 'archived';
  featured?: boolean;
  bestDeal?: boolean;
  latestArrival?: boolean;
  images?: Array<{ url: string; isPrimary?: boolean }>;
  createdAt: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<IAdminProduct[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [stockFilter, setStockFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Bulk selection state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBulkExecuting, setIsBulkExecuting] = useState(false);

  // Delete modal state
  const [deleteModalProduct, setDeleteModalProduct] = useState<IAdminProduct | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Inline price edit state
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState<number>(0);

  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: String(page),
        limit: '20',
        ...(searchTerm ? { search: searchTerm } : {}),
        ...(typeFilter ? { productType: typeFilter } : {}),
        ...(stockFilter ? { stockStatus: stockFilter } : {}),
      });

      const res = await adminApiClient<{
        items: IAdminProduct[];
        pagination: { total: number; totalPages: number };
      }>(`/products?${queryParams.toString()}`);

      if (res.success && res.data) {
        const raw = res.data as Record<string, unknown>;
        const items = (
          Array.isArray(raw)
            ? raw
            : Array.isArray(raw.items)
            ? raw.items
            : Array.isArray(raw.products)
            ? raw.products
            : []
        ) as IAdminProduct[];

        const pag = (raw.pagination as { total?: number; totalPages?: number }) || {};
        setProducts(items);
        setTotalCount(pag.total ?? items.length);
        setTotalPages(pag.totalPages ?? (Math.ceil(items.length / 20) || 1));
      }
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  }, [page, searchTerm, typeFilter, stockFilter]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const toggleSelectAll = () => {
    if (selectedIds.length === products.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(products.map((p) => p._id));
    }
  };

  const toggleSelectId = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleToggle = async (productId: string, field: string, currentValue: unknown) => {
    try {
      const updatedValue =
        field === 'stockStatus'
          ? currentValue === 'available'
            ? 'sold_out'
            : 'available'
          : !currentValue;

      const res = await adminApiClient(`/products/${productId}`, {
        method: 'PUT',
        body: JSON.stringify({ [field]: updatedValue }),
      });

      if (res.success) {
        setProducts((prev) =>
          prev.map((p) => (p._id === productId ? { ...p, [field]: updatedValue } : p))
        );
      }
    } catch {
      // Error
    }
  };

  const handleSavePrice = async (productId: string) => {
    if (tempPrice <= 0) return;
    try {
      const res = await adminApiClient(`/products/${productId}`, {
        method: 'PUT',
        body: JSON.stringify({ price: tempPrice }),
      });

      if (res.success) {
        setProducts((prev) =>
          prev.map((p) => (p._id === productId ? { ...p, price: tempPrice } : p))
        );
        setEditingPriceId(null);
      }
    } catch {
      // Error
    }
  };

  const handleDuplicate = async (productId: string) => {
    try {
      const res = await adminApiClient(`/products/${productId}/duplicate`, {
        method: 'POST',
      });
      if (res.success) {
        loadProducts();
      }
    } catch {
      // Error
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModalProduct) return;
    setIsDeleting(true);
    try {
      const res = await adminApiClient(`/products/${deleteModalProduct._id}`, {
        method: 'DELETE',
      });
      if (res.success) {
        setProducts((prev) => prev.filter((p) => p._id !== deleteModalProduct._id));
        setDeleteModalProduct(null);
      }
    } catch {
      // Error
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedIds.length === 0) return;
    setIsBulkExecuting(true);
    try {
      const res = await adminApiClient('/products/bulk', {
        method: 'POST',
        body: JSON.stringify({
          action,
          productIds: selectedIds,
        }),
      });

      if (res.success) {
        setSelectedIds([]);
        loadProducts();
      }
    } catch {
      // Error
    } finally {
      setIsBulkExecuting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-charcoal-950 tracking-tight">
            Inventory &amp; Products
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-500 font-medium">
            Manage laptop catalog, inline prices, stock status, and Cloudinary galleries.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => loadProducts()}
            className="p-2.5 rounded-xl bg-white border border-charcoal-200 text-charcoal-600 hover:text-charcoal-950 transition-colors shadow-xs"
            title="Refresh database records"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <Link
            href="/products/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-charcoal-950 font-bold text-xs shadow-sm transition-all hover:scale-105 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </Link>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="p-4 rounded-3xl bg-white border border-charcoal-200/90 shadow-soft flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            placeholder="Search by title, SKU, or hardware specs..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-charcoal-50 border border-charcoal-200 text-xs text-charcoal-950 focus:outline-none focus:border-brand-500 font-medium"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2.5 rounded-xl bg-charcoal-50 border border-charcoal-200 text-xs font-bold text-charcoal-800 focus:outline-none"
          >
            <option value="">All Types</option>
            <option value="laptop">Laptops</option>
            <option value="chromebook">Chromebooks</option>
            <option value="accessory">Accessories</option>
          </select>

          <select
            value={stockFilter}
            onChange={(e) => {
              setStockFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2.5 rounded-xl bg-charcoal-50 border border-charcoal-200 text-xs font-bold text-charcoal-800 focus:outline-none"
          >
            <option value="">All Stock</option>
            <option value="available">In Stock</option>
            <option value="sold_out">Sold Out</option>
          </select>
        </div>
      </div>

      {/* Bulk Actions Floating Bar */}
      {selectedIds.length > 0 && (
        <div className="p-4 rounded-2xl bg-brand-50 border border-brand-300 flex flex-wrap items-center justify-between gap-3 text-xs shadow-soft animate-in fade-in">
          <div className="flex items-center gap-2 text-brand-900 font-bold">
            <CheckSquare className="w-4 h-4" />
            <span>{selectedIds.length} products selected</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleBulkAction('mark_available')}
              disabled={isBulkExecuting}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-xs"
            >
              Mark In Stock
            </button>

            <button
              onClick={() => handleBulkAction('mark_sold')}
              disabled={isBulkExecuting}
              className="px-3.5 py-1.5 rounded-xl bg-charcoal-800 hover:bg-charcoal-700 text-rose-300 font-bold"
            >
              Mark Sold Out
            </button>

            <button
              onClick={() => handleBulkAction('archive')}
              disabled={isBulkExecuting}
              className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold shadow-xs"
            >
              Bulk Archive
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="rounded-3xl bg-white border border-charcoal-200/90 shadow-soft overflow-hidden">
        {isLoading ? (
          <div className="py-20 text-center text-xs text-charcoal-500 flex items-center justify-center gap-2 font-medium">
            <Loader2 className="w-4 h-4 animate-spin text-brand-600" />
            <span>Loading inventory database records...</span>
          </div>
        ) : products.length > 0 ? (
          <>
            {/* 1. Mobile Cards View (< md) */}
            <div className="block md:hidden divide-y divide-charcoal-100">
              {products.map((p) => {
                const primaryImg = p.images?.find((img) => img.isPrimary) || p.images?.[0];
                return (
                  <div key={p._id} className="p-4 space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-14 h-14 rounded-xl bg-charcoal-50 border border-charcoal-200 flex items-center justify-center shrink-0 overflow-hidden">
                        {primaryImg?.url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={primaryImg.url} alt={p.name} className="w-full h-full object-contain p-1" />
                        ) : (
                          <Laptop className="w-6 h-6 text-charcoal-400" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-bold text-charcoal-950 truncate leading-snug">{p.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-bold text-brand-800 bg-brand-50 px-1.5 py-0.5 rounded border border-brand-200">
                            {p.brand?.name || 'Laptop'}
                          </span>
                          <span className="text-[10px] text-charcoal-500 capitalize">{p.condition?.replace('-', ' ')}</span>
                        </div>
                        <span className="text-xs font-black text-charcoal-950 block mt-1">
                          Rs. {p.price?.toLocaleString('en-PK')}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-charcoal-100">
                      <button
                        type="button"
                        onClick={() => handleToggle(p._id, 'stockStatus', p.stockStatus)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                          p.stockStatus === 'available'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}
                      >
                        {p.stockStatus === 'available' ? 'In Stock' : 'Sold Out'}
                      </button>

                      <div className="flex items-center gap-1.5">
                        <Link
                          href={`/products/${p._id}/edit`}
                          className="px-2.5 py-1 rounded-lg bg-brand-50 border border-brand-200 text-brand-900 text-xs font-bold"
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => setDeleteModalProduct(p)}
                          className="p-1 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 text-xs"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 2. Desktop Table View (>= md) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-charcoal-50/80 border-b border-charcoal-200 text-charcoal-500 uppercase text-[10px] font-bold tracking-wider">
                  <tr>
                    <th className="py-3.5 px-3.5 w-8">
                      <button onClick={toggleSelectAll} className="text-charcoal-400 hover:text-charcoal-950">
                        {selectedIds.length === products.length ? (
                          <CheckSquare className="w-4 h-4 text-brand-600" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>
                    </th>
                    <th className="py-3.5 px-3.5">Item</th>
                    <th className="py-3.5 px-3.5">Brand / Type</th>
                    <th className="py-3.5 px-3.5">Price (PKR)</th>
                    <th className="py-3.5 px-3.5">Condition</th>
                    <th className="py-3.5 px-3.5">Stock Status</th>
                    <th className="py-3.5 px-3.5">Promotions</th>
                    <th className="py-3.5 px-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-charcoal-100 font-medium">
                  {products.map((p) => {
                    const primaryImg = p.images?.find((img) => img.isPrimary) || p.images?.[0];
                    const isSelected = selectedIds.includes(p._id);
                    const isEditingPrice = editingPriceId === p._id;

                    return (
                      <tr
                        key={p._id}
                        className={`hover:bg-charcoal-50/60 transition-colors ${
                          isSelected ? 'bg-brand-50/40' : ''
                        }`}
                      >
                        <td className="py-3.5 px-3.5">
                          <button
                            onClick={() => toggleSelectId(p._id)}
                            className="text-charcoal-400 hover:text-charcoal-950"
                          >
                            {isSelected ? (
                              <CheckSquare className="w-4 h-4 text-brand-600" />
                            ) : (
                              <Square className="w-4 h-4" />
                            )}
                          </button>
                        </td>

                        <td className="py-3.5 px-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-charcoal-50 border border-charcoal-200 flex items-center justify-center shrink-0 overflow-hidden shadow-xs">
                              {primaryImg?.url ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={primaryImg.url}
                                  alt={p.name}
                                  className="w-full h-full object-contain p-1"
                                />
                              ) : (
                                <Laptop className="w-5 h-5 text-charcoal-400" />
                              )}
                            </div>
                            <div className="min-w-0 max-w-xs">
                              <h4 className="font-bold text-charcoal-950 truncate">{p.name}</h4>
                              <span className="text-[10px] text-charcoal-400 truncate block">
                                SKU: {p.sku || p.slug}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-3.5">
                          <span className="font-bold text-charcoal-900 block">
                            {p.brand?.name || '—'}
                          </span>
                          <span className="text-[10px] text-charcoal-500 uppercase">{p.productType}</span>
                        </td>

                        <td className="py-3.5 px-3.5 font-black text-charcoal-950">
                          {isEditingPrice ? (
                            <div className="flex items-center gap-1">
                              <input
                                type="number"
                                value={tempPrice}
                                onChange={(e) => setTempPrice(Number(e.target.value))}
                                className="w-24 px-2 py-1 rounded-lg bg-white border border-brand-500 text-xs font-bold text-charcoal-950 focus:outline-none"
                              />
                              <button
                                onClick={() => handleSavePrice(p._id)}
                                className="p-1 rounded-lg bg-brand-500 text-charcoal-950"
                              >
                                <Check className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                setEditingPriceId(p._id);
                                setTempPrice(p.price);
                              }}
                              className="hover:underline cursor-pointer"
                              title="Click to inline edit price"
                            >
                              Rs. {p.price?.toLocaleString('en-PK')}
                            </button>
                          )}
                        </td>

                        <td className="py-3.5 px-3.5 capitalize text-charcoal-600">
                          {p.condition?.replace('-', ' ') || '—'}
                        </td>

                        <td className="py-3.5 px-3.5">
                          <button
                            type="button"
                            onClick={() => handleToggle(p._id, 'stockStatus', p.stockStatus)}
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors cursor-pointer ${
                              p.stockStatus === 'available'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-rose-50 hover:text-rose-700'
                                : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-emerald-50 hover:text-emerald-700'
                            }`}
                            title="Click to toggle Stock Status"
                          >
                            {p.stockStatus === 'available' ? 'Available' : 'Sold Out'}
                          </button>
                        </td>

                        <td className="py-3.5 px-3.5">
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleToggle(p._id, 'featured', p.featured)}
                              className={`p-1.5 rounded-xl border text-xs transition-colors ${
                                p.featured
                                  ? 'bg-brand-100 text-brand-900 border-brand-300 shadow-xs'
                                  : 'text-charcoal-400 border-charcoal-200 hover:text-charcoal-700'
                              }`}
                              title="Toggle Featured"
                            >
                              <Sparkles className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleToggle(p._id, 'bestDeal', p.bestDeal)}
                              className={`p-1.5 rounded-xl border text-xs transition-colors ${
                                p.bestDeal
                                  ? 'bg-amber-100 text-amber-900 border-amber-300 shadow-xs'
                                  : 'text-charcoal-400 border-charcoal-200 hover:text-charcoal-700'
                              }`}
                              title="Toggle Best Deal"
                            >
                              <Tag className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>

                        <td className="py-3.5 px-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleDuplicate(p._id)}
                              className="p-1.5 rounded-xl bg-charcoal-50 border border-charcoal-200 text-charcoal-600 hover:text-charcoal-950 transition-colors"
                              title="Duplicate Product"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>

                            <a
                              href={`${process.env.NEXT_PUBLIC_SITE_URL || 'https://yasin-laptop-hub.vercel.app'}/laptops/${p.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-xl bg-charcoal-50 border border-charcoal-200 text-charcoal-600 hover:text-charcoal-950 transition-colors"
                              title="Preview on Public Storefront"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>

                            <Link
                              href={`/products/${p._id}/edit`}
                              className="p-1.5 rounded-xl bg-brand-50 border border-brand-200 text-brand-900 hover:bg-brand-500 hover:text-charcoal-950 transition-colors"
                              title="Edit Product"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </Link>

                            <button
                              type="button"
                              onClick={() => setDeleteModalProduct(p)}
                              className="p-1.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100 transition-colors"
                              title="Archive Product"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Toolbar */}
            {totalPages > 1 && (
              <div className="p-4 border-t border-charcoal-100 flex items-center justify-between text-xs text-charcoal-600 font-bold bg-charcoal-50/50">
                <span>
                  Page {page} of {totalPages} ({totalCount} total items)
                </span>

                <div className="flex items-center gap-2">
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="px-3 py-1.5 rounded-xl bg-white border border-charcoal-200 hover:bg-charcoal-100 disabled:opacity-40 transition-colors"
                  >
                    Previous
                  </button>

                  <button
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    className="px-3 py-1.5 rounded-xl bg-white border border-charcoal-200 hover:bg-charcoal-100 disabled:opacity-40 transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="py-16 text-center space-y-3">
            <Laptop className="w-12 h-12 text-charcoal-300 mx-auto" />
            <p className="text-xs text-charcoal-500 font-medium">No matching products found.</p>
            <Link
              href="/products/new"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-400 text-charcoal-950 text-xs font-bold shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Catalog New Laptop</span>
            </Link>
          </div>
        )}
      </div>

      {/* Delete / Archive Confirmation Modal */}
      {deleteModalProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full p-8 rounded-3xl bg-white border border-charcoal-200 space-y-5 shadow-soft-lg">
            <div>
              <h3 className="text-lg font-black text-charcoal-950">Confirm Archive</h3>
              <p className="text-xs text-charcoal-600 mt-1 font-medium">
                Are you sure you want to remove{' '}
                <strong className="text-charcoal-950">{deleteModalProduct.name}</strong> from public catalog?
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteModalProduct(null)}
                className="py-3 rounded-xl bg-charcoal-100 hover:bg-charcoal-200 text-xs font-bold text-charcoal-800 transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteConfirm}
                className="py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-xs flex items-center justify-center gap-1.5"
              >
                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Confirm Delete</span>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
