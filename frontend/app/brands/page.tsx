import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Laptop, ChevronRight } from 'lucide-react';

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-white tracking-tight">Browse by Brand</h1>
        <p className="text-sm text-slate-400">
          We stock genuine laptops and machines from the world&apos;s leading manufacturers.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {BRANDS.map((brand) => (
          <Link key={brand.slug} href={`/laptops?brand=${brand.slug}`} className="group block">
            <Card hover className="p-6">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center font-bold text-white group-hover:bg-brand-600 transition-colors">
                  <Laptop className="w-6 h-6" />
                </div>
                <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-brand-300 group-hover:translate-x-1 transition-all" />
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-bold text-white group-hover:text-brand-300 transition-colors">
                  {brand.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1">{brand.tag}</p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
