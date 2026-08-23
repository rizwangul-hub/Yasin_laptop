import React from 'react';

interface ProductDescriptionProps {
  description?: string;
  name: string;
}

export const ProductDescription: React.FC<ProductDescriptionProps> = ({ description, name }) => {
  if (!description) return null;

  return (
    <section className="p-8 rounded-3xl bg-white border border-charcoal-200/90 shadow-soft space-y-3">
      <h2 className="text-xl font-black text-charcoal-950 tracking-tight">
        About {name}
      </h2>
      <div className="text-xs sm:text-sm text-charcoal-700 leading-relaxed whitespace-pre-line font-normal">
        {description}
      </div>
    </section>
  );
};
