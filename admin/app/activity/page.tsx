'use client';

import React, { useState, useEffect } from 'react';
import { adminApiClient } from '@/lib/api-client';
import { Activity, Clock, User, Tag, RefreshCw, Loader2, ShieldCheck } from 'lucide-react';

interface IActivityItem {
  _id: string;
  action: string;
  user: string;
  entityType: string;
  entityId?: string;
  details: string;
  createdAt: string;
}

export default function AdminActivityPage() {
  const [logs, setLogs] = useState<IActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadLogs = async () => {
    setIsLoading(true);
    try {
      const res = await adminApiClient<IActivityItem[]>('/activity?limit=50');
      if (res.success && res.data) setLogs(res.data);
    } catch (err) {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            System Activity &amp; Audit Trail
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Real-time chronological log of product creations, price changes, stock toggles, and catalog actions.
          </p>
        </div>

        <button
          onClick={loadLogs}
          disabled={isLoading}
          className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
          title="Refresh logs"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden">
        {isLoading ? (
          <div className="py-20 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-brand-400" />
            <span>Loading audit history...</span>
          </div>
        ) : logs.length > 0 ? (
          <div className="divide-y divide-slate-800/60">
            {logs.map((log) => (
              <div key={log._id} className="p-4 hover:bg-slate-900/40 transition-colors flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand-600/15 border border-brand-500/30 text-brand-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Activity className="w-4 h-4" />
                </div>

                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-xs text-white">{log.action}</span>
                    <span className="text-[10px] text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(log.createdAt).toLocaleString('en-PK')}</span>
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{log.details}</p>

                  <div className="flex items-center gap-2 pt-1 text-[10px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      <span>{log.user}</span>
                    </span>
                    <span>•</span>
                    <span className="uppercase px-1.5 py-0.2 rounded bg-slate-950 text-slate-400 border border-slate-800">
                      {log.entityType}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center space-y-3">
            <ShieldCheck className="w-12 h-12 text-slate-700 mx-auto" />
            <h3 className="text-base font-bold text-white">No audit logs recorded yet</h3>
            <p className="text-xs text-slate-400">Actions taken in the admin panel will stream here chronologically.</p>
          </div>
        )}
      </div>
    </div>
  );
}
