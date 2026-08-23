'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Play, MessageCircle, ArrowRight, ShieldCheck, CheckCircle2, Award, Sparkles } from 'lucide-react';
import { StockVideoModal } from './StockVideoModal';
import { settingsService } from '@/services/settingsService';
import { DEFAULT_BUSINESS_CONFIG } from '@/lib/business-config';
import { sanitizeWhatsAppNumber } from '@/lib/formatters';

interface HeroSlide {
  id: number;
  desktopImage: string;
  mobileImage: string;
  link: string;
  tag: string;
  model: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 1,
    desktopImage: '/image/L-hero-1.jpg',
    mobileImage: '/image/m-hero-1.jpg',
    link: '/laptops',
    tag: 'Premium Business Line',
    model: 'HP EliteBook Series',
  },
  {
    id: 2,
    desktopImage: '/image/L-hero-2.jpg',
    mobileImage: '/image/m-hero-2.jpg',
    link: '/laptops?category=business-laptops',
    tag: 'Student & Enterprise',
    model: 'Dell Latitude & XPS',
  },
  {
    id: 3,
    desktopImage: '/image/L-hero-3.jpg',
    mobileImage: '/image/m-hero-3.jpg',
    link: '/chromebooks',
    tag: 'Fast & Budget Friendly',
    model: 'Lenovo ThinkPad & Chromebooks',
  },
];

interface HeroProps {
  mode?: string;
  videoUrl?: string;
}

