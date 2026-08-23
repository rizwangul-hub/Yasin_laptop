import React from 'react';
import { IAccessory } from '@/types';
import { AccessoryCard } from '../accessories/AccessoryCard';
import { Layers } from 'lucide-react';

interface AccessoryCrossSellProps {
  accessories: IAccessory[];
}

export const AccessoryCrossSell: React.FC<AccessoryCrossSellProps> = ({ accessories }) => {
  if (!accessories || accessories.length === 0) return null;

  return (
    <section className="space-y-6 pt-8 border-t border-charcoal-200/80">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-brand-100 border border-brand-300 text-brand-900 flex items-center justify-center shadow-xs">
          <Layers className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-charcoal-950 tracking-tight">
            Complete Your Setup
          </h2>
          <p className="text-xs text-charcoal-500 font-medium">
            Original power adapters, padded backpacks, stands, and memory upgrades.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {accessories.slice(0, 4).map((acc) => (
          <AccessoryCard key={acc._id} accessory={acc} />
        ))}
      </div>
    </section>
  );
};
