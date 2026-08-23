'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Hero } from '@/components/hero/Hero';
import { TrustStrip } from '@/components/home/TrustStrip';
import { WhatsAppCta } from '@/components/home/WhatsAppCta';
import { ContactPreview } from '@/components/home/ContactPreview';
import { ProductCard } from '@/components/products/ProductCard';
import { ProductCardSkeleton } from '@/components/products/ProductCardSkeleton';
import { AccessoryCard } from '@/components/accessories/AccessoryCard';
import { AccessoryCardSkeleton } from '@/components/accessories/AccessoryCardSkeleton';
import { EmptyState } from '@/components/common/EmptyState';
import { Button } from '@/components/ui/Button';
import { productService } from '@/services/productService';
import { IProduct, IAccessory } from '@/types';
import {
  Laptop,
  Layers,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<IProduct[]>([]);
  const [accessories, setAccessories] = useState<IAccessory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadHomeData() {
      setIsLoading(true);
      setError(null);

      try {
        const [featuredRes, accRes] = await Promise.allSettled([
          productService.getFeatured(),
          productService.getAccessories({ limit: 8 }),
        ]);

        if (!isMounted) return;

        const extractItems = <T,>(data: unknown): T[] => {
          if (!data) return [];
          if (Array.isArray(data)) return data;
          const obj = data as Record<string, unknown>;
          if (Array.isArray(obj.items)) return obj.items as T[];
          if (Array.isArray(obj.products)) return obj.products as T[];
          if (Array.isArray(obj.accessories)) return obj.accessories as T[];
          return [];
        };

        if (featuredRes.status === 'fulfilled' && featuredRes.value.success) {
          setFeaturedProducts(extractItems<IProduct>(featuredRes.value.data));
        }
        if (accRes.status === 'fulfilled' && accRes.value.success) {
          setAccessories(extractItems<IAccessory>(accRes.value.data));
        }
      } catch {
        if (isMounted) {
          setError('Live inventory is connecting.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadHomeData();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-16 sm:space-y-24 pb-20 overflow-x-hidden">
      {/* 1. HERO BANNER WITH SLIDESHOW & DAILY STOCK VIDEO */}
      <Hero mode="carousel" />

      {/* 2. TRUST / VALUE STRIP */}
      <TrustStrip />

      {/* 3. FEATURED LAPTOPS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-brand-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Verified Hardware</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-2.5">
              <Laptop className="w-7 h-7 text-brand-400" />
              <span>Featured Laptops</span>
            </h2>
          </div>
          <Link
            href="/laptops"
            className="text-xs sm:text-sm font-medium text-brand-400 hover:text-brand-300 inline-flex items-center gap-1 self-start sm:self-auto"
          >
            <span>View Full Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Featured Inventory Synchronizing"
            description="Featured laptop units registered through the admin dashboard will automatically appear here."
            action={
              <Link href="/laptops">
                <Button variant="secondary" size="sm">
                  Browse All Laptops
                </Button>
              </Link>
            }
          />
        )}
      </section>

      {/* 4. LAPTOP ACCESSORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-brand-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Layers className="w-3.5 h-3.5" />
              <span>Essential Upgrades</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-2.5">
              <Layers className="w-7 h-7 text-brand-400" />
              <span>Laptop Accessories</span>
            </h2>
          </div>
          <Link
            href="/accessories"
            className="text-xs sm:text-sm font-medium text-brand-400 hover:text-brand-300 inline-flex items-center gap-1 self-start sm:self-auto"
          >
            <span>All Accessories</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <AccessoryCardSkeleton key={i} />
            ))}
          </div>
        ) : accessories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {accessories.map((acc) => (
              <AccessoryCard key={acc._id} accessory={acc} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Accessories Catalog Initializing"
            description="Power adapters, padded backpacks, stands, mice, RAM modules and SSDs will appear here."
            action={
              <Link href="/accessories">
                <Button variant="secondary" size="sm">
                  View Accessories
                </Button>
              </Link>
            }
          />
        )}
      </section>

      {/* 5. WHATSAPP GUIDANCE CTA */}
      <WhatsAppCta />

      {/* 6. CONTACT & STORE LOCATION PREVIEW */}
      <ContactPreview />
    </div>
  );
}