export const Hero: React.FC<HeroProps> = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [videoConfig, setVideoConfig] = useState<{
    title?: string;
    videoUrl?: string;
    description?: string;
    isActive?: boolean;
    buttonText?: string;
  }>({
    title: "Today's Fresh Stock Arrival",
    videoUrl: '',
    description: 'Check out our fresh container stock arrival with 1-month warranty in Lakki Marwat, Peshawar & Sargodha.',
    isActive: true,
    buttonText: 'Watch Daily Stock Video',
  });
  const [whatsappNumber, setWhatsappNumber] = useState(
    DEFAULT_BUSINESS_CONFIG.whatsappNumber || '+923427709129'
  );

  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    settingsService
      .getSettings()
      .then((res) => {
        if (res.success && res.data) {
          if (res.data.dailyStockVideo) {
            setVideoConfig((prev) => ({
              ...prev,
              ...res.data?.dailyStockVideo,
            }));
          }
          if (res.data.whatsappNumber) {
            setWhatsappNumber(res.data.whatsappNumber);
          }
        }
      })
      .catch(() => {});
  }, []);

  // Auto-advance slides every 3.5 seconds
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 3500);

    return () => clearInterval(timer);
  }, [isPaused]);

  const cleanNumber = sanitizeWhatsAppNumber(whatsappNumber);
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(
    'Assalam o Alaikum, I would like to check available laptop stock at Yasin Laptop Hub.'
  )}`;

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (diff > 45) {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    } else if (diff < -45) {
      setCurrentSlide((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1));
    }
    touchStartX.current = null;
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-brand-50/70 via-white to-warm-bg border-b border-charcoal-200/80">
      {/* Background Ambience */}
      <div className="absolute top-0 right-1/4 w-72 h-72 sm:w-96 sm:h-96 bg-brand-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-6 space-y-4 sm:space-y-6 text-center lg:text-left">
            {/* Small Brand Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-100/90 text-brand-900 border border-brand-300 text-[11px] sm:text-xs font-bold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-brand-800" />
              <span>Lakki Marwat • Peshawar • Sargodha</span>
            </div>

            {/* Primary Heading */}
            <div className="space-y-1.5 sm:space-y-2">
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-charcoal-950 tracking-tight leading-[1.15]">
                Find Your Perfect <span className="text-brand-700">Laptop</span>
              </h1>
              <p className="text-xs sm:text-base text-charcoal-600 font-medium max-w-lg mx-auto lg:mx-0 leading-relaxed">
                Quality business laptops, Chromebooks &amp; accessories across our branches in Lakki Marwat, Peshawar, and Sargodha with nationwide delivery &amp; 1-month warranty.
              </p>
            </div>

            {/* Quick Trust Badges (Compact) */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 sm:gap-3 text-[11px] sm:text-xs font-bold text-charcoal-800">
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-charcoal-200/90 shadow-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>100% Tested</span>
              </div>
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-charcoal-200/90 shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>1-Month Warranty</span>
              </div>
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-charcoal-200/90 shadow-xs">
                <Award className="w-3.5 h-3.5 text-brand-700" />
                <span>Original Charger</span>
              </div>
            </div>

            {/* Hero CTA Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-2.5 pt-1">
              <Link
                href="/laptops"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-charcoal-950 font-bold text-xs sm:text-sm shadow-sm transition-all hover:scale-105 active:scale-95 min-h-[44px]"
              >
                <span>Explore Laptops</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs sm:text-sm shadow-sm transition-all hover:scale-105 active:scale-95 min-h-[44px]"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp (+92 342 7709129)</span>
              </a>
            </div>

            {/* Daily Stock Video Button */}
            {videoConfig.isActive && (
              <div className="pt-0.5">
                <button
                  type="button"
                  onClick={() => setIsVideoModalOpen(true)}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white hover:bg-charcoal-50 text-charcoal-800 border border-charcoal-200/90 text-xs font-bold shadow-xs transition-colors group"
                >
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
                  </span>
                  <span>{videoConfig.buttonText || 'Watch Daily Stock Video'}</span>
                  <Play className="w-3 h-3 text-rose-500 fill-rose-500 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            )}
          </div>

          {/* Right Product Image Slideshow */}
          <div className="lg:col-span-6">
            <div
              className="relative w-full aspect-[16/10] sm:aspect-[16/10] max-h-[300px] sm:max-h-[380px] rounded-3xl bg-white border border-charcoal-200/90 shadow-soft overflow-hidden group select-none"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {HERO_SLIDES.map((slide, idx) => (
                <div
                  key={slide.id}
                  className={`absolute inset-0 transition-opacity duration-700 ease-in-out flex items-center justify-center p-3 sm:p-6 ${
                    idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={slide.desktopImage}
                    alt={slide.tag}
                    width={600}
                    height={380}
                    className="w-full h-full object-contain drop-shadow-md transition-transform duration-500 group-hover:scale-105"
                    loading={idx === 0 ? 'eager' : 'lazy'}
                    decoding="async"
                    {...(idx === 0 ? { fetchPriority: 'high' } : {})}
                  />

                  {/* Slide Label Badge */}
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/95 border border-charcoal-200 text-[11px] font-bold text-charcoal-900 backdrop-blur-xs shadow-xs">
                    {slide.tag}
                  </div>
                </div>
              ))}

              {/* Prev / Next Arrows */}
              <button
                type="button"
                onClick={() => setCurrentSlide((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1))}
                aria-label="Previous laptop slide"
                className="absolute left-2.5 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-white/90 border border-charcoal-200 text-charcoal-800 hover:bg-white transition-all opacity-0 group-hover:opacity-100 z-20 shadow-sm"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)}
                aria-label="Next laptop slide"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-white/90 border border-charcoal-200 text-charcoal-800 hover:bg-white transition-all opacity-0 group-hover:opacity-100 z-20 shadow-sm"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Dot Indicators */}
              <div className="absolute bottom-2.5 inset-x-0 flex items-center justify-center gap-1.5 z-20">
                {HERO_SLIDES.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentSlide(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      idx === currentSlide
                        ? 'w-6 bg-brand-500 shadow-xs'
                        : 'w-1.5 bg-charcoal-300 hover:bg-charcoal-400'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Stock Video Modal */}
      {isVideoModalOpen && (
        <StockVideoModal
          isOpen={isVideoModalOpen}
          onClose={() => setIsVideoModalOpen(false)}
          videoUrl={videoConfig.videoUrl}
          title={videoConfig.title}
          description={videoConfig.description}
          whatsappNumber={whatsappNumber}
        />
      )}
    </div>
  );
};
