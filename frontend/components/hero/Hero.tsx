'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HeroSlide {
  id: number;
  image: string;
  link: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 1,
    image: '/image/L-hero-1.jpg',
    link: '/laptops',
  },
  {
    id: 2,
    image: '/image/L-hero-2.jpg',
    link: '/laptops?category=business-laptops',
  },
  {
    id: 3,
    image: '/image/L-hero-3.jpg',
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
  const touchStartX = useRef<number | null>(null);

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
    <section
      className="relative overflow-hidden bg-slate-950 border-b border-slate-800 select-none group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slideshow Frame */}
      <div className="relative w-full h-[280px] xs:h-[340px] sm:h-[480px] md:h-[580px] lg:h-[660px] xl:h-[720px] bg-slate-950 flex items-center justify-center">
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
              {/* Unified Image displayed on both mobile and laptop */}
              <div className="absolute inset-0 w-full h-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={s.image}
                  alt={`Yasin Laptop Hub Banner ${s.id}`}
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </Link>
          );
        })}

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
  );
};
