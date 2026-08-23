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
  AlertCircle,
  Loader2,
  RefreshCw,
  CheckSquare,
  Square,
  Archive,
  Eye,
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
  const [statusFilter, setStatusFilter] = useState('');
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
        setProducts(res.data.items);
        setTotalCount(res.data.pagination.total);
        setTotalPages(res.data.pagination.totalPages);
      }
    } catch (err) {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  }, [page, searchTerm, typeFilter, stockFilter]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Quick field toggle handler
  const handleToggle = async (id: string, field: 'featured' | 'bestDeal' | 'stockStatus', currentValue: any) => {
    const newValue = field === 'stockStatus' ? (currentValue === 'available' ? 'sold_out' : 'available') : !currentValue;

    try {
      const res = await adminApiClient(`/products/${id}/toggle`, {
        method: 'PATCH',
        body: JSON.stringify({ field, value: newValue }),
      });

      if (res.success) {
        setProducts((prev) =>
          prev.map((p) => (p._id === id ? { ...p, [field]: newValue } : p))
        );
      }
    } catch (err) {}
  };

  // Quick price save
  const handleSavePrice = async (id: string) => {
    if (tempPrice < 0) return;
    try {
      const res = await adminApiClient(`/products/${id}/toggle`, {
        method: 'PATCH',
        body: JSON.stringify({ field: 'price', value: tempPrice }),
      });

      if (res.success) {
        setProducts((prev) =>
          prev.map((p) => (p._id === id ? { ...p, price: tempPrice } : p))
        );
        setEditingPriceId(null);
      }
    } catch (err) {}
  };

  // Duplicate Product
  const handleDuplicate = async (id: string) => {
    try {
      const res = await adminApiClient<IAdminProduct>(`/products/duplicate/${id}`, {
        method: 'POST',
      });
      if (res.success && res.data) {
        loadProducts();
      }
    } catch (err) {}
  };

  // Bulk Actions
  const handleBulkAction = async (action: string) => {
    if (selectedIds.length === 0) return;
    if (action === 'archive' && !confirm(`Archive ${selectedIds.length} selected products?`)) return;

    setIsBulkExecuting(true);
    try {
      const res = await adminApiClient('/products/bulk-action', {
        method: 'POST',
        body: JSON.stringify({ ids: selectedIds, action }),
      });

      if (res.success) {
        setSelectedIds([]);
        loadProducts();
      }
    } catch (err) {
    } finally {
      setIsBulkExecuting(false);
    }
  };

  // Delete confirm handler
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
    } catch (err) {
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === products.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(products.map((p) => p._id));
    }
  };

  const toggleSelectId = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Inventory &amp; Product CMS
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            {totalCount} total laptop units, Chromebooks and accessories cataloged.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadProducts}
            disabled={isLoading}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            title="Refresh list"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <Link
            href="/products/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs shadow-md shadow-brand-600/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </Link>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        <div className="relative sm:col-span-2">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            placeholder="Search by title, brand, model, SKU, processor..."
            className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-500"
          />
        </div>

        <div>
          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setPage(1);
            }}
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-brand-500"
          >
            <option value="">All Types (Laptops &amp; Accessories)</option>
            <option value="laptop">Laptops Only</option>
            <option value="chromebook">Chromebooks Only</option>
            <option value="accessory">Accessories Only</option>
          </select>
        </div>

        <div>
          <select
            value={stockFilter}
            onChange={(e) => {
              setStockFilter(e.target.value);
              setPage(1);
            }}
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-brand-500"
          >
            <option value="">All Inventory Status</option>
            <option value="available">In Stock (Available)</option>
            <option value="sold_out">Sold Out Units</option>
          </select>
        </div>
      </div>

      {/* Bulk Actions Floating Bar */}
      {selectedIds.length > 0 && (
        <div className="p-3.5 rounded-2xl bg-brand-950/80 border border-brand-800/80 flex flex-wrap items-center justify-between gap-3 text-xs shadow-xl animate-in fade-in">
          <div className="flex items-center gap-2 text-brand-300 font-semibold">
            <CheckSquare className="w-4 h-4" />
            <span>{selectedIds.length} products selected</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleBulkAction('mark_available')}
              disabled={isBulkExecuting}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium shadow"
            >
              Mark In Stock
            </button>

            <button
              onClick={() => handleBulkAction('mark_sold')}
              disabled={isBulkExecuting}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-300 font-medium"
            >
              Mark Sold Out
            </button>

            <button
              onClick={() => handleBulkAction('archive')}
              disabled={isBulkExecuting}
              className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-medium shadow"
            >
              Bulk Archive
            </button>
          </div>
        </div>
      )}

      {/* Main Data Table */}
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="py-20 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-brand-400" />
            <span>Loading inventory database records...</span>
          </div>
        ) : products.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3.5 px-3 w-8">
                      <button onClick={toggleSelectAll} className="text-slate-400 hover:text-white">
                        {selectedIds.length === products.length ? (
                          <CheckSquare className="w-4 h-4 text-brand-400" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>
                    </th>
                    <th className="py-3.5 px-3">Item</th>
                    <th className="py-3.5 px-3">Brand / Type</th>
                    <th className="py-3.5 px-3">Price (PKR)</th>
                    <th className="py-3.5 px-3">Condition</th>
                    <th className="py-3.5 px-3">Stock Status</th>
                    <th className="py-3.5 px-3">Promotions</th>
                    <th className="py-3.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {products.map((p) => {
                    const primaryImg = p.images?.find((img) => img.isPrimary) || p.images?.[0];
                    const isSelected = selectedIds.includes(p._id);
                    const isEditingPrice = editingPriceId === p._id;

                    return (
                      <tr
                        key={p._id}
                        className={`hover:bg-slate-900/40 transition-colors ${
                          isSelected ? 'bg-brand-950/20' : ''
                        }`}
                      >
                        <td className="py-3 px-3">
                          <button
                            onClick={() => toggleSelectId(p._id)}
                            className="text-slate-400 hover:text-white"
                          >
                            {isSelected ? (
                              <CheckSquare className="w-4 h-4 text-brand-400" />
                            ) : (
                              <Square className="w-4 h-4" />
                            )}
                          </button>
                        </td>

                        <td className="py-3 px-3">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0 overflow-hidden">
                              {primaryImg?.url ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={primaryImg.url}
                                  alt={p.name}
                                  className="w-full h-full object-contain p-1"
                                />
                              ) : (
                                <Laptop className="w-5 h-5 text-slate-600" />
                              )}
                            </div>
                            <div className="min-w-0 max-w-xs">
                              <h4 className="font-bold text-slate-100 truncate">{p.name}</h4>
                              <span className="text-[10px] text-slate-500 truncate block">
                                SKU: {p.sku || p.slug}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-3">
                          <span className="font-semibold text-slate-300 block">
                            {p.brand?.name || '—'}
                          </span>
                          <span className="text-[10px] text-slate-500 uppercase">{p.productType}</span>
                        </td>

                        <td className="py-3 px-3 font-bold text-white">
                          {isEditingPrice ? (
                            <div className="flex items-center gap-1">
                              <input
                                type="number"
                                value={tempPrice}
                                onChange={(e) => setTempPrice(Number(e.target.value))}
                                className="w-24 px-2 py-1 rounded bg-slate-950 border border-brand-500 text-xs font-bold text-white focus:outline-none"
                              />
                              <button
                                onClick={() => handleSavePrice(p._id)}
                                className="p-1 rounded bg-brand-600 text-white"
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

                        <td className="py-3 px-3 capitalize text-slate-300">
                          {p.condition?.replace('-', ' ') || '—'}
                        </td>

                        <td className="py-3 px-3">
                          <button
                            type="button"
                            onClick={() => handleToggle(p._id, 'stockStatus', p.stockStatus)}
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors cursor-pointer ${
                              p.stockStatus === 'available'
                                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800 hover:bg-rose-950/80'
                                : 'bg-rose-950/80 text-rose-300 border-rose-800 hover:bg-emerald-950/80'
                            }`}
                            title="Click to toggle Stock Status"
                          >
                            {p.stockStatus === 'available' ? 'Available' : 'Sold Out'}
                          </button>
                        </td>

                        <td className="py-3 px-3">
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleToggle(p._id, 'featured', p.featured)}
                              className={`p-1.5 rounded-lg border text-xs transition-colors ${
                                p.featured
                                  ? 'bg-brand-600/20 text-brand-400 border-brand-500/40'
                                  : 'text-slate-600 border-slate-800 hover:text-slate-400'
                              }`}
                              title="Toggle Featured"
                            >
                              <Sparkles className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleToggle(p._id, 'bestDeal', p.bestDeal)}
                              className={`p-1.5 rounded-lg border text-xs transition-colors ${
                                p.bestDeal
                                  ? 'bg-amber-600/20 text-amber-400 border-amber-500/40'
                                  : 'text-slate-600 border-slate-800 hover:text-slate-400'
                              }`}
                              title="Toggle Best Deal"
                            >
                              <Tag className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>

                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleDuplicate(p._id)}
                              className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-brand-300"
                              title="Duplicate Product"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>

                            <a
                              href={`${process.env.NEXT_PUBLIC_SITE_URL || 'https://yasin-laptop-hub.vercel.app'}/laptops/${p.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-white"
                              title="Preview on Public Storefront"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>

                            <Link
                              href={`/products/${p._id}/edit`}
                              className="p-1.5 rounded-lg bg-brand-600/20 border border-brand-500/30 text-brand-400 hover:text-brand-300"
                              title="Edit Product"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </Link>

                            <button
                              type="button"
                              onClick={() => setDeleteModalProduct(p)}
                              className="p-1.5 rounded-lg bg-rose-950/40 border border-rose-800/40 text-rose-400 hover:text-rose-300"
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
              <div className="flex items-center justify-between p-4 border-t border-slate-800 text-xs text-slate-400 bg-slate-950/40">
                <span>
                  Page <strong>{page}</strong> of <strong>{totalPages}</strong> ({totalCount} items)
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:text-white disabled:opacity-40"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    disabled={page >= totalPages}
                    onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:text-white disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="py-16 text-center space-y-3">
            <Laptop className="w-12 h-12 text-slate-700 mx-auto" />
            <h3 className="text-base font-bold text-white">No products found</h3>
            <p className="text-xs text-slate-400">
              Try adjusting your search terms or add a new laptop to the catalog.
            </p>
            <Link
              href="/products/new"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-semibold shadow-md"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add First Laptop</span>
            </Link>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalProduct && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-400 flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">
                Archive Product?
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Are you sure you want to remove <strong className="text-white">&ldquo;{deleteModalProduct.name}&rdquo;</strong> from public view? This unit will be marked as archived.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteModalProduct(null)}
                className="py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteConfirm}
                className="py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-md flex items-center justify-center gap-1.5"
              >
                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Confirm Archive</span>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
