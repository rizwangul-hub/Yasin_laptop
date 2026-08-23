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
      <Card hover className="p-5 sm:p-6 h-full flex flex-col justify-between relative overflow-hidden">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-lg bg-brand-950/60 text-brand-400 border border-brand-800/40 flex items-center justify-center group-hover:scale-110 group-hover:bg-brand-600 group-hover:text-white transition-all duration-300">
              {icon || <Folder className="w-5 h-5" />}
            </div>
            {typeof productCount === 'number' && (
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                {productCount} {productCount === 1 ? 'item' : 'items'}
              </span>
            )}
          </div>

          <div>
            <h3 className="text-base font-semibold text-slate-100 group-hover:text-brand-300 transition-colors">
              {name}
            </h3>
            {description && (
              <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                {description}
              </p>
            )}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs font-medium text-brand-400 group-hover:text-brand-300">
          <span>Explore Series</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </Card>
    </Link>
  );
};
