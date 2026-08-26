'use client';

import React, { useState, useEffect } from 'react';
import { Star, ShieldCheck, Play, Video, MessageCircle, Plus, X, Check, Loader2, AlertCircle, Quote } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { StockVideoModal } from '../hero/StockVideoModal';
import { sanitizeWhatsAppNumber } from '@/lib/formatters';
import { DEFAULT_BUSINESS_CONFIG } from '@/lib/business-config';

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

export const CustomerReviews: React.FC = () => {
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<{
    url: string;
    title: string;
    description: string;
  } | null>(null);

  // Leave a Review modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formName, setFormName] = useState('');
  const [formCity, setFormCity] = useState('');
  const [formLaptop, setFormLaptop] = useState('');
  const [formRating, setFormRating] = useState(5);
  const [formComment, setFormComment] = useState('');
  const [formVideoUrl, setFormVideoUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    apiClient<IReview[]>('/reviews')
      .then((res) => {
        if (res.success && res.data) {
          const raw = res.data as unknown;
          if (Array.isArray(raw)) {
            setReviews(raw as IReview[]);
          }
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const cleanNum = sanitizeWhatsAppNumber(DEFAULT_BUSINESS_CONFIG.whatsappNumber);
  const whatsappFeedbackUrl = `https://wa.me/${cleanNum}?text=${encodeURIComponent(
    'Assalam o Alaikum, I bought a laptop from Yasin Laptop Hub and would like to share my feedback / video review.'
  )}`;

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formComment.trim()) {
      setErrorMsg('Please enter your name and review feedback.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await apiClient<IReview>('/reviews', {
        method: 'POST',
        body: JSON.stringify({
          customerName: formName.trim(),
          city: formCity.trim() || 'Lakki Marwat',
          laptopPurchased: formLaptop.trim() || 'Laptop Buyer',
          rating: formRating,
          comment: formComment.trim(),
          videoUrl: formVideoUrl.trim(),
          verifiedPurchase: true,
          isFeatured: true,
        }),
      });

      if (res.success && res.data) {
        const newReview = res.data;
        // Automatically add to local reviews list immediately
        setReviews((prev) => [newReview, ...prev]);
        setSuccessMsg('Thank you! Your review has been submitted and added successfully.');
        setFormName('');
        setFormCity('');
        setFormLaptop('');
        setFormRating(5);
        setFormComment('');
        setFormVideoUrl('');
        setTimeout(() => {
          setIsModalOpen(false);
          setSuccessMsg(null);
        }, 2000);
      } else {
        setErrorMsg(res.message || 'Failed to submit review. Please try again.');
      }
    } catch {
      setErrorMsg('Connection error while submitting review.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 gap-4">
        <div>
          <div className="flex items-center gap-2 text-brand-700 text-xs font-bold uppercase tracking-wider mb-1">
            <Star className="w-3.5 h-3.5 fill-brand-500 text-brand-500" />
            <span>Verified Customer Feedback</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-charcoal-950 tracking-tight flex items-center gap-2.5">
            <span>Customer Reviews &amp; Video Testimonials</span>
          </h2>
          <p className="text-xs sm:text-sm text-charcoal-500 mt-1 max-w-xl font-medium">
            Real feedback from verified buyers across Lakki Marwat, Bannu, Peshawar, Sargodha and all over Pakistan.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto shrink-0">
          <button
            type="button"
            onClick={() => {
              setIsModalOpen(true);
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-charcoal-950 text-xs font-bold transition-all hover:scale-105 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>+ Write a Review</span>
          </button>

          <a
            href={whatsappFeedbackUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-charcoal-50 border border-charcoal-200 text-charcoal-800 text-xs font-bold transition-all hover:scale-105 shadow-soft"
          >
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            <span>WhatsApp Review</span>
          </a>
        </div>
      </div>

      {/* Reviews Grid */}
      {isLoading ? (
        <div className="py-12 text-center text-xs text-charcoal-400 font-medium">
          Loading customer reviews...
        </div>
      ) : reviews.length === 0 ? (
        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-charcoal-200 text-center space-y-4 shadow-soft">
          <Quote className="w-10 h-10 text-brand-500/40 mx-auto" />
          <h3 className="text-lg font-black text-charcoal-950">Be the First to Leave a Review!</h3>
          <p className="text-xs text-charcoal-500 max-w-md mx-auto font-medium">
            Have you purchased a laptop or accessory from Yasin Laptop Hub? Share your feedback with us!
          </p>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-charcoal-950 text-xs font-bold transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Write a Customer Review</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((r) => (
            <div
              key={r._id}
              className="p-6 rounded-3xl bg-white border border-charcoal-200/90 shadow-soft hover:shadow-soft-md hover:border-brand-400/80 transition-all flex flex-col justify-between space-y-4 relative group/card"
            >
              {/* Top Stars & Video Badge */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < r.rating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-charcoal-200 fill-charcoal-200'
                        }`}
                      />
                    ))}
                  </div>

                  {r.videoUrl && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[10px] font-bold border border-rose-200">
                      <Video className="w-3 h-3" />
                      <span>Video</span>
                    </span>
                  )}
                </div>

                {/* Review Text */}
                <p className="text-xs sm:text-sm text-charcoal-700 italic leading-relaxed line-clamp-4 font-normal">
                  &quot;{r.comment}&quot;
                </p>
              </div>

              {/* Bottom Customer Info & Video Button */}
              <div className="pt-3 border-t border-charcoal-100 space-y-3">
                <div>
                  <h4 className="text-sm font-bold text-charcoal-950 flex items-center gap-1.5">
                    <span>{r.customerName}</span>
                    {r.verifiedPurchase && (
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    )}
                  </h4>
                  <p className="text-[11px] text-charcoal-500 font-medium">
                    {r.city} • <span className="text-brand-800 font-bold">{r.laptopPurchased || 'Laptop Buyer'}</span>
                  </p>
                </div>

                {/* Watch Video Button */}
                {r.videoUrl && (
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedVideo({
                        url: r.videoUrl!,
                        title: `Customer Video Review - ${r.customerName}`,
                        description: `${r.laptopPurchased ? `Purchased: ${r.laptopPurchased} • ` : ''}"${r.comment}"`,
                      })
                    }
                    className="w-full inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-charcoal-900 hover:bg-charcoal-800 text-white text-xs font-bold transition-all hover:scale-[1.02] shadow-xs"
                  >
                    <Play className="w-3.5 h-3.5 fill-brand-400 text-brand-400" />
                    <span>Watch Video Review</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Video Modal Popup for Customer Videos */}
      {selectedVideo && (
        <StockVideoModal
          isOpen={Boolean(selectedVideo)}
          onClose={() => setSelectedVideo(null)}
          videoUrl={selectedVideo.url}
          title={selectedVideo.title}
          description={selectedVideo.description}
          whatsappNumber={cleanNum}
        />
      )}

      {/* Write a Review Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/70 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white border border-charcoal-200 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-charcoal-200 bg-charcoal-50">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
                <h3 className="text-sm font-black text-charcoal-950 uppercase tracking-wider">
                  Write a Customer Review
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl text-charcoal-400 hover:text-charcoal-950 hover:bg-charcoal-200/60 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              {successMsg && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 font-medium">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {errorMsg && (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2 font-medium">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="review-name" className="block text-xs font-bold text-charcoal-900 mb-1">
                    Your Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="review-name"
                    name="customerName"
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Asad Khan"
                    className="w-full px-4 py-2.5 rounded-xl bg-charcoal-50 border border-charcoal-200 text-xs text-charcoal-950 focus:outline-none focus:border-brand-500 font-medium"
                  />
                </div>

                <div>
                  <label htmlFor="review-city" className="block text-xs font-bold text-charcoal-900 mb-1">
                    Your City <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="review-city"
                    name="city"
                    type="text"
                    required
                    value={formCity}
                    onChange={(e) => setFormCity(e.target.value)}
                    placeholder="e.g. Lakki Marwat, Peshawar, Sargodha"
                    className="w-full px-4 py-2.5 rounded-xl bg-charcoal-50 border border-charcoal-200 text-xs text-charcoal-950 focus:outline-none focus:border-brand-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="review-laptop" className="block text-xs font-bold text-charcoal-900 mb-1">
                  Laptop Model Purchased (Optional)
                </label>
                <input
                  id="review-laptop"
                  name="laptopPurchased"
                  type="text"
                  value={formLaptop}
                  onChange={(e) => setFormLaptop(e.target.value)}
                  placeholder="e.g. HP EliteBook 840 G6 / Dell Latitude 5410"
                  className="w-full px-4 py-2.5 rounded-xl bg-charcoal-50 border border-charcoal-200 text-xs text-charcoal-950 focus:outline-none focus:border-brand-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal-900 mb-1.5">
                  Rating <span className="text-rose-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormRating(star)}
                      className="p-1 text-amber-400 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= formRating ? 'fill-amber-400 text-amber-400' : 'text-charcoal-200 fill-charcoal-200'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-charcoal-700 ml-2">
                    {formRating} / 5 Stars
                  </span>
                </div>
              </div>

              <div>
                <label htmlFor="review-comment" className="block text-xs font-bold text-charcoal-900 mb-1">
                  Your Review / Feedback <span className="text-rose-500">*</span>
                </label>
                <textarea
                  id="review-comment"
                  name="comment"
                  required
                  rows={4}
                  value={formComment}
                  onChange={(e) => setFormComment(e.target.value)}
                  placeholder="Share your experience with product condition, battery backup, warranty, and shop service..."
                  className="w-full px-4 py-2.5 rounded-xl bg-charcoal-50 border border-charcoal-200 text-xs text-charcoal-950 focus:outline-none focus:border-brand-500 font-medium resize-none"
                />
              </div>

              <div>
                <label htmlFor="review-video" className="block text-xs font-bold text-charcoal-900 mb-1">
                  TikTok or YouTube Video Review URL (Optional)
                </label>
                <input
                  id="review-video"
                  name="videoUrl"
                  type="text"
                  value={formVideoUrl}
                  onChange={(e) => setFormVideoUrl(e.target.value)}
                  placeholder="e.g. https://www.tiktok.com/@... or https://youtube.com/..."
                  className="w-full px-4 py-2.5 rounded-xl bg-charcoal-50 border border-charcoal-200 text-xs text-charcoal-950 focus:outline-none focus:border-brand-500 font-mono text-[11px]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-charcoal-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-charcoal-100 hover:bg-charcoal-200 text-xs font-bold text-charcoal-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-charcoal-950 font-bold text-xs shadow-sm transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <span>Submit &amp; Publish Review</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
