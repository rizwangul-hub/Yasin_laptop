import React from 'react';
import { CategoryCard } from '@/components/categories/CategoryCard';
import { Breadcrumbs } from '@/components/catalog/Breadcrumbs';
import { Briefcase, GraduationCap, Code2, Cpu, Zap, Layers, Sparkles } from 'lucide-react';

export const metadata = {
  title: 'Laptop Categories & Use Cases | Yasin Laptop Hub',
  description: 'Browse laptops by category: Business, Student, Programming, Gaming, High-Performance, and Chromebooks.',
};

const CATEGORIES = [
  {
    name: 'Business Laptops',
    slug: 'business-laptops',
    description: 'Enterprise-grade durability, security, and battery endurance (HP EliteBook, Dell Latitude, ThinkPad)',
    icon: <Briefcase className="w-5 h-5" />,
    href: '/categories/business-laptops',
  },
  {
    name: 'Student Laptops',
    slug: 'student-laptops',
    description: 'Affordable, reliable machines with long battery life for homework and university lectures',
    icon: <GraduationCap className="w-5 h-5" />,
    href: '/categories/student-laptops',
  },
  {
    name: 'Programming & Development',
    slug: 'programming-laptops',
    description: 'Multi-core computing power and high RAM capacity for coders, designers, and freelancers',
    icon: <Code2 className="w-5 h-5" />,
    href: '/categories/programming-laptops',
  },
  {
    name: 'Chromebooks',
    slug: 'chromebooks',
    description: 'Fast, secure, battery-efficient laptops for online study and everyday browsing',
    icon: <Cpu className="w-5 h-5" />,
    href: '/chromebooks',
  },
  {
    name: 'High Performance & Workstations',
    slug: 'high-performance',
    description: 'Heavy processing units for 3D rendering, CAD design, simulations, and video editing',
    icon: <Zap className="w-5 h-5" />,
    href: '/categories/high-performance',
  },
  {
    name: 'Laptop Accessories',
    slug: 'accessories',
    description: 'Original chargers, padded laptop backpacks, stands, and SSD upgrades',
    icon: <Layers className="w-5 h-5" />,
    href: '/accessories',
  },
];

export default function CategoriesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <Breadcrumbs items={[{ label: 'Categories' }]} />

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-brand-400 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Explore Categories</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Laptop Categories &amp; Workflows
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
          Select a category tailored to your academic field, enterprise workload, or personal computing needs.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {CATEGORIES.map((category) => (
          <CategoryCard
            key={category.slug}
            name={category.name}
            slug={category.slug}
            description={category.description}
            icon={category.icon}
            href={category.href}
          />
        ))}
      </div>
    </div>
  );
}
