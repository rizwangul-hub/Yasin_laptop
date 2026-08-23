'use client';

import React, { useState } from 'react';
import { Laptop, Lock, ShieldCheck, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    setError(null);

    const result = await login(email, password);
    if (result.success) {
      router.push('/');
    } else {
      setError(result.message || 'Invalid admin credentials');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-warm-bg">
      <div className="max-w-md w-full space-y-8 p-8 sm:p-10 rounded-3xl bg-white border border-charcoal-200/90 shadow-soft">
        <div className="text-center space-y-2">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-brand-50 border border-brand-200 text-brand-800 flex items-center justify-center shadow-xs">
            <Laptop className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-charcoal-950 tracking-tight">Admin Portal</h1>
          <p className="text-xs text-charcoal-500 font-medium">Yasin Laptop Hub • Management Control Access</p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-charcoal-900 mb-1.5">
                Admin Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@yasinlaptophub.com"
                className="w-full px-4 py-2.5 rounded-xl bg-charcoal-50 border border-charcoal-200 text-charcoal-950 text-xs focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-400/30 transition-all font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal-900 mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-2.5 rounded-xl bg-charcoal-50 border border-charcoal-200 text-charcoal-950 text-xs focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-400/30 transition-all font-medium"
              />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-charcoal-50 border border-charcoal-200 text-[11px] text-charcoal-600 flex items-center gap-2 font-medium">
            <ShieldCheck className="w-4 h-4 text-brand-600 shrink-0" />
            <span>Protected by secure JWT session &amp; bcrypt password hashing.</span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-brand-500 hover:bg-brand-400 text-charcoal-950 font-bold text-xs shadow-sm transition-all cursor-pointer disabled:opacity-50 hover:scale-105 active:scale-95"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5" />
                <span>Authenticate Session</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2">
          <a
            href={process.env.NEXT_PUBLIC_SITE_URL || 'https://yasin-laptop-hub.vercel.app'}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-charcoal-500 hover:text-charcoal-950 font-medium transition-colors"
          >
            ← Return to Public Customer Store
          </a>
        </div>
      </div>
    </div>
  );
}
