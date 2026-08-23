import React from 'react';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/catalog/Breadcrumbs';
import {
  Laptop,
  Cpu,
  Layers,
  Sparkles,
  Wallet,
  Building2,
  Tag,
  ArrowRight,
  ArrowDownNarrowWide,
  ArrowUpNarrowWide,
  CheckCircle2,
} from 'lucide-react';

export const metadata = {
  title: 'Laptop Brands & Price Ranges | Yasin Laptop Hub',
  description: 'Browse laptops by brand (HP, Dell, Lenovo, Apple, Chromebooks) or by price budget (Under 30K to 100K+).',
};

const BRANDS = [
  {
    name: 'HP Laptops',
    desc: 'EliteBook, ProBook, Pavilion, and ZBook workstations with 1-month warranty.',
    href: '/laptops?brand=hp',
    badge: 'Popular',
    tag: 'EliteBook / ProBook',
  },
  {
    name: 'Dell Laptops',
    desc: 'Durable business Latitude, XPS ultrabooks, and Precision mobile workstations.',
    href: '/laptops?brand=dell',
    badge: 'Durable',
    tag: 'Latitude / XPS',
  },
  {
    name: 'Lenovo ThinkPad',
    desc: 'World-famous typing experience, ThinkPad T, X, L series and IdeaPads.',
    href: '/laptops?brand=lenovo',
    badge: 'Top Keyboard',
    tag: 'ThinkPad / Yoga',
  },
  {
    name: 'Chromebooks',
    desc: 'Fast boot, lightweight, long-lasting battery for study and office work.',
    href: '/chromebooks',
    badge: 'Budget Friendly',
    tag: 'HP / Dell / Acer',
  },
  {
    name: 'Apple MacBooks',
    desc: 'MacBook Air and MacBook Pro with Retina displays and long battery endurance.',
    href: '/laptops?brand=apple',
    badge: 'Premium',
    tag: 'Air / Pro Retina',
  },
  {
    name: 'Laptop Accessories',
    desc: 'Original chargers, padded backpacks, wireless mice, RAM modules and SSDs.',
    href: '/accessories',
    badge: 'Original Gear',
    tag: 'Power & Storage',
  },
];

const PRICE_RANGES = [
  {
    title: 'Under Rs. 30,000',
    subtitle: 'Budget & student friendly laptops for daily use',
    href: '/laptops?maxPrice=30000',
    badge: 'Entry Level',
    icon: Wallet,
  },
  {
    title: 'Rs. 30,000 – 40,000',
    subtitle: 'Core i5 6th, 7th & 8th Gen with SSD storage',
    href: '/laptops?minPrice=30000&maxPrice=40000',
    badge: 'Best Value',
    icon: Tag,
  },
  {
    title: 'Rs. 40,000 – 50,000',
    subtitle: 'Core i5 / i7 8th Gen with 8GB–16GB RAM',
    href: '/laptops?minPrice=40000&maxPrice=50000',
    badge: 'Most Popular',
    icon: Sparkles,
  },
  {
    title: 'Rs. 50,000 – 70,000',
    subtitle: 'Core i7, 16GB RAM, NVMe PCIe high speed',
    href: '/laptops?minPrice=50000&maxPrice=70000',
    badge: 'Fast Performance',
    icon: Cpu,
  },
  {
    title: 'Rs. 70,000 – 100,000',
    subtitle: 'Premium slim business & FHD touch screens',
    href: '/laptops?minPrice=70000&maxPrice=100000',
    badge: 'Premium Business',
    icon: Laptop,
  },
  {
    title: 'Above Rs. 100,000',
    subtitle: 'High-end workstations, GPU machines & MacBooks',
    href: '/laptops?minPrice=100000',
    badge: 'Flagship',
    icon: Layers,
  },
];

export default function CategoriesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12 bg-warm-bg">
      <Breadcrumbs items={[{ label: 'Categories' }]} />

      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-brand-700 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Catalog Explorer</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-charcoal-950 tracking-tight">
          Browse by Brand &amp; Price Budget
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-600 max-w-2xl font-medium">
          Select laptops by manufacturer (HP, Dell, Lenovo, Apple) or directly by your budget range.
        </p>
      </div>

      {/* 1. BRANDS SECTION */}
      <section className="space-y-5">
        <div className="flex items-center justify-between border-b border-charcoal-200 pb-3">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-brand-700" />
            <h2 className="text-lg sm:text-xl font-black text-charcoal-950">Shop by Brand</h2>
          </div>
          <Link
            href="/brands"
            className="text-xs font-bold text-charcoal-800 hover:text-brand-700 inline-flex items-center gap-1"
          >
            <span>All Brands</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {BRANDS.map((brand, i) => (
            <Link
              key={i}
              href={brand.href}
              className="p-6 rounded-3xl bg-white border border-charcoal-200/90 shadow-soft hover:shadow-soft-md hover:border-brand-500/80 hover:-translate-y-1 transition-all duration-200 group flex flex-col justify-between space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-brand-50 border border-brand-200 text-brand-900 font-black text-base flex items-center justify-center group-hover:bg-brand-500 group-hover:text-charcoal-950 transition-colors shadow-xs">
                  {brand.name.split(' ')[0]}
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-charcoal-100 text-charcoal-700 border border-charcoal-200">
                  {brand.badge}
                </span>
              </div>

              <div>
                <h3 className="text-base sm:text-lg font-black text-charcoal-950 group-hover:text-brand-700 transition-colors">
                  {brand.name}
                </h3>
                <p className="text-xs text-charcoal-500 line-clamp-2 font-medium mt-1 leading-relaxed">
                  {brand.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-charcoal-100 flex items-center justify-between text-xs font-bold text-charcoal-800 group-hover:text-brand-700">
                <span>View Inventory</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 2. BUDGET / PRICE RANGES SECTION */}
      <section className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-charcoal-200 pb-3 gap-2">
          <div className="flex items-center gap-2">
            <Wallet className="w-4 h-4 text-brand-700" />
            <h2 className="text-lg sm:text-xl font-black text-charcoal-950">Shop by Budget Range</h2>
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {PRICE_RANGES.map((price, i) => {
            const Icon = price.icon;
            return (
              <Link
                key={i}
                href={price.href}
                className="p-6 rounded-3xl bg-white border border-charcoal-200/90 shadow-soft hover:shadow-soft-md hover:border-brand-500/80 hover:-translate-y-1 transition-all duration-200 group flex flex-col justify-between space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center justify-center group-hover:bg-brand-500 group-hover:text-charcoal-950 transition-colors shadow-xs">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-charcoal-100 text-charcoal-700 border border-charcoal-200">
                    {price.badge}
                  </span>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-black text-charcoal-950 group-hover:text-brand-700 transition-colors">
                    {price.title}
                  </h3>
                  <p className="text-xs text-charcoal-500 font-medium mt-1 leading-relaxed">
                    {price.subtitle}
                  </p>
                </div>

                <div className="pt-3 border-t border-charcoal-100 flex items-center justify-between text-xs font-bold text-charcoal-800 group-hover:text-brand-700">
                  <span>Browse Laptops</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
