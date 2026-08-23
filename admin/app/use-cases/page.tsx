'use client';

import React, { useState, useEffect } from 'react';
import { adminApiClient } from '@/lib/api-client';
import { Cpu, Plus, Edit, Trash2, Check, AlertCircle, Loader2 } from 'lucide-react';

interface IUseCase {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
}

export default function AdminUseCasesPage() {
  const [useCases, setUseCases] = useState<IUseCase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', slug: '', description: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadUseCases = async () => {
    setIsLoading(true);
    try {
      const res = await adminApiClient<IUseCase[]>('/use-cases');
      if (res.success && res.data) setUseCases(res.data);
    } catch (err) {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUseCases();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setFormData({ name: '', slug: '', description: '' });
    setError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (uc: IUseCase) => {
    setEditingId(uc._id);
    setFormData({
      name: uc.name,
      slug: uc.slug,
      description: uc.description || '',
    });
    setError(null);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setIsSaving(true);
    setError(null);

    try {
      const endpoint = editingId ? `/use-cases/${editingId}` : '/use-cases';
      const method = editingId ? 'PUT' : 'POST';

      const res = await adminApiClient(endpoint, {
        method,
        body: JSON.stringify(formData),
      });

      if (res.success) {
        setIsModalOpen(false);
        loadUseCases();
      } else {
        setError(res.message || 'Failed to save use case');
      }
    } catch (err) {
      setError('Connection failure while saving use case');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to archive this use case?')) return;
    try {
      const res = await adminApiClient(`/use-cases/${id}`, { method: 'DELETE' });
      if (res.success) loadUseCases();
    } catch (err) {}
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Use Case Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Workflows and customer purposes (Programming, Gaming, Student, Freelancing, Video Editing, etc.)
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Add Use Case</span>
        </button>
      </div>

      <div className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden">
        {isLoading ? (
          <div className="py-20 text-center text-xs text-slate-400">Loading use cases...</div>
        ) : useCases.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Name</th>
                  <th className="py-3.5 px-4">Slug</th>
                  <th className="py-3.5 px-4">Description</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {useCases.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-900/40">
                    <td className="py-3.5 px-4 font-bold text-white">{u.name}</td>
                    <td className="py-3.5 px-4 text-slate-400">{u.slug}</td>
                    <td className="py-3.5 px-4 text-slate-400 max-w-sm truncate">{u.description || '—'}</td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(u)}
                        className="p-1.5 rounded-lg bg-brand-600/20 text-brand-400 hover:text-brand-300"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(u._id)}
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
            <Cpu className="w-12 h-12 text-slate-700 mx-auto" />
            <p className="text-xs text-slate-400">No use cases created yet.</p>
            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-600 text-white text-xs font-semibold"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add First Use Case</span>
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
              {editingId ? 'Edit Use Case' : 'New Use Case'}
            </h3>

            {error && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-xs text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Use Case Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: e.target.value,
                      slug: !editingId
                        ? e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
                        : formData.slug,
                    })
                  }
                  placeholder="e.g. Programming & Development"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Slug</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="e.g. programming"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief workflow description..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-brand-500"
                />
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
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Save Use Case</span>}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
