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
    } catch (err) {
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
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Inventory Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Real-time catalog metrics and business controls for Yasin Laptop Hub.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadStats}
            disabled={isLoading}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors"
            title="Refresh Metrics"
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

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Products */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Products</span>
            <div className="w-8 h-8 rounded-lg bg-brand-600/10 text-brand-400 flex items-center justify-center">
              <Laptop className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {stats?.totalProducts ?? (isLoading ? '—' : 0)}
          </div>
          <div className="text-[11px] text-slate-500">Laptops, Chromebooks &amp; Accessories</div>
        </div>

        {/* In Stock Available */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-400">In Stock Available</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-600/10 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400">
            {stats?.availableProducts ?? (isLoading ? '—' : 0)}
          </div>
          <div className="text-[11px] text-slate-500">Active for WhatsApp inquiries</div>
        </div>

        {/* Sold Out */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-400">Sold Out Units</span>
            <div className="w-8 h-8 rounded-lg bg-rose-600/10 text-rose-400 flex items-center justify-center">
              <AlertOctagon className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-rose-400">
            {stats?.soldOutProducts ?? (isLoading ? '—' : 0)}
          </div>
          <div className="text-[11px] text-slate-500">Archived or awaiting shipment</div>
        </div>

        {/* Featured & Deals */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-400">Featured / Deals</span>
            <div className="w-8 h-8 rounded-lg bg-amber-600/10 text-amber-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-400">
            {(stats?.featuredProducts || 0) + (stats?.bestDeals || 0)}
          </div>
          <div className="text-[11px] text-slate-500">Promoted on homepage storefront</div>
        </div>
      </div>

      {/* Quick Action Shortcuts */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
          Quick Inventory Actions
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <Link
            href="/products/new?type=laptop"
            className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-brand-500/40 hover:bg-slate-900 transition-all flex flex-col items-center text-center gap-2 group"
          >
            <div className="w-10 h-10 rounded-xl bg-brand-600/10 text-brand-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Laptop className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-slate-200">Add Laptop</span>
          </Link>

          <Link
            href="/products/new?type=chromebook"
            className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-brand-500/40 hover:bg-slate-900 transition-all flex flex-col items-center text-center gap-2 group"
          >
            <div className="w-10 h-10 rounded-xl bg-brand-600/10 text-brand-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Laptop className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-slate-200">Add Chromebook</span>
          </Link>

          <Link
            href="/accessories"
            className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-brand-500/40 hover:bg-slate-900 transition-all flex flex-col items-center text-center gap-2 group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-600/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-slate-200">Accessories</span>
          </Link>

          <Link
            href="/categories"
            className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-brand-500/40 hover:bg-slate-900 transition-all flex flex-col items-center text-center gap-2 group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-600/10 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FolderTree className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-slate-200">Categories</span>
          </Link>

          <Link
            href="/settings"
            className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-brand-500/40 hover:bg-slate-900 transition-all flex flex-col items-center text-center gap-2 group col-span-2 sm:col-span-1"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-600/10 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-slate-200">Store Settings</span>
          </Link>
        </div>
      </div>

      {/* Recently Added Products Table */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white">Recently Cataloged Inventory</h2>
            <p className="text-xs text-slate-400">Latest laptops registered into the system</p>
          </div>
          <Link
            href="/products"
            className="text-xs font-semibold text-brand-400 hover:text-brand-300 inline-flex items-center gap-1"
          >
            <span>Manage All Products</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {isLoading ? (
          <div className="py-8 text-center text-xs text-slate-500">Loading recent inventory...</div>
        ) : stats?.recentProducts && stats.recentProducts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-2">Product</th>
                  <th className="py-3 px-2">Brand</th>
                  <th className="py-3 px-2">Price (PKR)</th>
                  <th className="py-3 px-2">Condition</th>
                  <th className="py-3 px-2">Status</th>
                  <th className="py-3 px-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {stats.recentProducts.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-900/40">
                    <td className="py-3 px-2 font-semibold text-slate-200 max-w-[200px] truncate">
                      {p.name}
                    </td>
                    <td className="py-3 px-2 text-slate-400">{p.brand?.name || '—'}</td>
                    <td className="py-3 px-2 font-bold text-white">
                      Rs. {p.price?.toLocaleString('en-PK')}
                    </td>
                    <td className="py-3 px-2 text-slate-400 capitalize">{p.condition || '—'}</td>
                    <td className="py-3 px-2">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          p.stockStatus === 'available'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60'
                            : 'bg-rose-950 text-rose-400 border border-rose-800/60'
                        }`}
                      >
                        {p.stockStatus === 'available' ? 'Available' : 'Sold Out'}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-right space-x-2">
                      <Link
                        href={`/products/${p._id}/edit`}
                        className="text-brand-400 hover:text-brand-300 font-semibold"
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
            <Laptop className="w-10 h-10 text-slate-700 mx-auto" />
            <p className="text-xs text-slate-400">No products cataloged yet.</p>
            <Link
              href="/products/new"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold"
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
