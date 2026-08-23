'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Hero } from '@/components/hero/Hero';
import { TrustStrip } from '@/components/home/TrustStrip';
import { WhatsAppCta } from '@/components/home/WhatsAppCta';
import { ContactPreview } from '@/components/home/ContactPreview';
import { CustomerReviews } from '@/components/home/CustomerReviews';
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
  Briefcase,
  GraduationCap,
  Code2,
  Gamepad2,
  Cpu,
  ChevronRight,
} from 'lucide-react';

const CATEGORY_CARDS = [
  {
    name: 'Business Laptops',
    desc: 'HP EliteBooks, Dell Latitudes & ThinkPads built for reliability.',
    href: '/laptops?category=business-laptops',
    icon: Briefcase,
    count: 'Popular',
  },
  {
    name: 'Student Laptops',
    desc: 'Affordable & fast machines for study, assignments & daily use.',
    href: '/laptops?category=student-budget-laptops',
    icon: GraduationCap,
    count: 'Best Value',
  },
  {
    name: 'Programming & Dev',
    desc: 'Core i7, 16GB–32GB RAM & SSD storage for developers & designers.',
    href: '/laptops?category=programming-laptops',
    icon: Code2,
    count: 'High Speed',
  },
  {
    name: 'Chromebooks',
    desc: 'Fast boot, long battery life, perfect for browsing & office tasks.',
    href: '/chromebooks',
    icon: Cpu,
    count: 'Budget Friendly',
  },
  {
    name: 'Gaming & Workstations',
    desc: 'Dedicated NVIDIA/AMD graphics for gaming and rendering.',
    href: '/laptops?category=gaming-heavy-workstations',
    icon: Gamepad2,
    count: 'Dedicated GPU',
  },
  {
    name: 'Laptop Accessories',
    desc: 'Original chargers, laptop bags, cooling pads, RAM & SSDs.',
    href: '/accessories',
    icon: Layers,
    count: 'Original',
  },
];

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
    <div className="space-y-16 sm:space-y-24 pb-20 overflow-x-hidden bg-warm-bg">
      {/* 1. HERO BANNER WITH SLIDESHOW & DAILY STOCK VIDEO */}
      <Hero mode="carousel" />

      {/* 2. TRUST / VALUE STRIP */}
      <TrustStrip />

      {/* 3. EXPLORE BY CATEGORY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-brand-700 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Tailored For Your Needs</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-charcoal-950 tracking-tight">
              Explore by Category
            </h2>
          </div>
          <Link
            href="/categories"
            className="text-xs sm:text-sm font-bold text-charcoal-800 hover:text-brand-700 inline-flex items-center gap-1 self-start sm:self-auto transition-colors"
          >
            <span>All Categories</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {CATEGORY_CARDS.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <Link
                key={i}
                href={cat.href}
                className="p-6 rounded-3xl bg-white border border-charcoal-200/90 shadow-soft hover:shadow-soft-md hover:border-brand-500/80 hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-brand-50 border border-brand-200 text-brand-700 flex items-center justify-center group-hover:bg-brand-500 group-hover:text-charcoal-950 transition-colors shadow-xs">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-charcoal-100 text-charcoal-700 border border-charcoal-200">
                    {cat.count}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-base sm:text-lg font-black text-charcoal-950 group-hover:text-brand-700 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-charcoal-500 line-clamp-2 leading-relaxed font-medium">
                    {cat.desc}
                  </p>
                </div>

                <div className="pt-2 border-t border-charcoal-100 flex items-center justify-between text-xs font-bold text-charcoal-800 group-hover:text-brand-700">
                  <span>Browse Units</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 4. FEATURED LAPTOPS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-brand-700 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Handpicked Units</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-charcoal-950 tracking-tight flex items-center gap-2.5">
              <span>Featured Laptops</span>
            </h2>
            <p className="text-xs sm:text-sm text-charcoal-500 font-medium mt-1">
              Handpicked quality laptops with 1-month checking warranty.
            </p>
          </div>
          <Link
            href="/laptops"
            className="text-xs sm:text-sm font-bold text-charcoal-800 hover:text-brand-700 inline-flex items-center gap-1 self-start sm:self-auto transition-colors"
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

      {/* 5. LAPTOP ACCESSORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-brand-700 text-xs font-bold uppercase tracking-wider mb-1">
              <Layers className="w-3.5 h-3.5" />
              <span>Essential Upgrades</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-charcoal-950 tracking-tight flex items-center gap-2.5">
              <span>Laptop Accessories</span>
            </h2>
            <p className="text-xs sm:text-sm text-charcoal-500 font-medium mt-1">
              Original chargers, padded backpacks, cooling pads &amp; memory upgrades.
            </p>
          </div>
          <Link
            href="/accessories"
            className="text-xs sm:text-sm font-bold text-charcoal-800 hover:text-brand-700 inline-flex items-center gap-1 self-start sm:self-auto transition-colors"
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

      {/* 6. CUSTOMER REVIEWS & VIDEO TESTIMONIALS */}
      <CustomerReviews />

      {/* 7. WHATSAPP GUIDANCE CTA */}
      <WhatsAppCta />

      {/* 8. CONTACT & STORE LOCATION PREVIEW */}
      <ContactPreview />
    </div>
  );
}
