'use client';

import React, { useState, useEffect } from 'react';
import { adminApiClient } from '@/lib/api-client';
import { Settings, ShieldCheck, Check, AlertCircle, Loader2, Save, PlayCircle, Share2, MapPin, Store, Building2, Phone, MessageCircle, Clock, Trash2 } from 'lucide-react';

export interface IStoreBranch {
  id: string;
  name: string;
  city: string;
  province: string;
  address: string;
  tag: string;
  phone: string;
  whatsapp: string;
  timings: string;
  mapsUrl?: string;
  isMain?: boolean;
}

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
  branches?: IStoreBranch[];
  googleMapsUrl?: string;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    tiktok?: string;
    youtube?: string;
  };
  openingHours?: string;
  dailyStockVideo?: {
    title?: string;
    videoUrl?: string;
    thumbnailUrl?: string;
    description?: string;
    isActive?: boolean;
    buttonText?: string;
  };
}

const DEFAULT_SETTINGS_BRANCHES: IStoreBranch[] = [
  {
    id: 'lakki-marwat',
    name: 'Lakki Marwat (Main Shop & Head Office)',
    city: 'Lakki Marwat',
    province: 'Khyber Pakhtunkhwa',
    address: 'Main Bazaar, Lakki Marwat, Khyber Pakhtunkhwa, Pakistan',
    tag: 'Main Store & Head Office',
    phone: '03427709129',
    whatsapp: '+923427709129',
    timings: 'Monday – Saturday: 9:00 AM – 9:00 PM',
    mapsUrl: 'https://maps.google.com/?q=Lakki+Marwat+Main+Bazaar',
    isMain: true,
  },
  {
    id: 'peshawar',
    name: 'Peshawar Branch',
    city: 'Peshawar',
    province: 'Khyber Pakhtunkhwa',
    address: 'Saddar / University Road Computer Market, Peshawar, KPK, Pakistan',
    tag: 'KPK Regional Branch',
    phone: '03427709129',
    whatsapp: '+923427709129',
    timings: 'Monday – Saturday: 10:00 AM – 8:30 PM',
    mapsUrl: 'https://maps.google.com/?q=Peshawar+Computer+Market',
    isMain: false,
  },
  {
    id: 'sargodha',
    name: 'Sargodha Branch',
    city: 'Sargodha',
    province: 'Punjab',
    address: 'Kutchery Road / Trust Plaza, Computer Market, Sargodha, Punjab, Pakistan',
    tag: 'Punjab Regional Branch',
    phone: '03427709129',
    whatsapp: '+923427709129',
    timings: 'Monday – Saturday: 10:00 AM – 8:30 PM',
    mapsUrl: 'https://maps.google.com/?q=Sargodha+Computer+Market',
    isMain: false,
  },
];

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
    branches: DEFAULT_SETTINGS_BRANCHES,
    googleMapsUrl: '',
    socialLinks: {
      facebook: '',
      instagram: 'https://www.instagram.com/yasinwahab6',
      tiktok: 'https://www.tiktok.com/@yasinlaptopslakkimarwat',
      youtube: '',
    },
    openingHours: 'Monday – Saturday: 9:00 AM – 9:00 PM',
    dailyStockVideo: {
      title: "Today's Fresh Stock Arrival",
      videoUrl: '',
      thumbnailUrl: '',
      description: 'Check out our fresh container stock arrival with 1-month warranty in Lakki Marwat.',
      isActive: true,
      buttonText: 'Watch Daily Stock Video',
    },
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleClearInventory = async () => {
    const confirmation = window.prompt(
      'WARNING: This will permanently delete all laptop products and accessories from the database.\n\nType "DELETE" below to confirm:'
    );

    if (confirmation !== 'DELETE') {
      if (confirmation !== null) {
        alert('Action canceled. Confirmation text did not match "DELETE".');
      }
      return;
    }

    setIsClearing(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const res = await adminApiClient<{ deletedProducts: number; deletedAccessories: number }>(
        '/dashboard/clear-inventory',
        {
          method: 'POST',
        }
      );

      if (res.success) {
        setSuccessMsg(
          `Inventory cleared successfully: ${res.data?.deletedProducts ?? 0} laptops and ${res.data?.deletedAccessories ?? 0} accessories removed.`
        );
      } else {
        setError(res.message || 'Failed to clear inventory.');
      }
    } catch {
      setError('Connection failure while clearing database.');
    } finally {
      setIsClearing(false);
    }
  };

  useEffect(() => {
    adminApiClient<IBusinessSettings & { phone?: string; instagramUrl?: string; tiktokUrl?: string }>(
      '/settings'
    )
      .then((res) => {
        if (res.success && res.data) {
          const raw = res.data;
          setFormData((prev) => ({
            ...prev,
            ...raw,
            whatsappNumber: raw.whatsappNumber || '+923427709129',
            phoneNumber: raw.phoneNumber || raw.phone || '03427709129',
            address: { ...prev.address, ...raw?.address },
            branches: raw?.branches && raw.branches.length > 0 ? raw.branches : DEFAULT_SETTINGS_BRANCHES,
            socialLinks: {
              facebook: raw?.socialLinks?.facebook || '',
              instagram:
                raw?.socialLinks?.instagram ||
                raw?.instagramUrl ||
                'https://www.instagram.com/yasinwahab6',
              tiktok:
                raw?.socialLinks?.tiktok ||
                raw?.tiktokUrl ||
                'https://www.tiktok.com/@yasinlaptopslakkimarwat',
              youtube: raw?.socialLinks?.youtube || '',
            },
            dailyStockVideo: {
              ...prev.dailyStockVideo,
              ...raw?.dailyStockVideo,
            },
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
    } catch {
      setError('Connection failure while saving business settings');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="py-20 text-center text-xs text-charcoal-500 font-medium">Loading business configuration...</div>;
  }

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-4xl mx-auto pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-charcoal-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-charcoal-950 tracking-tight">
            Business Settings &amp; Store Metadata
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-500 font-medium">
            Control contact details, store hours, Google Maps, social media, and daily stock videos.
          </p>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-charcoal-950 font-bold text-xs shadow-sm transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
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
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2 font-medium">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 font-medium">
          <Check className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* 1. DAILY STOCK VIDEO & STATUS SHOWCASE */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-brand-300 space-y-4 shadow-soft">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-100 border border-brand-300 text-brand-900 flex items-center justify-center shadow-xs">
              <PlayCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-black text-charcoal-950 uppercase tracking-wider">
                Daily Stock Video Showcase (Hero Section Button)
              </h2>
              <p className="text-xs text-charcoal-500 font-medium">
                Upload your daily status video (TikTok, YouTube Shorts, YouTube, or MP4) to show on the website.
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={formData.dailyStockVideo?.isActive ?? true}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  dailyStockVideo: {
                    ...formData.dailyStockVideo,
                    isActive: e.target.checked,
                  },
                })
              }
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-charcoal-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-charcoal-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-500"></div>
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-charcoal-900 mb-1">
              Video URL (TikTok link, YouTube URL, Shorts, or MP4 video) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.dailyStockVideo?.videoUrl || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  dailyStockVideo: {
                    ...formData.dailyStockVideo,
                    videoUrl: e.target.value,
                  },
                })
              }
              placeholder="e.g. https://www.tiktok.com/@yasinlaptopslakkimarwat/video/... or https://www.youtube.com/watch?v=..."
              className="w-full px-4 py-2.5 rounded-xl bg-charcoal-50 border border-charcoal-200 text-xs text-charcoal-950 focus:outline-none focus:border-brand-500 font-mono text-[11px]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-charcoal-900 mb-1">
              Video Title
            </label>
            <input
              type="text"
              value={formData.dailyStockVideo?.title || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  dailyStockVideo: {
                    ...formData.dailyStockVideo,
                    title: e.target.value,
                  },
                })
              }
              placeholder="e.g. Today's Fresh Stock Arrival"
              className="w-full px-4 py-2.5 rounded-xl bg-charcoal-50 border border-charcoal-200 text-xs text-charcoal-950 focus:outline-none focus:border-brand-500 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-charcoal-900 mb-1">
              Button Text on Hero Banner
            </label>
            <input
              type="text"
              value={formData.dailyStockVideo?.buttonText || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  dailyStockVideo: {
                    ...formData.dailyStockVideo,
                    buttonText: e.target.value,
                  },
                })
              }
              placeholder="Watch Daily Stock Video"
              className="w-full px-4 py-2.5 rounded-xl bg-charcoal-50 border border-charcoal-200 text-xs text-charcoal-950 focus:outline-none focus:border-brand-500 font-medium"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-charcoal-900 mb-1">
              Video Description / Stock Notes
            </label>
            <textarea
              rows={2}
              value={formData.dailyStockVideo?.description || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  dailyStockVideo: {
                    ...formData.dailyStockVideo,
                    description: e.target.value,
                  },
                })
              }
              placeholder="e.g. Today's arrival includes HP EliteBooks, Dell Latitudes, and Lenovo ThinkPads with original chargers."
              className="w-full px-4 py-2.5 rounded-xl bg-charcoal-50 border border-charcoal-200 text-xs text-charcoal-950 focus:outline-none focus:border-brand-500 resize-none font-medium"
            />
          </div>
        </div>
      </div>

      {/* 2. STORE IDENTITY */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-charcoal-200/90 shadow-soft space-y-4">
        <h2 className="text-sm font-black text-charcoal-950 uppercase tracking-wider">
          2. Brand Identity
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-charcoal-900 mb-1">Business Name</label>
            <input
              type="text"
              required
              value={formData.businessName}
              onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-charcoal-50 border border-charcoal-200 text-xs text-charcoal-950 focus:outline-none focus:border-brand-500 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-charcoal-900 mb-1">Owner Name</label>
            <input
              type="text"
              required
              value={formData.ownerName}
              onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-charcoal-50 border border-charcoal-200 text-xs text-charcoal-950 focus:outline-none focus:border-brand-500 font-medium"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-charcoal-900 mb-1">Store Tagline</label>
            <input
              type="text"
              value={formData.tagline || ''}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-charcoal-50 border border-charcoal-200 text-xs text-charcoal-950 focus:outline-none focus:border-brand-500 font-medium"
            />
          </div>
        </div>
      </div>

      {/* 3. DIRECT CONTACT CHANNELS */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-charcoal-200/90 shadow-soft space-y-4">
        <h2 className="text-sm font-black text-charcoal-950 uppercase tracking-wider">
          3. Direct Customer Channels (WhatsApp &amp; Phone)
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-charcoal-900 mb-1">
              WhatsApp Number (e.g. +923XXXXXXXXX)
            </label>
            <input
              type="text"
              value={formData.whatsappNumber || ''}
              onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
              placeholder="+923427709129"
              className="w-full px-4 py-2.5 rounded-xl bg-charcoal-50 border border-charcoal-200 text-xs text-emerald-700 font-bold focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-charcoal-900 mb-1">
              Store Phone Number
            </label>
            <input
              type="text"
              value={formData.phoneNumber || ''}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              placeholder="03427709129"
              className="w-full px-4 py-2.5 rounded-xl bg-charcoal-50 border border-charcoal-200 text-xs text-charcoal-950 focus:outline-none focus:border-brand-500 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-charcoal-900 mb-1">
              Contact Email
            </label>
            <input
              type="email"
              value={formData.email || ''}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="contact@yasinlaptophub.com"
              className="w-full px-4 py-2.5 rounded-xl bg-charcoal-50 border border-charcoal-200 text-xs text-charcoal-950 focus:outline-none focus:border-brand-500 font-medium"
            />
          </div>
        </div>
      </div>

      {/* 4. SOCIAL MEDIA PROFILES */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-charcoal-200/90 shadow-soft space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-brand-100 border border-brand-300 text-brand-900 flex items-center justify-center shadow-xs">
            <Share2 className="w-5 h-5" />
          </div>
          <h2 className="text-sm font-black text-charcoal-950 uppercase tracking-wider">
            4. Social Media Channels (TikTok, Instagram, YouTube)
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-charcoal-900 mb-1">
              TikTok Profile URL
            </label>
            <input
              type="text"
              value={formData.socialLinks?.tiktok || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  socialLinks: { ...formData.socialLinks, tiktok: e.target.value },
                })
              }
              placeholder="https://www.tiktok.com/@yasinlaptopslakkimarwat"
              className="w-full px-4 py-2.5 rounded-xl bg-charcoal-50 border border-charcoal-200 text-xs text-charcoal-950 focus:outline-none focus:border-brand-500 font-mono text-[11px]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-charcoal-900 mb-1">
              Instagram Profile URL
            </label>
            <input
              type="text"
              value={formData.socialLinks?.instagram || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  socialLinks: { ...formData.socialLinks, instagram: e.target.value },
                })
              }
              placeholder="https://www.instagram.com/yasinwahab6"
              className="w-full px-4 py-2.5 rounded-xl bg-charcoal-50 border border-charcoal-200 text-xs text-charcoal-950 focus:outline-none focus:border-brand-500 font-mono text-[11px]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-charcoal-900 mb-1">
              YouTube Channel URL (Optional)
            </label>
            <input
              type="text"
              value={formData.socialLinks?.youtube || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  socialLinks: { ...formData.socialLinks, youtube: e.target.value },
                })
              }
              placeholder="https://www.youtube.com/@..."
              className="w-full px-4 py-2.5 rounded-xl bg-charcoal-50 border border-charcoal-200 text-xs text-charcoal-950 focus:outline-none focus:border-brand-500 font-mono text-[11px]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-charcoal-900 mb-1">
              Facebook Page URL (Optional)
            </label>
            <input
              type="text"
              value={formData.socialLinks?.facebook || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  socialLinks: { ...formData.socialLinks, facebook: e.target.value },
                })
              }
              placeholder="https://facebook.com/..."
              className="w-full px-4 py-2.5 rounded-xl bg-charcoal-50 border border-charcoal-200 text-xs text-charcoal-950 focus:outline-none focus:border-brand-500 font-mono text-[11px]"
            />
          </div>
        </div>
      </div>

      {/* 5. PHYSICAL STORE LOCATIONS (LAKKI MARWAT, PESHAWAR, SARGODHA) */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-brand-100 border border-brand-300 text-brand-900 flex items-center justify-center shadow-xs">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-black text-charcoal-950 uppercase tracking-wider">
              5. Physical Store Locations (3 Branches: Lakki Marwat, Peshawar, Sargodha)
            </h2>
            <p className="text-xs text-charcoal-500 font-medium">
              Configure addresses, phone numbers, WhatsApp, store timings, and Google Maps pin URLs for each branch.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {(formData.branches || DEFAULT_SETTINGS_BRANCHES).map((branch, index) => (
            <div
              key={branch.id || index}
              className={`p-6 sm:p-8 rounded-3xl bg-white border shadow-soft space-y-5 ${
                branch.isMain ? 'border-brand-400 ring-2 ring-brand-300/30' : 'border-charcoal-200/90'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-charcoal-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-brand-50 border border-brand-200 text-brand-900 flex items-center justify-center font-bold text-xs">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-charcoal-950">
                      {branch.name}
                    </h3>
                    <p className="text-[11px] text-charcoal-500 font-medium">
                      {branch.city}, {branch.province}
                    </p>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-3 py-1 rounded-full border self-start sm:self-auto ${
                    branch.isMain
                      ? 'bg-brand-500 text-charcoal-950 border-brand-600'
                      : 'bg-charcoal-100 text-charcoal-700 border-charcoal-200'
                  }`}
                >
                  {branch.tag || `${branch.city} Branch`}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-charcoal-900 mb-1">
                    Branch Full Name / Title
                  </label>
                  <input
                    type="text"
                    value={branch.name}
                    onChange={(e) => {
                      const updated = [...(formData.branches || DEFAULT_SETTINGS_BRANCHES)];
                      updated[index] = { ...updated[index], name: e.target.value };
                      setFormData({ ...formData, branches: updated });
                    }}
                    className="w-full px-4 py-2.5 rounded-xl bg-charcoal-50 border border-charcoal-200 text-xs text-charcoal-950 focus:outline-none focus:border-brand-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal-900 mb-1">
                    Badge / Tag Label
                  </label>
                  <input
                    type="text"
                    value={branch.tag}
                    onChange={(e) => {
                      const updated = [...(formData.branches || DEFAULT_SETTINGS_BRANCHES)];
                      updated[index] = { ...updated[index], tag: e.target.value };
                      setFormData({ ...formData, branches: updated });
                    }}
                    placeholder="e.g. Main Store / Regional Branch"
                    className="w-full px-4 py-2.5 rounded-xl bg-charcoal-50 border border-charcoal-200 text-xs text-charcoal-950 focus:outline-none focus:border-brand-500 font-medium"
                  />
                </div>

                <div className="sm:col-span-2 lg:col-span-3">
                  <label className="block text-xs font-bold text-charcoal-900 mb-1">
                    Full Street Address
                  </label>
                  <input
                    type="text"
                    value={branch.address}
                    onChange={(e) => {
                      const updated = [...(formData.branches || DEFAULT_SETTINGS_BRANCHES)];
                      updated[index] = { ...updated[index], address: e.target.value };
                      setFormData({ ...formData, branches: updated });
                    }}
                    className="w-full px-4 py-2.5 rounded-xl bg-charcoal-50 border border-charcoal-200 text-xs text-charcoal-950 focus:outline-none focus:border-brand-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal-900 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={branch.city}
                    onChange={(e) => {
                      const updated = [...(formData.branches || DEFAULT_SETTINGS_BRANCHES)];
                      updated[index] = { ...updated[index], city: e.target.value };
                      setFormData({ ...formData, branches: updated });
                    }}
                    className="w-full px-4 py-2.5 rounded-xl bg-charcoal-50 border border-charcoal-200 text-xs text-charcoal-950 focus:outline-none focus:border-brand-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal-900 mb-1">
                    Province
                  </label>
                  <input
                    type="text"
                    value={branch.province}
                    onChange={(e) => {
                      const updated = [...(formData.branches || DEFAULT_SETTINGS_BRANCHES)];
                      updated[index] = { ...updated[index], province: e.target.value };
                      setFormData({ ...formData, branches: updated });
                    }}
                    className="w-full px-4 py-2.5 rounded-xl bg-charcoal-50 border border-charcoal-200 text-xs text-charcoal-950 focus:outline-none focus:border-brand-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal-900 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={branch.phone}
                    onChange={(e) => {
                      const updated = [...(formData.branches || DEFAULT_SETTINGS_BRANCHES)];
                      updated[index] = { ...updated[index], phone: e.target.value };
                      setFormData({ ...formData, branches: updated });
                    }}
                    placeholder="03427709129"
                    className="w-full px-4 py-2.5 rounded-xl bg-charcoal-50 border border-charcoal-200 text-xs text-charcoal-950 focus:outline-none focus:border-brand-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal-900 mb-1">
                    WhatsApp Number
                  </label>
                  <input
                    type="text"
                    value={branch.whatsapp}
                    onChange={(e) => {
                      const updated = [...(formData.branches || DEFAULT_SETTINGS_BRANCHES)];
                      updated[index] = { ...updated[index], whatsapp: e.target.value };
                      setFormData({ ...formData, branches: updated });
                    }}
                    placeholder="+923427709129"
                    className="w-full px-4 py-2.5 rounded-xl bg-charcoal-50 border border-charcoal-200 text-xs text-emerald-700 font-bold focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-charcoal-900 mb-1">
                    Operating / Store Timings
                  </label>
                  <input
                    type="text"
                    value={branch.timings}
                    onChange={(e) => {
                      const updated = [...(formData.branches || DEFAULT_SETTINGS_BRANCHES)];
                      updated[index] = { ...updated[index], timings: e.target.value };
                      setFormData({ ...formData, branches: updated });
                    }}
                    placeholder="Monday – Saturday: 9:00 AM – 9:00 PM"
                    className="w-full px-4 py-2.5 rounded-xl bg-charcoal-50 border border-charcoal-200 text-xs text-charcoal-950 focus:outline-none focus:border-brand-500 font-medium"
                  />
                </div>

                <div className="sm:col-span-2 lg:col-span-3">
                  <label className="block text-xs font-bold text-charcoal-900 mb-1">
                    Google Maps Pin URL
                  </label>
                  <input
                    type="text"
                    value={branch.mapsUrl || ''}
                    onChange={(e) => {
                      const updated = [...(formData.branches || DEFAULT_SETTINGS_BRANCHES)];
                      updated[index] = { ...updated[index], mapsUrl: e.target.value };
                      setFormData({ ...formData, branches: updated });
                    }}
                    placeholder="https://maps.google.com/?q=..."
                    className="w-full px-4 py-2.5 rounded-xl bg-charcoal-50 border border-charcoal-200 text-xs text-charcoal-950 focus:outline-none focus:border-brand-500 font-medium text-[11px]"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. DANGER ZONE: CLEAR & RESET INVENTORY */}
      <div className="p-6 sm:p-8 rounded-3xl bg-rose-50/60 border border-rose-200 shadow-soft space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-rose-700 font-black text-sm uppercase tracking-wider">
              <Trash2 className="w-4 h-4" />
              <span>Database Maintenance: Wipe Old Test Inventory</span>
            </div>
            <p className="text-xs text-rose-800/80 font-medium max-w-xl">
              Permanently delete all existing laptop products and accessories from the database so you can start fresh. Your store settings, admin accounts, and categories will be kept safe.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClearInventory}
            disabled={isClearing}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm transition-all hover:scale-105 active:scale-95 disabled:opacity-50 shrink-0"
          >
            {isClearing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Clearing Database...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>Clear All Products &amp; Accessories</span>
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
