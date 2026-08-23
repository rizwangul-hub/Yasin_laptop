import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Laptop, ChevronRight, Sparkles } from 'lucide-react';
import { Breadcrumbs } from '@/components/catalog/Breadcrumbs';

export const metadata = {
  title: 'Laptop Brands | HP, Dell, Lenovo, Apple & more',
  description: 'Shop genuine imported laptops by top brands: HP, Dell, Lenovo, Acer, ASUS, and Apple at Yasin Laptop Hub.',
};

const BRANDS = [
  { name: 'HP', slug: 'hp', tag: 'EliteBook, ProBook, Pavilion, ZBook' },
  { name: 'Dell', slug: 'dell', tag: 'Latitude, XPS, Inspiron, Precision' },
  { name: 'Lenovo', slug: 'lenovo', tag: 'ThinkPad, IdeaPad, Yoga' },
  { name: 'Acer', slug: 'acer', tag: 'Swift, Aspire, TravelMate' },
  { name: 'ASUS', slug: 'asus', tag: 'ZenBook, VivoBook, ExpertBook' },
  { name: 'Apple', slug: 'apple', tag: 'MacBook Air, MacBook Pro' },
];

export default function BrandsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 bg-warm-bg">
      <Breadcrumbs items={[{ label: 'Brands' }]} />

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-brand-700 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Manufacturer Catalog</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-charcoal-950 tracking-tight">Browse by Brand</h1>
        <p className="text-sm text-charcoal-600 font-medium">
          We stock genuine laptops and machines from the world&apos;s leading manufacturers.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {BRANDS.map((brand) => (
          <Link key={brand.slug} href={`/laptops?brand=${brand.slug}`} className="group block">
            <Card
              hover
              className="p-6 bg-white border border-charcoal-200/90 shadow-soft hover:shadow-soft-md hover:border-brand-500/80 rounded-3xl transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-brand-50 border border-brand-200 text-brand-800 flex items-center justify-center font-bold group-hover:bg-brand-500 group-hover:text-charcoal-950 transition-colors shadow-xs">
                  <Laptop className="w-6 h-6" />
                </div>
                <ChevronRight className="w-5 h-5 text-charcoal-400 group-hover:text-brand-700 group-hover:translate-x-1 transition-all" />
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-black text-charcoal-950 group-hover:text-brand-700 transition-colors">
                  {brand.name}
                </h3>
                <p className="text-xs text-charcoal-500 mt-1 font-medium">{brand.tag}</p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
