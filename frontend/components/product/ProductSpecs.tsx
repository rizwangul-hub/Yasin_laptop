import React from 'react';
import { IProduct } from '@/types';
import { Cpu, HardDrive, ShieldCheck } from 'lucide-react';

interface ProductSpecsProps {
  product: IProduct;
}

interface SpecItem {
  label: string;
  value?: string | boolean | null;
}

export const ProductSpecs: React.FC<ProductSpecsProps> = ({ product }) => {
  const brandName = typeof product.brand === 'object' && product.brand !== null ? product.brand.name : product.brand;

  const performanceSpecs: SpecItem[] = [
    { label: 'Brand', value: brandName },
    { label: 'Model', value: product.laptopModel || product.model },
    { label: 'Processor', value: product.specs?.processor },
    { label: 'Generation', value: product.specs?.generation },
    { label: 'RAM Capacity', value: product.specs?.ram },
    { label: 'RAM Type', value: product.specs?.ramType },
    { label: 'Graphics / GPU', value: product.specs?.graphics },
  ].filter((item) => Boolean(item.value));

  const storageDisplaySpecs: SpecItem[] = [
    { label: 'Storage Capacity', value: product.specs?.storage },
    { label: 'Storage Technology', value: product.specs?.storageType },
    { label: 'Screen / Display Size', value: product.specs?.displaySize },
    { label: 'Display Resolution', value: product.specs?.displayResolution },
  ].filter((item) => Boolean(item.value));

  const systemHardwareSpecs: SpecItem[] = [
    { label: 'Operating System', value: product.specs?.operatingSystem },
    { label: 'Color / Chassis', value: product.specs?.color },
    { label: 'Battery Information', value: product.specs?.battery },
    { label: 'Condition Rating', value: product.condition ? `${product.condition.replace('-', ' ')} condition` : null },
    { label: 'Charger', value: product.chargerIncluded ? 'Charger Included' : 'Not Included' },
    { label: 'Warranty Support', value: product.warranty || '1-Month Checking Warranty' },
  ].filter((item) => Boolean(item.value));

  return (
    <section className="space-y-6 pt-4">
      <div className="space-y-1">
        <h2 className="text-xl sm:text-2xl font-black text-charcoal-950 tracking-tight">
          Technical Specifications
        </h2>
        <p className="text-xs sm:text-sm text-charcoal-500 font-medium">
          Hardware components and features verified during physical shop diagnostics.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 1. PERFORMANCE */}
        {performanceSpecs.length > 0 && (
          <div className="p-6 rounded-3xl bg-white border border-charcoal-200/90 shadow-soft space-y-4">
            <div className="flex items-center gap-2 text-brand-800 font-bold text-sm">
              <div className="w-8 h-8 rounded-lg bg-brand-100 border border-brand-300 flex items-center justify-center">
                <Cpu className="w-4 h-4 text-brand-900" />
              </div>
              <span>Performance</span>
            </div>
            <dl className="space-y-3 text-xs">
              {performanceSpecs.map((item, idx) => (
                <div key={idx} className="flex items-start justify-between gap-2 border-b border-charcoal-100 pb-2 last:border-0 last:pb-0">
                  <dt className="text-charcoal-500 font-medium">{item.label}</dt>
                  <dd className="text-charcoal-950 font-bold text-right">{String(item.value)}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        {/* 2. STORAGE & DISPLAY */}
        {storageDisplaySpecs.length > 0 && (
          <div className="p-6 rounded-3xl bg-white border border-charcoal-200/90 shadow-soft space-y-4">
            <div className="flex items-center gap-2 text-brand-800 font-bold text-sm">
              <div className="w-8 h-8 rounded-lg bg-brand-100 border border-brand-300 flex items-center justify-center">
                <HardDrive className="w-4 h-4 text-brand-900" />
              </div>
              <span>Storage &amp; Screen</span>
            </div>
            <dl className="space-y-3 text-xs">
              {storageDisplaySpecs.map((item, idx) => (
                <div key={idx} className="flex items-start justify-between gap-2 border-b border-charcoal-100 pb-2 last:border-0 last:pb-0">
                  <dt className="text-charcoal-500 font-medium">{item.label}</dt>
                  <dd className="text-charcoal-950 font-bold text-right">{String(item.value)}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        {/* 3. HARDWARE & INCLUSIONS */}
        {systemHardwareSpecs.length > 0 && (
          <div className="p-6 rounded-3xl bg-white border border-charcoal-200/90 shadow-soft space-y-4">
            <div className="flex items-center gap-2 text-brand-800 font-bold text-sm">
              <div className="w-8 h-8 rounded-lg bg-brand-100 border border-brand-300 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-brand-900" />
              </div>
              <span>System &amp; Warranty</span>
            </div>
            <dl className="space-y-3 text-xs">
              {systemHardwareSpecs.map((item, idx) => (
                <div key={idx} className="flex items-start justify-between gap-2 border-b border-charcoal-100 pb-2 last:border-0 last:pb-0">
                  <dt className="text-charcoal-500 font-medium">{item.label}</dt>
                  <dd className="text-charcoal-950 font-bold text-right capitalize">{String(item.value)}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </div>
    </section>
  );
};
