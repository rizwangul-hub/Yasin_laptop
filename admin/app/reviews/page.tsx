'use client';

import React, { useState, useEffect } from 'react';
import { adminApiClient } from '@/lib/api-client';
import {
  Star,
  Plus,
  Edit,
  Trash2,
  Check,
  AlertCircle,
  Loader2,
  Video,
  Play,
  X,
  MessageSquare,
  ShieldCheck,
} from 'lucide-react';

interface IReview {
  _id: string;
  customerName: string;
  city: string;
  laptopPurchased?: string;
  rating: number;
  comment: string;
  videoUrl?: string;
  verifiedPurchase: boolean;
  isFeatured: boolean;
  createdAt: string;
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    customerName: '',
    city: 'Lakki Marwat',
    laptopPurchased: '',
    rating: 5,
    comment: '',
    videoUrl: '',
    verifiedPurchase: true,
    isFeatured: true,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const loadReviews = async () => {
    setIsLoading(true);
    try {
      const res = await adminApiClient<IReview[]>('/reviews');
      if (res.success && res.data) {
        setReviews(res.data);
      }
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setFormData({
      customerName: '',
      city: 'Lakki Marwat',
      laptopPurchased: '',
      rating: 5,
      comment: '',
      videoUrl: '',
      verifiedPurchase: true,
      isFeatured: true,
    });
    setError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (r: IReview) => {
    setEditingId(r._id);
    setFormData({
      customerName: r.customerName,
      city: r.city,
      laptopPurchased: r.laptopPurchased || '',
      rating: r.rating,
      comment: r.comment,
      videoUrl: r.videoUrl || '',
      verifiedPurchase: r.verifiedPurchase,
      isFeatured: r.isFeatured,
    });
    setError(null);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      const endpoint = editingId ? `/reviews/${editingId}` : '/reviews';
      const method = editingId ? 'PUT' : 'POST';

      const res = await adminApiClient(endpoint, {
        method,
        body: JSON.stringify(formData),
      });

      if (res.success) {
        setIsModalOpen(false);
        setSuccessMsg(editingId ? 'Review updated successfully!' : 'Review created successfully!');
        setTimeout(() => setSuccessMsg(null), 3000);
        loadReviews();
      } else {
        setError(res.message || 'Failed to save review');
      }
    } catch {
      setError('Connection failure while saving review');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete the review by "${name}"?`)) return;

    try {
      const res = await adminApiClient(`/reviews/${id}`, { method: 'DELETE' });
      if (res.success) {
        setSuccessMsg('Review deleted successfully!');
        setTimeout(() => setSuccessMsg(null), 3000);
        loadReviews();
      }
    } catch {
      setError('Failed to delete review');
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Star className="w-7 h-7 text-amber-400 fill-amber-400" />
            <span>Customer Reviews &amp; Video Testimonials</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Manage customer feedback, star ratings, and unboxing video testimonials.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs shadow-md shadow-brand-600/30 transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>Add Customer Review</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-800 text-xs text-emerald-300 flex items-center gap-2">
          <Check className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-800 text-xs text-rose-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Reviews Grid */}
      {isLoading ? (
        <div className="py-20 text-center text-xs text-slate-400">Loading customer reviews...</div>
      ) : reviews.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <MessageSquare className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No Customer Reviews Yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Click &quot;Add Customer Review&quot; above to create your first customer review or video testimonial.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((r) => (
            <div
              key={r._id}
              className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  {/* Star rating */}
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < r.rating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-700 fill-slate-700'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Video Badge */}
                  {r.videoUrl && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[11px] font-semibold border border-rose-500/30">
                      <Video className="w-3 h-3" />
                      <span>Video Review</span>
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-slate-300 italic leading-relaxed">
                  &quot;{r.comment}&quot;
                </p>

                <div className="pt-2 border-t border-slate-800/80">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>{r.customerName}</span>
                    {r.verifiedPurchase && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Verified
                      </span>
                    )}
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    {r.city} {r.laptopPurchased ? `• Bought: ${r.laptopPurchased}` : ''}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800/60">
                <button
                  onClick={() => openEditModal(r)}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-xs flex items-center gap-1.5"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(r._id, r.customerName)}
                  className="p-2 rounded-lg bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 hover:text-white transition-colors text-xs flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
              <h3 className="text-sm font-bold text-white">
                {editingId ? 'Edit Customer Review' : 'Add Customer Review & Video'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Customer Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    placeholder="e.g. Engr. Muhammad Tariq"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Customer City
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="e.g. Lakki Marwat, Bannu, Peshawar"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Laptop Model Purchased
                  </label>
                  <input
                    type="text"
                    value={formData.laptopPurchased}
                    onChange={(e) => setFormData({ ...formData, laptopPurchased: e.target.value })}
                    placeholder="e.g. HP EliteBook 840 G6 (Core i5 8th Gen)"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Star Rating (1 - 5)
                  </label>
                  <select
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-brand-500"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5 Stars - Excellent)</option>
                    <option value={4}>⭐⭐⭐⭐ (4 Stars - Good)</option>
                    <option value={3}>⭐⭐⭐ (3 Stars - Average)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Customer Video URL (TikTok, YouTube, Shorts, or MP4)
                  </label>
                  <input
                    type="text"
                    value={formData.videoUrl}
                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                    placeholder="e.g. https://www.tiktok.com/@... or https://youtube.com/..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-brand-500 font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Customer Feedback / Review <span className="text-rose-400">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.comment}
                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                    placeholder="Write customer feedback regarding laptop performance, battery health, checking warranty, and delivery..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-brand-500 resize-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-6 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs shadow-md shadow-brand-600/30 disabled:opacity-50"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  <span>Save Review</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
