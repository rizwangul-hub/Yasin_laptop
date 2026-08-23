import React from 'react';

interface ProductDescriptionProps {
  description?: string;
  name: string;
}

export const ProductDescription: React.FC<ProductDescriptionProps> = ({ description, name }) => {
  if (!description) return null;

  return (
    <section className="p-6 sm:p-8 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
      <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
        About {name}
      </h2>
      <div className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
        {description}
      </div>
    </section>
  );
};
