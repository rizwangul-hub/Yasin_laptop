'use client';

import React, { useState, useEffect } from 'react';
import { adminApiClient } from '@/lib/api-client';
import { Settings, ShieldCheck, Check, AlertCircle, Loader2, Save, Video, PlayCircle, Share2 } from 'lucide-react';

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
  dailyStockVideo?: {
    title?: string;
    videoUrl?: string;
    thumbnailUrl?: string;
    description?: string;
    isActive?: boolean;
    buttonText?: string;
  };
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
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

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
            Control contact details, store hours, Google Maps, social media, and daily stock videos.
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

      {/* 1. DAILY STOCK VIDEO & STATUS SHOWCASE */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-brand-500/30 space-y-4 shadow-xl shadow-brand-950/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center">
              <PlayCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Daily Stock Video Showcase (Hero Section Button)
              </h2>
              <p className="text-xs text-slate-400">
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
            <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Video URL (TikTok link, YouTube URL, Shorts, or MP4 video) <span className="text-rose-400">*</span>
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
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-brand-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
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
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
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
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-300 mb-1">
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
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-brand-500 resize-none"
            />
          </div>
        </div>
      </div>

      {/* 2. STORE IDENTITY */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider">
          2. Brand Identity
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

      {/* 3. DIRECT CONTACT CHANNELS */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider">
          3. Direct Customer Channels (WhatsApp &amp; Phone)
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

      {/* 4. SOCIAL MEDIA PROFILES */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-pink-500/20 text-pink-400 flex items-center justify-center">
            <Share2 className="w-5 h-5" />
          </div>
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            4. Social Media Channels (TikTok, Instagram, YouTube)
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
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
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-brand-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
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
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-brand-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
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
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-brand-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
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
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-brand-500 font-mono"
            />
          </div>
        </div>
      </div>

      {/* 5. PHYSICAL STORE LOCATION */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider">
          5. Physical Store Address (Lakki Marwat, KPK)
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Street / Area</label>
            <input
              type="text"
              value={formData.address.street}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  address: { ...formData.address, street: e.target.value },
                })
              }
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">City</label>
            <input
              type="text"
              value={formData.address.city}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  address: { ...formData.address, city: e.target.value },
                })
              }
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Province</label>
            <input
              type="text"
              value={formData.address.province}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  address: { ...formData.address, province: e.target.value },
                })
              }
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="sm:col-span-3">
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Google Maps Pin URL
            </label>
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
