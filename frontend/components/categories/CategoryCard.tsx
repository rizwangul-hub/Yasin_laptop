import React, { ReactNode } from 'react';
import Link from 'next/link';
import { Card } from '../ui/Card';
import { ChevronRight, Folder } from 'lucide-react';

interface CategoryCardProps {
  name: string;
  slug: string;
  description?: string;
  productCount?: number;
  icon?: ReactNode;
  href?: string;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  name,
  slug,
  description,
  productCount,
  icon,
  href,
}) => {
  const targetUrl = href || `/categories?slug=${slug}`;

  return (
    <Link href={targetUrl} className="group block">
      <Card
        hover
        className="p-6 h-full flex flex-col justify-between relative overflow-hidden bg-white border border-charcoal-200/90 shadow-soft hover:shadow-soft-md hover:border-brand-500/80 rounded-3xl transition-all duration-300"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-800 border border-brand-200 flex items-center justify-center group-hover:scale-105 group-hover:bg-brand-500 group-hover:text-charcoal-950 transition-all duration-300 shadow-xs">
              {icon || <Folder className="w-6 h-6" />}
            </div>
            {typeof productCount === 'number' && (
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-charcoal-100 text-charcoal-700 border border-charcoal-200">
                {productCount} {productCount === 1 ? 'item' : 'items'}
              </span>
            )}
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-black text-charcoal-950 group-hover:text-brand-700 transition-colors">
              {name}
            </h3>
            {description && (
              <p className="text-xs text-charcoal-500 line-clamp-2 mt-1.5 font-medium leading-relaxed">
                {description}
              </p>
            )}
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-charcoal-100 flex items-center justify-between text-xs font-bold text-charcoal-800 group-hover:text-brand-700">
          <span>Explore Series</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </Card>
    </Link>
  );
};
