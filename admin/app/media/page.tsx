'use client';

import React, { useState, useEffect } from 'react';
import { adminApiClient } from '@/lib/api-client';
import { Image as ImageIcon, Trash2, ExternalLink, RefreshCw, Loader2, AlertCircle, Check } from 'lucide-react';

interface IMediaAsset {
  url: string;
  publicId: string;
  usedIn: string[];
  lastSeen: string;
}

export default function AdminMediaPage() {
  const [mediaList, setMediaList] = useState<IMediaAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModalAsset, setDeleteModalAsset] = useState<IMediaAsset | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadMedia = async () => {
    setIsLoading(true);
    try {
      const res = await adminApiClient<IMediaAsset[]>('/media');
      if (res.success && res.data) setMediaList(res.data);
    } catch (err) {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMedia();
  }, []);

  const handleDeleteConfirm = async (force = false) => {
    if (!deleteModalAsset) return;
    setIsDeleting(true);
    setError(null);

    try {
      const res = await adminApiClient('/media/delete', {
        method: 'POST',
        body: JSON.stringify({
          publicId: deleteModalAsset.publicId,
          url: deleteModalAsset.url,
          force,
        }),
      });

      if (res.success) {
        setMediaList((prev) => prev.filter((m) => m.url !== deleteModalAsset.url));
        setDeleteModalAsset(null);
      } else {
        setError(res.message || 'Failed to delete asset');
      }
    } catch (err) {
      setError('Connection failure while deleting media');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Media Asset Library
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            {mediaList.length} Cloudinary images and product gallery assets registered.
          </p>
        </div>

        <button
          onClick={loadMedia}
          disabled={isLoading}
          className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
          title="Refresh library"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-800 text-xs text-rose-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {isLoading ? (
        <div className="py-20 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-brand-400" />
          <span>Cataloging active media assets...</span>
        </div>
      ) : mediaList.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {mediaList.map((m, idx) => (
            <div
              key={idx}
              className="p-2 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2 flex flex-col justify-between group overflow-hidden"
            >
              <div className="relative aspect-square w-full rounded-xl bg-slate-950 flex items-center justify-center overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={m.url}
                  alt="Asset"
                  className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="px-1.5 py-0.5 rounded bg-brand-950 text-brand-400 font-semibold border border-brand-800/40">
                    {m.usedIn.length} ref{m.usedIn.length === 1 ? '' : 's'}
                  </span>
                  <div className="flex items-center gap-1">
                    <a
                      href={m.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 text-slate-400 hover:text-white"
                      title="Open full resolution"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <button
                      onClick={() => setDeleteModalAsset(m)}
                      className="p-1 text-rose-400 hover:text-rose-300"
                      title="Delete asset"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div className="text-[10px] text-slate-500 truncate" title={m.usedIn.join(', ')}>
                  {m.usedIn[0] || 'Unused'}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-16 text-center space-y-3 bg-slate-900/40 rounded-2xl border border-slate-800">
          <ImageIcon className="w-12 h-12 text-slate-700 mx-auto" />
          <h3 className="text-base font-bold text-white">No media cataloged yet</h3>
          <p className="text-xs text-slate-400">Photos uploaded during product creation will appear here.</p>
        </div>
      )}

      {/* Delete Reference Safety Modal */}
      {deleteModalAsset && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Delete Media Asset?</h3>

            {deleteModalAsset.usedIn.length > 0 && (
              <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-800/60 text-xs text-amber-300 space-y-1">
                <strong>Reference Warning:</strong>
                <p>This image is currently used in {deleteModalAsset.usedIn.length} location(s):</p>
                <ul className="list-disc pl-4 text-[11px] text-amber-400/80">
                  {deleteModalAsset.usedIn.slice(0, 3).map((u, i) => (
                    <li key={i}>{u}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteModalAsset(null)}
                className="py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isDeleting}
                onClick={() => handleDeleteConfirm(deleteModalAsset.usedIn.length > 0)}
                className="py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-md flex items-center justify-center gap-1.5"
              >
                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Confirm Delete</span>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
