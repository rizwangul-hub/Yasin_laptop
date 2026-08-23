import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';

interface CatalogErrorStateProps {
  onRetry: () => void;
}

export const CatalogErrorState: React.FC<CatalogErrorStateProps> = ({ onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-14 text-center rounded-2xl border border-dashed border-rose-900/40 bg-rose-950/10 space-y-4">
      <div className="w-12 h-12 rounded-xl bg-rose-950/60 text-rose-400 border border-rose-800/60 flex items-center justify-center">
        <AlertCircle className="w-6 h-6" />
      </div>
      <div className="space-y-1 max-w-sm">
        <h3 className="text-base font-bold text-slate-100">Unable to load catalog</h3>
        <p className="text-xs text-slate-400">
          We encountered an issue connecting to the inventory server. Please try refreshing.
        </p>
      </div>

      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={onRetry}
        className="text-xs"
      >
        <RefreshCw className="w-3.5 h-3.5 mr-1" />
        <span>Try Again</span>
      </Button>
    </div>
  );
};
