'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { IProductImage } from '@/types';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  Laptop,
  ZoomIn,
} from 'lucide-react';

interface ProductGalleryProps {
  images: IProductImage[];
  productName: string;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({ images, productName }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const touchStartX = useRef<number | null>(null);

  const validImages = images && images.length > 0 ? images : [];
  const currentImage = validImages[selectedIndex];

  // Navigation handlers
  const handlePrev = useCallback(() => {
    if (validImages.length === 0) return;
    setSelectedIndex((prev) => (prev === 0 ? validImages.length - 1 : prev - 1));
    setIsZoomed(false);
  }, [validImages.length]);

  const handleNext = useCallback(() => {
    if (validImages.length === 0) return;
    setSelectedIndex((prev) => (prev === validImages.length - 1 ? 0 : prev + 1));
    setIsZoomed(false);
  }, [validImages.length]);

  // Keyboard navigation & escape for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isLightboxOpen) return;
      if (e.key === 'Escape') setIsLightboxOpen(false);
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, handlePrev, handleNext]);

  // Lock background scroll when lightbox is active
  useEffect(() => {
    if (isLightboxOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isLightboxOpen]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (diff > 45) {
      handleNext();
    } else if (diff < -45) {
      handlePrev();
    }
    touchStartX.current = null;
  };

  // Mouse move for desktop zoom preview
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x, y });
  };

  if (validImages.length === 0) {
    return (
      <div className="w-full aspect-[4/3] rounded-3xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center text-slate-500 gap-3 p-8">
        <Laptop className="w-16 h-16 text-slate-700" />
        <span className="text-sm font-medium tracking-wide">Detailed Photographs Coming Soon</span>
      </div>
    );
  }

  const altText = currentImage.alt || currentImage.altText || `${productName} view ${selectedIndex + 1}`;

  return (
    <div className="space-y-4">
      {/* 1. MAIN DISPLAY FRAME */}
      <div
        className="relative w-full aspect-[4/3] sm:aspect-[16/11] rounded-3xl bg-slate-900/90 border border-slate-800 overflow-hidden flex items-center justify-center group cursor-zoom-in"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onClick={() => setIsLightboxOpen(true)}
      >
        {/* Main Image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={currentImage.url}
          alt={altText}
          style={
            isZoomed
              ? {
                  transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                  transform: 'scale(1.8)',
                }
              : { transform: 'scale(1)' }
          }
          className="w-full h-full object-contain p-4 sm:p-8 transition-transform duration-150 ease-out select-none pointer-events-none"
          loading="eager"
        />

        {/* Zoom Hint Icon */}
        <div className="absolute top-4 right-4 p-2 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-300 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity">
          <Maximize2 className="w-4 h-4" />
        </div>

        {/* Previous / Next Arrows (if > 1 image) */}
        {validImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              aria-label="Previous photograph"
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-200 hover:text-white hover:bg-slate-900 transition-all opacity-90 sm:opacity-0 sm:group-hover:opacity-100 shadow-lg"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              aria-label="Next photograph"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-200 hover:text-white hover:bg-slate-900 transition-all opacity-90 sm:opacity-0 sm:group-hover:opacity-100 shadow-lg"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Counter Pill */}
        <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-slate-950/80 border border-slate-800 text-[11px] font-semibold text-slate-300 backdrop-blur-sm">
          {selectedIndex + 1} / {validImages.length}
        </div>
      </div>

      {/* 2. THUMBNAILS CAROUSEL */}
      {validImages.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
          {validImages.map((img, idx) => {
            const isSelected = idx === selectedIndex;
            const thumbAlt = img.alt || img.altText || `${productName} thumbnail ${idx + 1}`;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedIndex(idx)}
                aria-label={`View photo ${idx + 1}`}
                className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-slate-900 border flex-shrink-0 overflow-hidden transition-all duration-200 ${
                  isSelected
                    ? 'border-brand-500 ring-2 ring-brand-500/40 shadow-lg'
                    : 'border-slate-800 hover:border-slate-700 opacity-70 hover:opacity-100'
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.url}
                  alt={thumbAlt}
                  className="w-full h-full object-contain p-2"
                  loading="lazy"
                />
              </button>
            );
          })}
        </div>
      )}

      {/* 3. FULLSCREEN LIGHTBOX MODAL */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-8 animate-in fade-in duration-200">
          {/* Top Bar */}
          <div className="flex items-center justify-between text-white max-w-7xl mx-auto w-full">
            <div className="text-xs sm:text-sm font-semibold truncate max-w-[70vw] text-slate-200">
              {productName} • ({selectedIndex + 1} of {validImages.length})
            </div>
            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              aria-label="Close fullscreen"
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Large Center Image with Arrows */}
          <div className="relative flex-1 flex items-center justify-center my-4 max-w-5xl mx-auto w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentImage.url}
              alt={altText}
              className="max-h-[75vh] max-w-full object-contain drop-shadow-2xl"
            />

            {validImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label="Previous photograph"
                  className="absolute left-2 sm:left-4 p-3 rounded-full bg-slate-900/80 border border-slate-700 text-white hover:bg-slate-800 transition-colors shadow-2xl"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Next photograph"
                  className="absolute right-2 sm:right-4 p-3 rounded-full bg-slate-900/80 border border-slate-700 text-white hover:bg-slate-800 transition-colors shadow-2xl"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {/* Bottom Thumbnails Strip */}
          {validImages.length > 1 && (
            <div className="flex items-center justify-center gap-2 overflow-x-auto py-2 max-w-3xl mx-auto w-full">
              {validImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedIndex(idx)}
                  className={`w-14 h-14 rounded-xl bg-slate-900 border flex-shrink-0 overflow-hidden transition-all ${
                    idx === selectedIndex ? 'border-brand-500 ring-2 ring-brand-500' : 'border-slate-800 opacity-60'
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.url} alt="" className="w-full h-full object-contain p-1" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
