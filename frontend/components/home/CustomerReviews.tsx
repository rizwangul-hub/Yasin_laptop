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
          <div className="flex items-center gap-2 text-brand-700 text-xs font-bold uppercase tracking-wider mb-1">
            <Star className="w-3.5 h-3.5 fill-brand-500 text-brand-500" />
            <span>Verified Customer Feedback</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-charcoal-950 tracking-tight flex items-center gap-2.5">
            <span>Customer Reviews &amp; Video Testimonials</span>
          </h2>
          <p className="text-xs sm:text-sm text-charcoal-500 mt-1 max-w-xl font-medium">
            Real feedback from verified buyers across Lakki Marwat, Bannu, Peshawar and all over Pakistan.
          </p>
        </div>

        <a
          href={whatsappFeedbackUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-charcoal-50 border border-charcoal-200 text-charcoal-800 text-xs font-bold transition-all hover:scale-105 self-start sm:self-auto shrink-0 shadow-soft"
        >
          <MessageCircle className="w-4 h-4 text-emerald-600" />
          <span>Share Your Feedback</span>
        </a>
      </div>

      {/* Reviews Grid */}
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
