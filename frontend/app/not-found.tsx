import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Laptop, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-16 space-y-6 bg-warm-bg">
      <div className="w-16 h-16 rounded-2xl bg-brand-50 border border-brand-200 text-brand-700 flex items-center justify-center shadow-xs">
        <Laptop className="w-8 h-8" />
      </div>
      <div className="space-y-2 max-w-md">
        <h1 className="text-3xl font-black text-charcoal-950">Page Not Found</h1>
        <p className="text-sm text-charcoal-500 font-medium">
          The requested page could not be located. You can return to the storefront homepage or browse available laptops.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Link href="/">
          <Button variant="primary" size="md">
            <Home className="w-4 h-4 mr-2" />
            <span>Go Home</span>
          </Button>
        </Link>
        <Link href="/laptops">
          <Button variant="secondary" size="md">
            <span>Browse Laptops</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
