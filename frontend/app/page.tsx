'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Hero } from '@/components/hero/Hero';
import { MobileSearchBar } from '@/components/home/MobileSearchBar';
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
  Tag,
  Zap,
} from 'lucide-react';

const CATEGORY_CARDS = [
  {
    name: 'Business',
    desc: 'HP EliteBooks, Dell Latitudes & ThinkPads.',
    href: '/laptops?category=business-laptops',
    icon: Briefcase,
    badge: 'Popular',
  },
  {
    name: 'Student',
    desc: 'Affordable, fast machines for study.',
    href: '/laptops?category=student-budget-laptops',
    icon: GraduationCap,
    badge: 'Budget',
  },
  {
    name: 'Programming',
    desc: 'Core i7, 16GB–32GB RAM & NVMe SSDs.',
    href: '/laptops?category=programming-laptops',
    icon: Code2,
    badge: 'Speed',
  },
  {
    name: 'Chromebooks',
    desc: 'Long battery life & cloud efficiency.',
    href: '/chromebooks',
    icon: Cpu,
    badge: 'Lightweight',
  },
  {
    name: 'Workstation',
    desc: 'Dedicated NVIDIA/AMD graphics.',
    href: '/laptops?category=gaming-heavy-workstations',
    icon: Gamepad2,
    badge: 'GPU',
  },
  {
    name: 'Accessories',
    desc: 'Original power adapters & backpacks.',
    href: '/accessories',
    icon: Layers,
    badge: 'Original',
  },
];

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<IProduct[]>([]);
  const [bestDeals, setBestDeals] = useState<IProduct[]>([]);
  const [chromebooks, setChromebooks] = useState<IProduct[]>([]);
  const [accessories, setAccessories] = useState<IAccessory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadHomeData() {
      setIsLoading(true);

      try {
        const [featuredRes, allProductsRes, accRes] = await Promise.allSettled([
          productService.getFeatured(),
          productService.getProducts({ limit: 20 }),
          productService.getAccessories({ limit: 6 }),
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

        if (allProductsRes.status === 'fulfilled' && allProductsRes.value.success) {
          const all = extractItems<IProduct>(allProductsRes.value.data);
          const deals = all.filter((p) => p.bestDeal || (p.previousPrice && p.previousPrice > p.price));
          setBestDeals(deals.length > 0 ? deals.slice(0, 4) : all.slice(0, 4));

          const chromes = all.filter((p) => p.productType === 'chromebook');
          setChromebooks(chromes.length > 0 ? chromes.slice(0, 4) : []);
        }

        if (accRes.status === 'fulfilled' && accRes.value.success) {
          setAccessories(extractItems<IAccessory>(accRes.value.data));
        }
      } catch {
        // graceful fallback
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
    <div className="space-y-10 sm:space-y-16 lg:space-y-20 pb-20 overflow-x-hidden bg-warm-bg">
      {/* 1. TOP MOBILE SEARCH BAR */}
      <MobileSearchBar />

      {/* 2. HERO BANNER WITH SLIDESHOW & DAILY STOCK VIDEO */}
      <Hero mode="carousel" />

      {/* 3. COMPACT TRUST STRIP */}
      <TrustStrip />

      {/* 4. EXPLORE BY CATEGORY (2-COL ON MOBILE) */}
      <section className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div>
            <div className="flex items-center gap-1.5 text-brand-700 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-0.5">
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>Tailored For Your Needs</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-charcoal-950 tracking-tight">
              Explore by Category
            </h2>
          </div>
          <Link
            href="/categories"
            className="text-xs sm:text-sm font-bold text-charcoal-800 hover:text-brand-700 inline-flex items-center gap-1 transition-colors shrink-0"
          >
            <span>All Categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-4">
          {CATEGORY_CARDS.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <Link
                key={i}
                href={cat.href}
                className="p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl bg-white border border-charcoal-200/90 shadow-soft hover:shadow-soft-md hover:border-brand-500/80 hover:-translate-y-0.5 transition-all duration-200 group flex flex-col justify-between space-y-2.5 text-left"
              >
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-brand-50 border border-brand-200 text-brand-800 flex items-center justify-center group-hover:bg-brand-500 group-hover:text-charcoal-950 transition-colors shadow-xs">
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <span className="text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full bg-charcoal-100 text-charcoal-700 border border-charcoal-200">
                    {cat.badge}
                  </span>
                </div>

                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-charcoal-950 group-hover:text-brand-700 transition-colors truncate">
                    {cat.name}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-charcoal-500 line-clamp-1 font-medium mt-0.5">
                    {cat.desc}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 5. FEATURED LAPTOPS (2-COL ON MOBILE) */}
      <section className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div>
            <div className="flex items-center gap-1.5 text-brand-700 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-0.5">
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>Handpicked Units</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-charcoal-950 tracking-tight">
              Featured Laptops
            </h2>
          </div>
          <Link
            href="/laptops"
            className="text-xs sm:text-sm font-bold text-charcoal-800 hover:text-brand-700 inline-flex items-center gap-1 transition-colors shrink-0"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-5">
            {[...Array(4)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : featuredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-5">
            {featuredProducts.slice(0, 4).map((product) => (
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

      {/* 6. BEST DEALS & DISCOUNTED UNITS (Soft Warm Yellow Tint) */}
      {bestDeals.length > 0 && (
        <section className="py-8 sm:py-12 bg-brand-50/60 border-y border-brand-200/70">
          <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 space-y-4 sm:space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-amber-800 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-0.5">
                  <Tag className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-700" />
                  <span>Special Offers</span>
                </div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-charcoal-950 tracking-tight">
                  Best Value Laptop Deals
                </h2>
              </div>
              <Link
                href="/laptops"
                className="text-xs sm:text-sm font-bold text-charcoal-800 hover:text-brand-700 inline-flex items-center gap-1 transition-colors shrink-0"
              >
                <span>All Deals</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-5">
              {bestDeals.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 7. CHROMEBOOKS (2-COL ON MOBILE) */}
      {chromebooks.length > 0 && (
        <section className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div>
              <div className="flex items-center gap-1.5 text-brand-700 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-0.5">
                <Cpu className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span>Fast &amp; Budget Friendly</span>
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-charcoal-950 tracking-tight">
                Chromebooks for Students
              </h2>
            </div>
            <Link
              href="/chromebooks"
              className="text-xs sm:text-sm font-bold text-charcoal-800 hover:text-brand-700 inline-flex items-center gap-1 transition-colors shrink-0"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-5">
            {chromebooks.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* 8. LAPTOP ACCESSORIES (2-COL ON MOBILE) */}
      <section className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div>
            <div className="flex items-center gap-1.5 text-brand-700 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-0.5">
              <Layers className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>Original Hardware</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-charcoal-950 tracking-tight">
              Laptop Accessories &amp; Upgrades
            </h2>
          </div>
          <Link
            href="/accessories"
            className="text-xs sm:text-sm font-bold text-charcoal-800 hover:text-brand-700 inline-flex items-center gap-1 transition-colors shrink-0"
          >
            <span>All Accessories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-5">
            {[...Array(4)].map((_, i) => (
              <AccessoryCardSkeleton key={i} />
            ))}
          </div>
        ) : accessories.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-5">
            {accessories.slice(0, 4).map((acc) => (
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

      {/* 9. CUSTOMER REVIEWS & VIDEO TESTIMONIALS */}
      <CustomerReviews />

      {/* 10. WHATSAPP GUIDANCE CTA */}
      <WhatsAppCta />

      {/* 11. CONTACT & STORE LOCATION PREVIEW */}
      <ContactPreview />
    </div>
  );
}
