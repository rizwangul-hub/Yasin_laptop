'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FilterGroupProps {
  title: string;
  defaultOpen?: boolean;
  count?: number;
  children: React.ReactNode;
}

export const FilterGroup: React.FC<FilterGroupProps> = ({
  title,
  defaultOpen = true,
  count,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-charcoal-200/80 py-4 last:border-b-0">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-xs font-bold text-charcoal-950 uppercase tracking-wider hover:text-brand-700 transition-colors"
      >
        <span className="flex items-center gap-1.5">
          <span>{title}</span>
          {typeof count === 'number' && count > 0 && (
            <span className="w-4 h-4 rounded-full bg-brand-500 text-charcoal-950 text-[10px] flex items-center justify-center font-bold">
              {count}
            </span>
          )}
        </span>
        {isOpen ? <ChevronUp className="w-4 h-4 text-charcoal-400" /> : <ChevronDown className="w-4 h-4 text-charcoal-400" />}
      </button>

      {isOpen && <div className="mt-3 space-y-2">{children}</div>}
    </div>
  );
};
