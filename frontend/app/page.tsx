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
  Cpu,
  Tag,
  ArrowDownNarrowWide,
  ArrowUpNarrowWide,
  Wallet,
  Building2,
} from 'lucide-react';

const BRAND_CARDS = [
  {
    name: 'HP Laptops',
    desc: 'EliteBook, ProBook, Pavilion & ZBook series.',
    href: '/laptops?brand=hp',
    badge: 'Popular',
    tag: 'EliteBook / ProBook',
  },
  {
    name: 'Dell Laptops',
    desc: 'Latitude, XPS, Precision & Inspiron series.',
    href: '/laptops?brand=dell',
    badge: 'Durable',
    tag: 'Latitude / XPS',
  },
  {
    name: 'Lenovo Laptops',
    desc: 'ThinkPad T, X, L series & IdeaPads.',
    href: '/laptops?brand=lenovo',
    badge: 'Top Keyboard',
    tag: 'ThinkPad / Yoga',
  },
  {
    name: 'Chromebooks',
    desc: 'Fast boot, long battery life, cloud laptops.',
    href: '/chromebooks',
    badge: 'Budget Friendly',
    tag: 'HP / Dell / Acer',
  },
  {
    name: 'Apple MacBooks',
    desc: 'MacBook Air & MacBook Pro Retina units.',
    href: '/laptops?brand=apple',
    badge: 'Premium',
    tag: 'Air / Pro',
  },
  {
    name: 'Laptop Accessories',
    desc: 'Original chargers, backpacks, RAM & SSDs.',
    href: '/accessories',
    badge: 'Original',
    tag: 'Power & Gear',
  },
];

const PRICE_RANGE_CARDS = [
  {
    title: 'Under Rs. 30,000',
    subtitle: 'Budget friendly & student laptops',
    href: '/laptops?maxPrice=30000',
    badge: 'Entry Level',
    icon: Wallet,
  },
  {
    title: 'Rs. 30,000 – 40,000',
    subtitle: 'Core i5 6th, 7th & 8th Gen laptops',
    href: '/laptops?minPrice=30000&maxPrice=40000',
    badge: 'Best Value',
    icon: Tag,
  },
  {
    title: 'Rs. 40,000 – 50,000',
    subtitle: 'Core i5 / i7 8th Gen with SSD storage',
    href: '/laptops?minPrice=40000&maxPrice=50000',
    badge: 'Most Popular',
    icon: Sparkles,
  },
  {
    title: 'Rs. 50,000 – 70,000',
    subtitle: 'Core i7, 16GB RAM, NVMe high speed',
    href: '/laptops?minPrice=50000&maxPrice=70000',
    badge: 'Fast Performance',
    icon: Cpu,
  },
  {
    title: 'Rs. 70,000 – 100,000',
    subtitle: 'Premium slim business & touch screens',
    href: '/laptops?minPrice=70000&maxPrice=100000',
    badge: 'Premium Business',
    icon: Laptop,
  },
  {
    title: 'Above Rs. 100,000',
    subtitle: 'High-end workstations & Retina MacBooks',
    href: '/laptops?minPrice=100000',
    badge: 'Flagship',
    icon: Layers,
  },
];

