'use client';

import React, { useState, useEffect } from 'react';
import { adminApiClient } from '@/lib/api-client';
import { Settings, ShieldCheck, Check, AlertCircle, Loader2, Save } from 'lucide-react';

interface IBusinessSettings {
  businessName: string;
  ownerName: string;
  tagline?: string;
  whatsappNumber: string;
  phoneNumber: string;
  email: string;
  address: {
    street: string;
    city: string;
    district: string;
    province: string;
    country: string;
  };
  googleMapsUrl?: string;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    tiktok?: string;
    youtube?: string;
  };
  openingHours?: string;
}

export default function AdminSettingsPage() {
  const [formData, setFormData] = useState<IBusinessSettings>({
    businessName: 'Yasin Laptop Hub',
    ownerName: 'Yasin Wahab',
    tagline: 'Quality Laptops • Chromebooks • Accessories in Lakki Marwat',
    whatsappNumber: '+923427709129',
    phoneNumber: '03427709129',
    email: 'info@yasinlaptophub.com',
    address: {
      street: 'Main Bazaar',
      city: 'Lakki Marwat',
      district: 'Lakki Marwat',
      province: 'Khyber Pakhtunkhwa',
      country: 'Pakistan',
    },
    googleMapsUrl: '',
    socialLinks: {
      facebook: '',
      instagram: '',
      tiktok: '',
      youtube: '',
    },
    openingHours: 'Monday – Saturday: 9:00 AM – 9:00 PM',
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    adminApiClient<IBusinessSettings & { phone?: string }>('/settings')
      .then((res) => {
        if (res.success && res.data) {
          const raw = res.data;
          setFormData((prev) => ({
            ...prev,
            ...raw,
            whatsappNumber: raw.whatsappNumber || '+923427709129',
            phoneNumber: raw.phoneNumber || raw.phone || '03427709129',
            address: { ...prev.address, ...raw?.address },
            socialLinks: { ...prev.socialLinks, ...raw?.socialLinks },
          }));
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const res = await adminApiClient('/settings', {
        method: 'PUT',
        body: JSON.stringify(formData),
      });

      if (res.success) {
        setSuccessMsg('Business settings updated successfully!');
        setTimeout(() => setSuccessMsg(null), 3000);
      } else {
        setError(res.message || 'Failed to update settings');
      }
    } catch (err) {
      setError('Connection failure while saving business settings');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="py-20 text-center text-xs text-slate-400">Loading business configuration...</div>;
  }

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-4xl mx-auto pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Business Settings &amp; Store Metadata
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Control contact details, store hours, Google Maps, and social media channels.
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
              <span>Save Changes</span>
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

      {/* 1. STORE IDENTITY */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider">
          1. Brand Identity
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Business Name</label>
            <input
              type="text"
              required
              value={formData.businessName}
              onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Owner Name</label>
            <input
              type="text"
              required
              value={formData.ownerName}
              onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-300 mb-1">Store Tagline</label>
            <input
              type="text"
              value={formData.tagline || ''}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-brand-500"
            />
          </div>
        </div>
      </div>

      {/* 2. DIRECT CONTACT CHANNELS */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider">
          2. Direct Customer Channels (WhatsApp &amp; Phone)
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              WhatsApp Number (e.g. +923XXXXXXXXX)
            </label>
            <input
              type="text"
              value={formData.whatsappNumber || ''}
              onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
              placeholder="+923427709129"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-emerald-400 font-bold focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Store Phone Number
            </label>
            <input
              type="text"
              value={formData.phoneNumber || ''}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              placeholder="03427709129"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Contact Email
            </label>
            <input
              type="email"
              value={formData.email || ''}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="contact@yasinlaptophub.com"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-brand-500"
            />
          </div>
        </div>
      </div>

      {/* 3. PHYSICAL STORE LOCATION */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider">
          3. Physical Store Address (Lakki Marwat, KPK)
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Street / Area</label>
            <input
              type="text"
              value={formData.address.street}
              onChange={(e) => setFormData({ ...formData, address: { ...formData.address, street: e.target.value } })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">City</label>
            <input
              type="text"
              value={formData.address.city}
              onChange={(e) => setFormData({ ...formData, address: { ...formData.address, city: e.target.value } })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Province</label>
            <input
              type="text"
              value={formData.address.province}
              onChange={(e) => setFormData({ ...formData, address: { ...formData.address, province: e.target.value } })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="sm:col-span-3">
            <label className="block text-xs font-semibold text-slate-300 mb-1">Google Maps Pin URL</label>
            <input
              type="text"
              value={formData.googleMapsUrl || ''}
              onChange={(e) => setFormData({ ...formData, googleMapsUrl: e.target.value })}
              placeholder="https://maps.google.com/?q=..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="sm:col-span-3">
            <label className="block text-xs font-semibold text-slate-300 mb-1">Store Hours</label>
            <input
              type="text"
              value={formData.openingHours || ''}
              onChange={(e) => setFormData({ ...formData, openingHours: e.target.value })}
              placeholder="e.g. Monday – Saturday: 9:00 AM – 9:00 PM"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-brand-500"
            />
          </div>
        </div>
      </div>
    </form>
  );
}
