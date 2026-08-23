'use client';

import React, { useState, useEffect } from 'react';
import { adminApiClient } from '@/lib/api-client';
import { Image as ImageIcon, Plus, Edit, Trash2, Check, AlertCircle, Loader2 } from 'lucide-react';

interface IHeroMedia {
  _id: string;
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  sortOrder?: number;
  isActive: boolean;
}

export default function AdminHeroMediaPage() {
  const [slides, setSlides] = useState<IHeroMedia[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    ctaText: 'View Laptops',
    ctaLink: '/laptops',
    sortOrder: 0,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSlides = async () => {
    setIsLoading(true);
    try {
      const res = await adminApiClient<IHeroMedia[]>('/hero');
      if (res.success && res.data) setSlides(res.data);
    } catch (err) {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSlides();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setFormData({
      title: '',
      subtitle: '',
      ctaText: 'View Laptops',
      ctaLink: '/laptops',
      sortOrder: slides.length + 1,
    });
    setError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (s: IHeroMedia) => {
    setEditingId(s._id);
    setFormData({
      title: s.title || '',
      subtitle: s.subtitle || '',
      ctaText: s.ctaText || 'View Laptops',
      ctaLink: s.ctaLink || '/laptops',
      sortOrder: s.sortOrder || 0,
    });
    setError(null);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      const endpoint = editingId ? `/hero/${editingId}` : '/hero';
      const method = editingId ? 'PUT' : 'POST';

      const res = await adminApiClient(endpoint, {
        method,
        body: JSON.stringify(formData),
      });

      if (res.success) {
        setIsModalOpen(false);
        loadSlides();
      } else {
        setError(res.message || 'Failed to save slide');
      }
    } catch (err) {
      setError('Connection failure while saving hero media');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this hero slide?')) return;
    try {
      const res = await adminApiClient(`/hero/${id}`, { method: 'DELETE' });
      if (res.success) loadSlides();
    } catch (err) {}
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Hero Media &amp; Banner Slides
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Homepage hero rotating banner slides (3.5s smooth crossfade carousel).
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Add Hero Slide</span>
        </button>
      </div>

      <div className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden">
        {isLoading ? (
          <div className="py-20 text-center text-xs text-slate-400">Loading hero media...</div>
        ) : slides.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Slide Heading</th>
                  <th className="py-3.5 px-4">Subtitle</th>
                  <th className="py-3.5 px-4">CTA Button</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {slides.map((s) => (
                  <tr key={s._id} className="hover:bg-slate-900/40">
                    <td className="py-3.5 px-4 font-bold text-white max-w-xs truncate">{s.title || '—'}</td>
                    <td className="py-3.5 px-4 text-slate-400 max-w-sm truncate">{s.subtitle || '—'}</td>
                    <td className="py-3.5 px-4 text-brand-400">{s.ctaText} ({s.ctaLink})</td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(s)}
                        className="p-1.5 rounded-lg bg-brand-600/20 text-brand-400 hover:text-brand-300"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(s._id)}
                        className="p-1.5 rounded-lg bg-rose-950/40 text-rose-400 hover:text-rose-300"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center space-y-3">
            <ImageIcon className="w-12 h-12 text-slate-700 mx-auto" />
            <p className="text-xs text-slate-400">Default homepage slides active.</p>
            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-600 text-white text-xs font-semibold"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Custom Slide</span>
            </button>
          </div>
        )}
      </div>

      {/* Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleSave}
            className="max-w-md w-full p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-2xl"
          >
            <h3 className="text-base font-bold text-white">
              {editingId ? 'Edit Hero Slide' : 'New Hero Slide'}
            </h3>

            {error && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-xs text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Slide Title / Headline</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Quality Business & Work Laptops"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Slide Subtitle</label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="e.g. Tested HP EliteBooks, Dell Latitudes and ThinkPads."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">CTA Label</label>
                  <input
                    type="text"
                    value={formData.ctaText}
                    onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">CTA Link</label>
                  <input
                    type="text"
                    value={formData.ctaLink}
                    onChange={(e) => setFormData({ ...formData, ctaLink: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-md flex items-center justify-center gap-1.5"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Save Slide</span>}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
