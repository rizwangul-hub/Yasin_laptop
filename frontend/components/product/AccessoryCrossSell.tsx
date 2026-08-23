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
    <section className="space-y-6 pt-6 border-t border-slate-800">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-emerald-600/15 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
          <Layers className="w-4 h-4" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Complete Your Setup
          </h2>
          <p className="text-xs text-slate-400">
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
