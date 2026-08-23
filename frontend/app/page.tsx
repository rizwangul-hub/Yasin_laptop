'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Hero } from '@/components/hero/Hero';
import { TrustStrip } from '@/components/home/TrustStrip';
import { CustomerJourney } from '@/components/home/CustomerJourney';
import { WhyChooseUs } from '@/components/home/WhyChooseUs';
import { WhatsAppCta } from '@/components/home/WhatsAppCta';
import { ContactPreview } from '@/components/home/ContactPreview';
import { CategoryCard } from '@/components/categories/CategoryCard';
import { ProductCard } from '@/components/products/ProductCard';
import { ProductCardSkeleton } from '@/components/products/ProductCardSkeleton';
import { AccessoryCard } from '@/components/accessories/AccessoryCard';
import { AccessoryCardSkeleton } from '@/components/accessories/AccessoryCardSkeleton';
import { EmptyState } from '@/components/common/EmptyState';
import { Button } from '@/components/ui/Button';
import { productService } from '@/services/productService';
import { IProduct, IAccessory } from '@/types';
import {
  Briefcase,
  GraduationCap,
  Code2,
  Cpu,
  Zap,
  Layers,
  Sparkles,
  Laptop,
  Tag,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';

const CATEGORIES = [
  {
    name: 'Business Laptops',
    slug: 'business-laptops',
    description: 'Durable, secure & high-endurance machines for enterprise work (HP EliteBook, Dell Latitude, Lenovo ThinkPad).',
    icon: <Briefcase className="w-5 h-5" />,
  },
  {
    name: 'Student Laptops',
    slug: 'student-laptops',
    description: 'Affordable, dependable laptops with long battery life for coursework and online classes.',
    icon: <GraduationCap className="w-5 h-5" />,
  },
  {
    name: 'Programming & Dev',
    slug: 'programming-laptops',
    description: 'Multi-core processing power and high RAM capacity for coders, designers, and software engineers.',
    icon: <Code2 className="w-5 h-5" />,
  },
  {
    name: 'Chromebooks',
    slug: 'chromebooks',
    description: 'Fast cloud computing, all-day battery life, and lightweight portability for students.',
    icon: <Cpu className="w-5 h-5" />,
  },
  {
    name: 'High Performance',
    slug: 'high-performance',
    description: 'Workstations and heavy-duty computing machines for video rendering, CAD, and simulations.',
    icon: <Zap className="w-5 h-5" />,
  },
  {
    name: 'Laptop Accessories',
    slug: 'accessories',
    description: 'Original chargers, padded backpacks, ergonomic stands, NVMe SSDs, and RAM upgrades.',
    icon: <Layers className="w-5 h-5" />,
  },
];

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<IProduct[]>([]);
  const [latestProducts, setLatestProducts] = useState<IProduct[]>([]);
  const [bestDeals, setBestDeals] = useState<IProduct[]>([]);
  const [accessories, setAccessories] = useState<IAccessory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadHomeData() {
      setIsLoading(true);
      setError(null);

      try {
        const [featuredRes, latestRes, dealsRes, accRes] = await Promise.allSettled([
          productService.getFeatured(),
          productService.getLatestArrivals(),
          productService.getBestDeals(),
          productService.getAccessories(),
        ]);

        if (!isMounted) return;

        if (featuredRes.status === 'fulfilled' && Array.isArray(featuredRes.value.data)) {
          setFeaturedProducts(featuredRes.value.data);
        }
        if (latestRes.status === 'fulfilled' && Array.isArray(latestRes.value.data)) {
          setLatestProducts(latestRes.value.data);
        }
        if (dealsRes.status === 'fulfilled' && Array.isArray(dealsRes.value.data)) {
          setBestDeals(dealsRes.value.data);
        }
        if (accRes.status === 'fulfilled' && Array.isArray(accRes.value.data)) {
          setAccessories(accRes.value.data as unknown as IAccessory[]);
        }
      } catch (err) {
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
      {/* 1. HERO BANNER */}
      <Hero mode="carousel" />

      {/* 2. VALUE / TRUST STRIP */}
      <TrustStrip />

      {/* 3. POPULAR CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-brand-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Explore Our Categories</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Find the Right Laptop for Your Needs
            </h2>
          </div>
          <Link
            href="/categories"
            className="text-xs sm:text-sm font-medium text-brand-400 hover:text-brand-300 inline-flex items-center gap-1 self-start sm:self-auto"
          >
            <span>All Categories</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {CATEGORIES.map((category) => (
            <CategoryCard
              key={category.slug}
              name={category.name}
              slug={category.slug}
              description={category.description}
              icon={category.icon}
            />
          ))}
        </div>
      </section>

      {/* 4. FEATURED LAPTOPS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-brand-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Laptop className="w-3.5 h-3.5" />
              <span>Verified Hardware</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Featured Laptops
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

      {/* 5. 4-STEP CUSTOMER JOURNEY */}
      <CustomerJourney />

      {/* 6. LATEST ARRIVALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-brand-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Zap className="w-3.5 h-3.5" />
              <span>Fresh Imports</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Latest Arrivals
            </h2>
          </div>
          <Link
            href="/laptops?filter=latest"
            className="text-xs sm:text-sm font-medium text-brand-400 hover:text-brand-300 inline-flex items-center gap-1 self-start sm:self-auto"
          >
            <span>View All New</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : latestProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {latestProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Fresh Shipment Being Processed"
            description="New laptops imported into stock will appear here with price in PKR and instant WhatsApp inquiries."
          />
        )}
      </section>

      {/* 7. BEST DEALS & BUDGET PICKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Tag className="w-3.5 h-3.5" />
              <span>Special Value</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Best Deals &amp; Budget Picks
            </h2>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : bestDeals.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestDeals.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Discounted Deals Refreshing"
            description="Special budget deals and price drops will be highlighted in this section."
          />
        )}
      </section>

      {/* 8. LAPTOP ACCESSORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-brand-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Layers className="w-3.5 h-3.5" />
              <span>Essential Upgrades</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Laptop Accessories
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

      {/* 9. WHY CHOOSE US TRUST SECTION */}
      <WhyChooseUs />

      {/* 10. WHATSAPP BOTTOM CTA */}
      <WhatsAppCta />

      {/* 11. CONTACT & LOCATION PREVIEW */}
      <ContactPreview />
    </div>
  );
}
