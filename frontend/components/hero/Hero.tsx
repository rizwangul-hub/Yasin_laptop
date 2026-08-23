'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Play, Sparkles } from 'lucide-react';
import { StockVideoModal } from './StockVideoModal';
import { settingsService } from '@/services/settingsService';
import { DEFAULT_BUSINESS_CONFIG } from '@/lib/business-config';

interface HeroSlide {
  id: number;
  desktopImage: string;
  mobileImage: string;
  link: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 1,
    desktopImage: '/image/L-hero-1.jpg',
    mobileImage: '/image/m-hero-1.jpg',
    link: '/laptops',
  },
  {
    id: 2,
    desktopImage: '/image/L-hero-2.jpg',
    mobileImage: '/image/m-hero-2.jpg',
    link: '/laptops?category=business-laptops',
  },
  {
    id: 3,
    desktopImage: '/image/L-hero-3.jpg',
    mobileImage: '/image/m-hero-3.jpg',
    link: '/laptops',
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

  // Fetch dynamic video config and WhatsApp number
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

  // Auto-advance slides every 3 seconds (3000ms)
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 3000);

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

  return (
    <>
      <section
        className="relative overflow-hidden bg-slate-950 border-b border-slate-800 select-none group"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Slideshow Frame */}
        <div className="relative w-full h-[380px] xs:h-[440px] sm:h-[520px] md:h-[600px] lg:h-[660px] xl:h-[720px] bg-slate-950 flex items-center justify-center">
          {HERO_SLIDES.map((s, index) => {
            const isActive = currentSlide === index;
            return (
              <Link
                key={s.id}
                href={s.link}
                aria-label={`Explore Laptops — Banner ${s.id}`}
                className={`absolute inset-0 block cursor-pointer transition-opacity duration-1000 ease-in-out ${
                  isActive ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none z-0'
                }`}
              >
                {/* Desktop Screen Image */}
                <div className="hidden sm:block absolute inset-0 w-full h-full">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={s.desktopImage}
                    alt={`Yasin Laptop Hub Banner ${s.id}`}
                    className="w-full h-full object-cover object-center"
                  />
                </div>

                {/* Mobile Screen Image */}
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

          {/* Daily Stock Video Floating CTA Button on Hero Section */}
          {(videoConfig.isActive ?? true) && (
            <div className="absolute z-20 bottom-12 sm:bottom-16 md:bottom-20 left-1/2 -translate-x-1/2 pointer-events-auto">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setIsVideoModalOpen(true);
                }}
                className="group/btn relative inline-flex items-center gap-2.5 px-5 sm:px-7 py-3 sm:py-3.5 rounded-full bg-slate-950/90 hover:bg-slate-900 text-white font-bold text-xs sm:text-sm border border-rose-500/60 hover:border-rose-400 shadow-2xl shadow-rose-600/40 backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95"
              >
                {/* Glowing Pulse Indicator */}
                <span className="relative flex h-3.5 w-3.5 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-rose-500 items-center justify-center">
                    <Play className="w-2 h-2 text-white fill-white ml-0.5" />
                  </span>
                </span>

                <span className="bg-gradient-to-r from-white via-slate-100 to-rose-200 bg-clip-text text-transparent group-hover/btn:to-rose-300">
                  {videoConfig.buttonText || 'Watch Daily Stock Video'}
                </span>

                <span className="hidden sm:inline-block text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-semibold border border-rose-500/30">
                  LIVE STATUS
                </span>
              </button>
            </div>
          )}

          {/* Left Arrow Navigation Button */}
          <div className="absolute z-20 inset-y-0 left-3 sm:left-6 hidden sm:flex items-center pointer-events-none">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous Slide"
              className="pointer-events-auto p-2.5 sm:p-3 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-700/70 text-white backdrop-blur-md transition-all shadow-xl hover:scale-110"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>

          {/* Right Arrow Navigation Button */}
          <div className="absolute z-20 inset-y-0 right-3 sm:right-6 hidden sm:flex items-center pointer-events-none">
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next Slide"
              className="pointer-events-auto p-2.5 sm:p-3 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-700/70 text-white backdrop-blur-md transition-all shadow-xl hover:scale-110"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* 3-Dot Indicators */}
          <div className="absolute z-20 bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-slate-950/60 backdrop-blur-sm px-3 py-1.5 rounded-full border border-slate-800/60 pointer-events-auto">
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
                  currentSlide === index
                    ? 'w-7 bg-brand-400 shadow-md shadow-brand-500/50'
                    : 'w-2 bg-slate-600 hover:bg-slate-400'
                }`}
              />
            ))}
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