export default function HomePage() {
  const [allLaptops, setAllLaptops] = useState<IProduct[]>([]);
  const [accessories, setAccessories] = useState<IAccessory[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'chromebooks' | 'deals'>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadHomeData() {
      setIsLoading(true);

      try {
        const [productsRes, accRes] = await Promise.allSettled([
          productService.getProducts({ limit: 24 }),
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

        if (productsRes.status === 'fulfilled' && productsRes.value.success) {
          setAllLaptops(extractItems<IProduct>(productsRes.value.data));
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

  // Filter displayed laptops based on active tab
  const displayedLaptops = React.useMemo(() => {
    if (activeTab === 'chromebooks') {
      return allLaptops.filter((p) => p.productType === 'chromebook');
    }
    if (activeTab === 'deals') {
      return allLaptops.filter((p) => p.bestDeal || (p.previousPrice && p.previousPrice > p.price));
    }
    return allLaptops.filter((p) => p.productType !== 'accessory');
  }, [allLaptops, activeTab]);

  return (
    <div className="space-y-10 sm:space-y-16 lg:space-y-20 pb-20 overflow-x-hidden bg-warm-bg">
      {/* 1. TOP MOBILE SEARCH BAR */}
      <MobileSearchBar />

      {/* 2. HERO BANNER WITH SLIDESHOW & DAILY STOCK VIDEO */}
      <Hero mode="carousel" />

      {/* 3. COMPACT TRUST STRIP */}
      <TrustStrip />

      {/* 4. SHOP BY BRAND (HP, DELL, LENOVO, APPLE, CHROMEBOOKS) */}
      <section className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div>
            <div className="flex items-center gap-1.5 text-brand-700 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-0.5">
              <Building2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>Top Manufacturers</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-charcoal-950 tracking-tight">
              Shop by Brand
            </h2>
          </div>
          <Link
            href="/brands"
            className="text-xs sm:text-sm font-bold text-charcoal-800 hover:text-brand-700 inline-flex items-center gap-1 transition-colors shrink-0"
          >
            <span>All Brands</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-4">
          {BRAND_CARDS.map((brand, i) => (
            <Link
              key={i}
              href={brand.href}
              className="p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl bg-white border border-charcoal-200/90 shadow-soft hover:shadow-soft-md hover:border-brand-500/80 hover:-translate-y-0.5 transition-all duration-200 group flex flex-col justify-between space-y-2.5 text-left"
            >
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-brand-50 border border-brand-200 text-brand-900 font-black text-xs sm:text-sm flex items-center justify-center group-hover:bg-brand-500 group-hover:text-charcoal-950 transition-colors shadow-xs">
                  {brand.name.split(' ')[0]}
                </div>
                <span className="text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full bg-charcoal-100 text-charcoal-700 border border-charcoal-200">
                  {brand.badge}
                </span>
              </div>

              <div>
                <h3 className="text-xs sm:text-sm font-bold text-charcoal-950 group-hover:text-brand-700 transition-colors truncate">
                  {brand.name}
                </h3>
                <p className="text-[10px] sm:text-xs text-charcoal-500 line-clamp-1 font-medium mt-0.5">
                  {brand.tag}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. SHOP BY BUDGET & PRICE RANGE */}
      <section className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-4 sm:mb-6 gap-2">
          <div>
            <div className="flex items-center gap-1.5 text-brand-700 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-0.5">
              <Wallet className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>Budget Filter</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-charcoal-950 tracking-tight">
              Shop by Price Range
            </h2>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <Link
              href="/laptops?sort=price_asc"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white border border-charcoal-200 text-charcoal-800 font-bold hover:bg-brand-50 hover:border-brand-300 transition-colors shadow-xs"
            >
              <ArrowDownNarrowWide className="w-3.5 h-3.5 text-brand-700" />
              <span>Low to High</span>
            </Link>
            <Link
              href="/laptops?sort=price_desc"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white border border-charcoal-200 text-charcoal-800 font-bold hover:bg-brand-50 hover:border-brand-300 transition-colors shadow-xs"
            >
              <ArrowUpNarrowWide className="w-3.5 h-3.5 text-brand-700" />
              <span>High to Low</span>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-4">
          {PRICE_RANGE_CARDS.map((price, i) => {
            const Icon = price.icon;
            return (
              <Link
                key={i}
                href={price.href}
                className="p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl bg-white border border-charcoal-200/90 shadow-soft hover:shadow-soft-md hover:border-brand-500/80 hover:-translate-y-0.5 transition-all duration-200 group flex flex-col justify-between space-y-2.5 text-left"
              >
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center justify-center group-hover:bg-brand-500 group-hover:text-charcoal-950 transition-colors shadow-xs">
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <span className="text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full bg-charcoal-100 text-charcoal-700 border border-charcoal-200">
                    {price.badge}
                  </span>
                </div>

                <div>
                  <h3 className="text-xs sm:text-sm font-black text-charcoal-950 group-hover:text-brand-700 transition-colors truncate">
                    {price.title}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-charcoal-500 line-clamp-1 font-medium mt-0.5">
                    {price.subtitle}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 1 OF 2: LAPTOPS & CHROMEBOOKS (PRIMARY ITEMS SECTION)             */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-brand-700 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-0.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Section 1 • Verified Computing Hardware</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-charcoal-950 tracking-tight">
              Laptops &amp; Chromebooks
            </h2>
            <p className="text-xs sm:text-sm text-charcoal-500 font-medium mt-1">
              Handpicked HP, Dell, Lenovo ThinkPads &amp; Chromebooks with 1-month checking warranty.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Filter Switcher */}
            <div className="flex items-center p-1 rounded-2xl bg-charcoal-100 border border-charcoal-200 text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  activeTab === 'all'
                    ? 'bg-white text-charcoal-950 shadow-xs border border-charcoal-200'
                    : 'text-charcoal-600 hover:text-charcoal-950'
                }`}
              >
                All Laptops
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('chromebooks')}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  activeTab === 'chromebooks'
                    ? 'bg-white text-charcoal-950 shadow-xs border border-charcoal-200'
                    : 'text-charcoal-600 hover:text-charcoal-950'
                }`}
              >
                Chromebooks
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('deals')}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  activeTab === 'deals'
                    ? 'bg-white text-charcoal-950 shadow-xs border border-charcoal-200'
                    : 'text-charcoal-600 hover:text-charcoal-950'
                }`}
              >
                Best Deals
              </button>
            </div>

            <Link
              href="/laptops"
              className="text-xs sm:text-sm font-bold text-charcoal-800 hover:text-brand-700 inline-flex items-center gap-1 transition-colors shrink-0 ml-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-5">
            {[...Array(8)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : displayedLaptops.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-5">
            {displayedLaptops.slice(0, 8).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Laptops Inventory Synchronizing"
            description="Laptop units registered through the admin dashboard will automatically appear here."
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

      {/* ========================================================================= */}
      {/* SECTION 2 OF 2: LAPTOP ACCESSORIES (SECONDARY ITEMS SECTION)              */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 space-y-5">
        <div className="flex items-center justify-between mb-2">
          <div>
            <div className="flex items-center gap-1.5 text-brand-700 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-0.5">
              <Layers className="w-3.5 h-3.5" />
              <span>Section 2 • Original Power &amp; Gear</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-charcoal-950 tracking-tight">
              Laptop Accessories &amp; Upgrades
            </h2>
            <p className="text-xs sm:text-sm text-charcoal-500 font-medium mt-1">
              Original power adapters, padded backpacks, cooling stands, SSDs &amp; RAM memory upgrades.
            </p>
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

      {/* Customer Reviews & Video Testimonials */}
      <CustomerReviews />

      {/* WhatsApp Guidance CTA */}
      <WhatsAppCta />

      {/* 3 Store Locations (Lakki Marwat, Peshawar, Sargodha) */}
      <ContactPreview />
    </div>
  );
}
