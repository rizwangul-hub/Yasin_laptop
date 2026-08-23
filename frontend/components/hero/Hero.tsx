'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Play, MessageCircle, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
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
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 1,
    desktopImage: '/image/L-hero-1.jpg',
    mobileImage: '/image/m-hero-1.jpg',
    link: '/laptops',
    tag: 'Premium Business Laptops',
  },
  {
    id: 2,
    desktopImage: '/image/L-hero-2.jpg',
    mobileImage: '/image/m-hero-2.jpg',
    link: '/laptops?category=business-laptops',
    tag: 'HP EliteBooks & Dell Latitudes',
  },
  {
    id: 3,
    desktopImage: '/image/L-hero-3.jpg',
    mobileImage: '/image/m-hero-3.jpg',
    link: '/chromebooks',
    tag: 'Fast & Affordable Chromebooks',
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
    description: 'Check out our fresh container stock arrival with 1-month warranty in Lakki Marwat.',
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

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentSlide((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (diff > 50) {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    } else if (diff < -50) {
      setCurrentSlide((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1));
    }
    touchStartX.current = null;
  };

  const cleanNum = sanitizeWhatsAppNumber(whatsappNumber);
  const whatsappUrl = `https://wa.me/${cleanNum}?text=${encodeURIComponent(
    'Assalam o Alaikum, I am visiting Yasin Laptop Hub website and want to inquire about available laptops.'
  )}`;

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FAFAF7] via-[#F6F6F0] to-[#FAFAF7] border-b border-charcoal-200/80 pt-8 pb-12 sm:pt-12 sm:pb-16 lg:pt-16 lg:pb-20">
        {/* Subtle Warm Background Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 right-1/4 w-96 h-96 rounded-full bg-brand-200/35 blur-3xl" />
          <div className="absolute top-1/2 -left-20 w-80 h-80 rounded-full bg-brand-100/40 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-300 text-charcoal-900 text-xs font-bold shadow-xs">
                <ShieldCheck className="w-4 h-4 text-brand-700" />
                <span>Verified Laptop Store • Lakki Marwat, KPK</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-black text-charcoal-950 tracking-tight leading-[1.12]">
                Find the Right Laptop{' '}
                <span className="relative inline-block">
                  <span className="relative z-10 text-charcoal-950">for Your Work &amp; Life</span>
                  <span className="absolute bottom-1 sm:bottom-2 left-0 right-0 h-3 sm:h-4 bg-brand-300/70 -z-0 rounded-sm" />
                </span>
              </h1>

              {/* Supporting Description */}
              <p className="text-sm sm:text-base text-charcoal-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Quality tested HP, Dell, Lenovo ThinkPads &amp; Chromebooks with original chargers, 1-month checking warranty, and verified battery health.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                <Link
                  href="/laptops"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-charcoal-950 font-bold text-sm shadow-sm hover:shadow transition-all duration-200 hover:scale-105 active:scale-95 border border-brand-500 hover:border-brand-400"
                >
                  <span>Explore Laptops</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm shadow-sm transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Us</span>
                </a>
              </div>

              {/* 3 Quick Value Bullets */}
              <div className="pt-4 border-t border-charcoal-200/80 flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-5 text-xs text-charcoal-600 font-medium">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>100% Tested Units</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>1-Month Warranty</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Fast Delivery in Pakistan</span>
                </div>
              </div>
            </div>

            {/* Right Product Slideshow Frame */}
            <div className="lg:col-span-6">
              <div
                className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-3xl overflow-hidden bg-white border border-charcoal-200/90 shadow-soft-lg group select-none"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                {HERO_SLIDES.map((s, index) => {
                  const isActive = currentSlide === index;
                  return (
                    <Link
                      key={s.id}
                      href={s.link}
                      aria-label={`Explore Laptops — Banner ${s.id}`}
                      className={`absolute inset-0 block cursor-pointer transition-opacity duration-700 ease-in-out ${
                        isActive ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none z-0'
                      }`}
                    >
                      {/* Desktop Banner Image */}
                      <div className="hidden sm:block absolute inset-0 w-full h-full">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={s.desktopImage}
                          alt={`Yasin Laptop Hub Banner ${s.id}`}
                          className="w-full h-full object-cover object-center"
                        />
                      </div>

                      {/* Mobile Banner Image */}
                      <div className="block sm:hidden absolute inset-0 w-full h-full">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={s.mobileImage}
                          alt={`Yasin Laptop Hub Mobile Banner ${s.id}`}
                          className="w-full h-full object-cover object-center"
                        />
                      </div>
                    </Link>
                  );
                })}

                {/* Daily Stock Video Floating CTA Button */}
                {(videoConfig.isActive ?? true) && (
                  <div className="absolute z-20 bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 pointer-events-auto">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        setIsVideoModalOpen(true);
                      }}
                      className="group/btn relative inline-flex items-center gap-2.5 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-charcoal-950/90 hover:bg-charcoal-900 text-white font-bold text-xs sm:text-sm border border-brand-400/60 shadow-xl backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95"
                    >
                      <span className="relative flex h-3 w-3 shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                      </span>

                      <span className="text-white group-hover/btn:text-brand-300 transition-colors">
                        {videoConfig.buttonText || 'Watch Daily Stock Video'}
                      </span>

                      <span className="hidden sm:inline-block text-[10px] px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 font-bold border border-brand-400/30">
                        LIVE
                      </span>
                    </button>
                  </div>
                )}

                {/* Left Arrow Button */}
                <div className="absolute z-20 inset-y-0 left-2.5 flex items-center pointer-events-none">
                  <button
                    type="button"
                    onClick={handlePrev}
                    aria-label="Previous Slide"
                    className="pointer-events-auto p-2 rounded-full bg-white/90 hover:bg-white border border-charcoal-200 text-charcoal-800 shadow-md transition-all hover:scale-110"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                </div>

                {/* Right Arrow Button */}
                <div className="absolute z-20 inset-y-0 right-2.5 flex items-center pointer-events-none">
                  <button
                    type="button"
                    onClick={handleNext}
                    aria-label="Next Slide"
                    className="pointer-events-auto p-2 rounded-full bg-white/90 hover:bg-white border border-charcoal-200 text-charcoal-800 shadow-md transition-all hover:scale-110"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Dot Indicators */}
                <div className="absolute z-20 top-3 right-3 flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20 pointer-events-auto">
                  {HERO_SLIDES.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        setCurrentSlide(index);
                      }}
                      aria-label={`Slide ${index + 1}`}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        currentSlide === index ? 'w-5 bg-brand-400' : 'w-1.5 bg-white/60 hover:bg-white'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Daily Stock Video Modal Popup */}
      <StockVideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        videoUrl={videoConfig.videoUrl}
        title={videoConfig.title}
        description={videoConfig.description}
        whatsappNumber={whatsappNumber}
      />
    </>
  );
};
