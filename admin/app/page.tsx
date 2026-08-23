'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Laptop,
  CheckCircle2,
  AlertOctagon,
  Sparkles,
  Tag,
  Layers,
  FolderTree,
  Plus,
  ArrowRight,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { adminApiClient } from '@/lib/api-client';

interface DashboardStats {
  totalProducts: number;
  availableProducts: number;
  soldOutProducts: number;
  featuredProducts: number;
  bestDeals: number;
  totalAccessories: number;
  totalCategories: number;
  totalBrands: number;
  recentProducts: Array<{
    _id: string;
    name: string;
    slug: string;
    price: number;
    stockStatus: string;
    condition: string;
    brand?: { name: string };
    categories?: Array<{ name: string }>;
    createdAt: string;
  }>;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadStats = async () => {
    setIsLoading(true);
    try {
      const res = await adminApiClient<DashboardStats>('/dashboard/stats');
      if (res.success && res.data) {
        setStats(res.data);
      }
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  return (
    <div className="space-y-8">
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-charcoal-950 tracking-tight">
            Inventory Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-500 font-medium">
            Real-time catalog metrics and business controls for Yasin Laptop Hub.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadStats}
            disabled={isLoading}
            className="p-2.5 rounded-xl bg-white border border-charcoal-200 text-charcoal-700 hover:text-charcoal-950 transition-colors shadow-soft"
            title="Refresh Metrics"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
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

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Products */}
        <div className="p-6 rounded-3xl bg-white border border-charcoal-200/90 shadow-soft space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-charcoal-500">Total Products</span>
            <div className="w-9 h-9 rounded-xl bg-brand-100 border border-brand-300 text-brand-900 flex items-center justify-center shadow-xs">
              <Laptop className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-charcoal-950">
            {stats?.totalProducts ?? (isLoading ? '—' : 0)}
          </div>
          <div className="text-[11px] text-charcoal-400 font-medium">Laptops, Chromebooks &amp; Accessories</div>
        </div>

        {/* In Stock Available */}
        <div className="p-6 rounded-3xl bg-white border border-charcoal-200/90 shadow-soft space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-700">In Stock Available</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shadow-xs">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-emerald-700">
            {stats?.availableProducts ?? (isLoading ? '—' : 0)}
          </div>
          <div className="text-[11px] text-charcoal-400 font-medium">Active for WhatsApp inquiries</div>
        </div>

        {/* Sold Out */}
        <div className="p-6 rounded-3xl bg-white border border-charcoal-200/90 shadow-soft space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-700">Sold Out Units</span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center justify-center shadow-xs">
              <AlertOctagon className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-rose-700">
            {stats?.soldOutProducts ?? (isLoading ? '—' : 0)}
          </div>
          <div className="text-[11px] text-charcoal-400 font-medium">Archived or awaiting shipment</div>
        </div>

        {/* Featured & Deals */}
        <div className="p-6 rounded-3xl bg-white border border-charcoal-200/90 shadow-soft space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-700">Featured / Deals</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-amber-700">
            {(stats?.featuredProducts || 0) + (stats?.bestDeals || 0)}
          </div>
          <div className="text-[11px] text-charcoal-400 font-medium">Promoted on storefront</div>
        </div>
      </div>

      {/* Quick Action Shortcuts */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-charcoal-500">
          Quick Inventory Actions
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <Link
            href="/products/new?type=laptop"
            className="p-5 rounded-3xl bg-white border border-charcoal-200/90 shadow-soft hover:border-brand-500/80 hover:-translate-y-0.5 transition-all flex flex-col items-center text-center gap-2 group"
          >
            <div className="w-11 h-11 rounded-2xl bg-brand-50 border border-brand-200 text-brand-700 flex items-center justify-center group-hover:bg-brand-500 group-hover:text-charcoal-950 transition-colors shadow-xs">
              <Laptop className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-charcoal-900 group-hover:text-brand-700">Add Laptop</span>
          </Link>

          <Link
            href="/products/new?type=chromebook"
            className="p-5 rounded-3xl bg-white border border-charcoal-200/90 shadow-soft hover:border-brand-500/80 hover:-translate-y-0.5 transition-all flex flex-col items-center text-center gap-2 group"
          >
            <div className="w-11 h-11 rounded-2xl bg-brand-50 border border-brand-200 text-brand-700 flex items-center justify-center group-hover:bg-brand-500 group-hover:text-charcoal-950 transition-colors shadow-xs">
              <Laptop className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-charcoal-900 group-hover:text-brand-700">Add Chromebook</span>
          </Link>

          <Link
            href="/accessories"
            className="p-5 rounded-3xl bg-white border border-charcoal-200/90 shadow-soft hover:border-brand-500/80 hover:-translate-y-0.5 transition-all flex flex-col items-center text-center gap-2 group"
          >
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors shadow-xs">
              <Layers className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-charcoal-900 group-hover:text-emerald-700">Accessories</span>
          </Link>

          <Link
            href="/categories"
            className="p-5 rounded-3xl bg-white border border-charcoal-200/90 shadow-soft hover:border-brand-500/80 hover:-translate-y-0.5 transition-all flex flex-col items-center text-center gap-2 group"
          >
            <div className="w-11 h-11 rounded-2xl bg-brand-50 border border-brand-200 text-brand-700 flex items-center justify-center group-hover:bg-brand-500 group-hover:text-charcoal-950 transition-colors shadow-xs">
              <FolderTree className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-charcoal-900 group-hover:text-brand-700">Categories</span>
          </Link>

          <Link
            href="/settings"
            className="p-5 rounded-3xl bg-white border border-charcoal-200/90 shadow-soft hover:border-brand-500/80 hover:-translate-y-0.5 transition-all flex flex-col items-center text-center gap-2 group col-span-2 sm:col-span-1"
          >
            <div className="w-11 h-11 rounded-2xl bg-charcoal-100 border border-charcoal-200 text-charcoal-700 flex items-center justify-center group-hover:bg-charcoal-900 group-hover:text-white transition-colors shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-charcoal-900 group-hover:text-charcoal-950">Store Settings</span>
          </Link>
        </div>
      </div>

      {/* Recently Added Products Table */}
      <div className="p-6 rounded-3xl bg-white border border-charcoal-200/90 shadow-soft space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-black text-charcoal-950">Recently Cataloged Inventory</h2>
            <p className="text-xs text-charcoal-500 font-medium">Latest laptops registered into the system</p>
          </div>
          <Link
            href="/products"
            className="text-xs font-bold text-charcoal-900 hover:text-brand-700 inline-flex items-center gap-1 transition-colors"
          >
            <span>Manage All Products</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {isLoading ? (
          <div className="py-8 text-center text-xs text-charcoal-400 font-medium">Loading recent inventory...</div>
        ) : stats?.recentProducts && stats.recentProducts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-charcoal-200 text-charcoal-500 uppercase text-[10px] font-bold">
                <tr>
                  <th className="py-3 px-3">Product</th>
                  <th className="py-3 px-3">Brand</th>
                  <th className="py-3 px-3">Price (PKR)</th>
                  <th className="py-3 px-3">Condition</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal-100 font-medium">
                {stats.recentProducts.map((p) => (
                  <tr key={p._id} className="hover:bg-charcoal-50/70 transition-colors">
                    <td className="py-3.5 px-3 font-bold text-charcoal-950 max-w-[220px] truncate">
                      {p.name}
                    </td>
                    <td className="py-3.5 px-3 text-charcoal-600">{p.brand?.name || '—'}</td>
                    <td className="py-3.5 px-3 font-black text-charcoal-950">
                      Rs. {p.price?.toLocaleString('en-PK')}
                    </td>
                    <td className="py-3.5 px-3 text-charcoal-600 capitalize">{p.condition || '—'}</td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          p.stockStatus === 'available'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {p.stockStatus === 'available' ? 'Available' : 'Sold Out'}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <Link
                        href={`/products/${p._id}/edit`}
                        className="px-3 py-1 rounded-lg bg-charcoal-100 hover:bg-charcoal-200 text-charcoal-900 font-bold transition-colors"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center space-y-3">
            <Laptop className="w-10 h-10 text-charcoal-300 mx-auto" />
            <p className="text-xs text-charcoal-500 font-medium">No products cataloged yet.</p>
            <Link
              href="/products/new"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-400 text-charcoal-950 text-xs font-bold shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Your First Laptop</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
