'use client';

import React, { useState, useEffect } from 'react';
import { adminApiClient } from '@/lib/api-client';
import { Search, Save, Check, AlertCircle, Loader2, Globe, ShieldCheck } from 'lucide-react';

export default function AdminSeoPage() {
  const [formData, setFormData] = useState({
    defaultTitle: 'Yasin Laptop Hub | Quality Laptops & Chromebooks in Lakki Marwat',
    defaultDescription:
      'Explore genuine business laptops, Chromebooks, and original accessories at Yasin Laptop Hub in Lakki Marwat, KPK, Pakistan. Checking warranty and WhatsApp inquiries.',
    googleSiteVerification: '',
    googleAnalyticsId: '',
    canonicalDomain: 'https://yasinlaptophub.com',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const res = await adminApiClient('/settings', {
        method: 'PUT',
        body: JSON.stringify({ seo: formData }),
      });

      if (res.success) {
        setSuccessMsg('SEO configuration saved successfully!');
        setTimeout(() => setSuccessMsg(null), 3000);
      } else {
        setError(res.message || 'Failed to save SEO configuration');
      }
    } catch (err) {
      setError('Connection failure while saving SEO settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-4xl mx-auto pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            SEO &amp; Search Console Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Control global metadata fallbacks, Google verification, and canonical URLs.
          </p>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs shadow-md shadow-brand-600/30 transition-all disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save SEO Settings</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-800 text-xs text-rose-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-800 text-xs text-emerald-300 flex items-center gap-2">
          <Check className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Global Meta Info */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Globe className="w-4 h-4 text-brand-400" />
          <span>1. Global Storefront Metadata</span>
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Default Meta Title (Homepage / Fallback)
            </label>
            <input
              type="text"
              value={formData.defaultTitle}
              onChange={(e) => setFormData({ ...formData, defaultTitle: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Default Meta Description
            </label>
            <textarea
              rows={3}
              value={formData.defaultDescription}
              onChange={(e) => setFormData({ ...formData, defaultDescription: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-brand-500 leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Production Canonical Base URL
            </label>
            <input
              type="url"
              value={formData.canonicalDomain}
              onChange={(e) => setFormData({ ...formData, canonicalDomain: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 focus:outline-none focus:border-brand-500"
            />
          </div>
        </div>
      </div>

      {/* Webmaster Verification */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>2. Google Search Console &amp; Verification</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Google Site Verification Code
            </label>
            <input
              type="text"
              placeholder="e.g. google-site-verification=abc123xyz"
              value={formData.googleSiteVerification}
              onChange={(e) => setFormData({ ...formData, googleSiteVerification: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Google Analytics (GA4 Measurement ID)
            </label>
            <input
              type="text"
              placeholder="e.g. G-XXXXXXXXXX"
              value={formData.googleAnalyticsId}
              onChange={(e) => setFormData({ ...formData, googleAnalyticsId: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-brand-500"
            />
          </div>
        </div>
      </div>
    </form>
  );
}
