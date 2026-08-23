'use client';

import React, { useEffect } from 'react';
import { X, MessageCircle, Play, Sparkles, Laptop, ShieldCheck } from 'lucide-react';
import { sanitizeWhatsAppNumber } from '@/lib/formatters';

interface StockVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl?: string;
  title?: string;
  description?: string;
  whatsappNumber?: string;
}

export const StockVideoModal: React.FC<StockVideoModalProps> = ({
  isOpen,
  onClose,
  videoUrl,
  title = "Today's Fresh Stock Arrival",
  description = 'Check out our fresh container stock arrival with 1-month warranty in Lakki Marwat.',
  whatsappNumber = '923427709129',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const cleanNum = sanitizeWhatsAppNumber(whatsappNumber);
  const whatsappInquiryUrl = `https://wa.me/${cleanNum}?text=${encodeURIComponent(
    `Assalam o Alaikum, I just watched your Daily Stock Video ("${title}") and would like to inquire about the laptops available right now.`
  )}`;

  // Determine if YouTube or direct video
  const isYouTube =
    videoUrl && (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be'));

  const getYouTubeEmbedUrl = (url: string) => {
    let videoId = '';
    if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0] || '';
    } else if (url.includes('watch?v=')) {
      videoId = url.split('watch?v=')[1]?.split('&')[0] || '';
    } else if (url.includes('/embed/')) {
      videoId = url.split('/embed/')[1]?.split('?')[0] || '';
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0` : url;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/85 backdrop-blur-md animate-fade-in">
      {/* Backdrop click */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Box */}
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
            </span>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white tracking-tight flex items-center gap-2">
                <span>{title}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-semibold border border-rose-500/30">
                  DAILY STATUS VIDEO
                </span>
              </h3>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Freshly tested container stock • Main Bazaar, Lakki Marwat
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Area */}
        <div className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden">
          {videoUrl ? (
            isYouTube ? (
              <iframe
                src={getYouTubeEmbedUrl(videoUrl)}
                title={title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            ) : (
              <video
                src={videoUrl}
                controls
                autoPlay
                className="w-full h-full object-contain"
              >
                Your browser does not support the video tag.
              </video>
            )
          ) : (
            /* Graceful Fallback if admin hasn't added a video URL yet */
            <div className="text-center p-8 space-y-4 max-w-md">
              <div className="w-16 h-16 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto ring-4 ring-rose-500/10">
                <Play className="w-8 h-8 ml-1" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-white">Daily WhatsApp Status Video</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  We post live unboxing and condition testing videos daily on our WhatsApp status. Contact us directly to get live videos of any specific laptop model.
                </p>
              </div>
              <a
                href={whatsappInquiryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-950/60 transition-all hover:scale-105"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Get Daily Video on WhatsApp</span>
              </a>
            </div>
          )}
        </div>

        {/* Footer / CTA Info */}
        <div className="p-4 sm:p-6 bg-slate-950/90 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <p className="text-xs sm:text-sm text-slate-300 font-medium">{description}</p>
            <div className="flex items-center justify-center sm:justify-start gap-3 text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                1 Month Checking Warranty
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Laptop className="w-3.5 h-3.5 text-brand-400" />
                Original Chargers Included
              </span>
            </div>
          </div>

          <a
            href={whatsappInquiryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all hover:scale-105 shrink-0"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Inquire About This Stock</span>
          </a>
        </div>
      </div>
    </div>
  );
};
