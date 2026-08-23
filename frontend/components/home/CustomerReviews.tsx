'use client';

import React, { useState, useEffect } from 'react';
import { Star, ShieldCheck, Play, Video, MessageCircle, Quote } from 'lucide-react';
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

  if (!isLoading && reviews.length === 0) {
    return null;
  }

  const cleanNum = sanitizeWhatsAppNumber(DEFAULT_BUSINESS_CONFIG.whatsappNumber);
  const whatsappFeedbackUrl = `https://wa.me/${cleanNum}?text=${encodeURIComponent(
    'Assalam o Alaikum, I bought a laptop from Yasin Laptop Hub and would like to share my feedback / video review.'
  )}`;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <span>Verified Customer Feedback</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <span>Customer Reviews &amp; Video Testimonials</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            Real reviews from doctors, engineers, university students, and freelancers who bought verified laptops from Yasin Laptop Hub.
          </p>
        </div>

        <a
          href={whatsappFeedbackUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-200 text-xs font-semibold transition-all hover:scale-105 self-start sm:self-auto shrink-0 shadow-md"
        >
          <MessageCircle className="w-4 h-4 text-emerald-400" />
          <span>Share Your Feedback</span>
        </a>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {reviews.map((r) => (
          <div
            key={r._id}
            className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4 relative group/card"
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
                          : 'text-slate-700 fill-slate-700'
                      }`}
                    />
                  ))}
                </div>

                {r.videoUrl && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-semibold border border-rose-500/30">
                    <Video className="w-3 h-3" />
                    <span>Video</span>
                  </span>
                )}
              </div>

              {/* Review Text */}
              <p className="text-xs sm:text-sm text-slate-300 italic leading-relaxed line-clamp-4">
                &quot;{r.comment}&quot;
              </p>
            </div>

            {/* Bottom Customer Info & Video Button */}
            <div className="pt-3 border-t border-slate-800/80 space-y-3">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <span>{r.customerName}</span>
                  {r.verifiedPurchase && (
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  )}
                </h4>
                <p className="text-[11px] text-slate-400">
                  {r.city} • <span className="text-brand-400">{r.laptopPurchased || 'Laptop Buyer'}</span>
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
                  className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/50 text-rose-300 text-xs font-semibold transition-all hover:scale-[1.02]"
                >
                  <Play className="w-3.5 h-3.5 fill-rose-300" />
                  <span>Watch Video Review</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

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
    </section>
  );
};
