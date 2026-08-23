import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push('...');
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-between border-t border-charcoal-200/80 pt-6 mt-8">
      {/* Mobile view */}
      <div className="flex sm:hidden items-center justify-between w-full">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl bg-white border border-charcoal-200 text-xs font-bold text-charcoal-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-charcoal-50 transition-colors shadow-soft"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        <span className="text-xs text-charcoal-600 font-medium">
          Page <strong className="text-charcoal-950 font-bold">{currentPage}</strong> of <strong className="text-charcoal-950 font-bold">{totalPages}</strong>
        </span>

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl bg-white border border-charcoal-200 text-xs font-bold text-charcoal-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-charcoal-50 transition-colors shadow-soft"
        >
          <span>Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Desktop view */}
      <div className="hidden sm:flex items-center justify-between w-full">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-charcoal-200 text-xs font-bold text-charcoal-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-charcoal-50 hover:text-charcoal-950 transition-colors shadow-soft"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        <div className="flex items-center gap-1.5">
          {getPageNumbers().map((page, index) => {
            if (page === '...') {
              return (
                <span key={`dots-${index}`} className="px-2 text-xs text-charcoal-400 font-bold select-none">
                  •••
                </span>
              );
            }

            const pageNum = page as number;
            const isActive = pageNum === currentPage;

            return (
              <button
                key={pageNum}
                type="button"
                onClick={() => onPageChange(pageNum)}
                className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-brand-500 text-charcoal-950 border border-brand-500 shadow-xs'
                    : 'bg-white border border-charcoal-200 text-charcoal-800 hover:bg-charcoal-50 hover:text-charcoal-950'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-charcoal-200 text-xs font-bold text-charcoal-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-charcoal-50 hover:text-charcoal-950 transition-colors shadow-soft"
        >
          <span>Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
