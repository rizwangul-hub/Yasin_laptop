'use client';

import React, { useState, useEffect } from 'react';
import { adminApiClient } from '@/lib/api-client';
import { Layers, Plus, Edit, Trash2, AlertCircle, Loader2 } from 'lucide-react';

interface IAccessory {
  _id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  condition: string;
  stockStatus: string;
  description?: string;
}

export default function AdminAccessoriesPage() {
  const [accessories, setAccessories] = useState<IAccessory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    category: 'Chargers',
    price: 0,
    condition: 'new',
    stockStatus: 'available',
    description: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAccessories = async () => {
    setIsLoading(true);
    try {
      const res = await adminApiClient<IAccessory[]>('/accessories');
      if (res.success && res.data) setAccessories(res.data);
    } catch (err) {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAccessories();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setFormData({
      name: '',
      slug: '',
      category: 'Chargers',
      price: 0,
      condition: 'new',
      stockStatus: 'available',
      description: '',
    });
    setError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (acc: IAccessory) => {
    setEditingId(acc._id);
    setFormData({
      name: acc.name,
      slug: acc.slug,
      category: acc.category || 'Chargers',
      price: acc.price || 0,
      condition: acc.condition || 'new',
      stockStatus: acc.stockStatus || 'available',
      description: acc.description || '',
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
      const endpoint = editingId ? `/accessories/${editingId}` : '/accessories';
      const method = editingId ? 'PUT' : 'POST';

      const res = await adminApiClient(endpoint, {
        method,
        body: JSON.stringify(formData),
      });

      if (res.success) {
        setIsModalOpen(false);
        loadAccessories();
      } else {
        setError(res.message || 'Failed to save accessory');
      }
    } catch (err) {
      setError('Connection failure while saving accessory');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to archive this accessory?')) return;
    try {
      const res = await adminApiClient(`/accessories/${id}`, { method: 'DELETE' });
      if (res.success) loadAccessories();
    } catch (err) {}
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Accessories Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Power adapters, laptop backpacks, stands, mice, RAM modules, and NVMe SSDs.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Add Accessory</span>
        </button>
      </div>

      <div className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden">
        {isLoading ? (
          <div className="py-20 text-center text-xs text-slate-400">Loading accessories...</div>
        ) : accessories.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Item</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Price (PKR)</th>
                  <th className="py-3.5 px-4">Condition</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {accessories.map((a) => (
                  <tr key={a._id} className="hover:bg-slate-900/40">
                    <td className="py-3.5 px-4 font-bold text-white">{a.name}</td>
                    <td className="py-3.5 px-4 text-slate-400">{a.category}</td>
                    <td className="py-3.5 px-4 font-bold text-white">Rs. {a.price?.toLocaleString('en-PK')}</td>
                    <td className="py-3.5 px-4 capitalize text-slate-400">{a.condition}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        a.stockStatus === 'available' ? 'bg-emerald-950 text-emerald-300' : 'bg-rose-950 text-rose-300'
                      }`}>
                        {a.stockStatus === 'available' ? 'In Stock' : 'Sold Out'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(a)}
                        className="p-1.5 rounded-lg bg-brand-600/20 text-brand-400 hover:text-brand-300"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(a._id)}
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
            <Layers className="w-12 h-12 text-slate-700 mx-auto" />
            <p className="text-xs text-slate-400">No accessories registered yet.</p>
            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-600 text-white text-xs font-semibold"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add First Accessory</span>
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
              {editingId ? 'Edit Accessory' : 'New Accessory'}
            </h3>

            {error && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-xs text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Item Title *</label>
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
                  placeholder="e.g. 65W Original HP Type-C Charger"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-brand-500"
                  >
                    <option value="Chargers">Chargers / Adapters</option>
                    <option value="Laptop Bags">Laptop Bags &amp; Sleeves</option>
                    <option value="Laptop Stands">Laptop Stands &amp; Cooling</option>
                    <option value="RAM">RAM Modules</option>
                    <option value="SSD">NVMe / SATA SSD</option>
                    <option value="Mice">Mouse &amp; Keyboards</option>
                    <option value="Cables">Cables &amp; Converters</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Price (PKR) *</label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-brand-500 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Condition</label>
                  <select
                    value={formData.condition}
                    onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-brand-500"
                  >
                    <option value="new">New (Original Pack)</option>
                    <option value="used">Inspected Used</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Stock</label>
                  <select
                    value={formData.stockStatus}
                    onChange={(e) => setFormData({ ...formData, stockStatus: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-brand-500"
                  >
                    <option value="available">Available (In Stock)</option>
                    <option value="sold_out">Sold Out</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Compatibility and wattage details..."
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
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Save Accessory</span>}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
