'use client';

import React, { useState, useEffect } from 'react';
import { adminApiClient } from '@/lib/api-client';
import {
  Layers,
  Plus,
  Edit,
  Trash2,
  AlertCircle,
  Loader2,
  UploadCloud,
  Image as ImageIcon,
  Check,
  Search,
  ExternalLink,
} from 'lucide-react';

interface IAccessoryImage {
  url: string;
  publicId: string;
  alt?: string;
  isPrimary?: boolean;
}

interface IAccessory {
  _id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  previousPrice?: number;
  condition: string;
  stockStatus: string;
  description?: string;
  images?: IAccessoryImage[];
  featured?: boolean;
  createdAt?: string;
}

export default function AdminAccessoriesPage() {
  const [accessories, setAccessories] = useState<IAccessory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const [formData, setFormData] = useState<{
    name: string;
    slug: string;
    category: string;
    price: number;
    previousPrice?: number;
    condition: string;
    stockStatus: string;
    description: string;
    images: IAccessoryImage[];
    featured: boolean;
  }>({
    name: '',
    slug: '',
    category: 'Chargers',
    price: 0,
    previousPrice: undefined,
    condition: 'new',
    stockStatus: 'available',
    description: '',
    images: [],
    featured: false,
  });

  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const loadAccessories = async () => {
    setIsLoading(true);
    try {
      const res = await adminApiClient<IAccessory[]>('/accessories');
      if (res.success && res.data) setAccessories(res.data);
    } catch {
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
      previousPrice: undefined,
      condition: 'new',
      stockStatus: 'available',
      description: '',
      images: [],
      featured: false,
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
      previousPrice: acc.previousPrice,
      condition: acc.condition || 'new',
      stockStatus: acc.stockStatus || 'available',
      description: acc.description || '',
      images: acc.images || [],
      featured: acc.featured || false,
    });
    setError(null);
    setIsModalOpen(true);
  };

  // Upload image to Cloudinary
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setError(null);

    try {
      const fileList = Array.from(files);
      const newImages: IAccessoryImage[] = [];

      for (const file of fileList) {
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        const uploadRes = await adminApiClient<{
          url: string;
          publicId: string;
        }>('/upload', {
          method: 'POST',
          body: JSON.stringify({ image: base64, folder: 'yasin-accessories' }),
        });

        if (uploadRes.success && uploadRes.data) {
          newImages.push({
            url: uploadRes.data.url,
            publicId: uploadRes.data.publicId,
            alt: formData.name || 'Accessory Photo',
            isPrimary: formData.images.length === 0 && newImages.length === 0,
          });
        }
      }

      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...newImages],
      }));
    } catch {
      setError('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const removeImage = (idx: number) => {
    setFormData((prev) => {
      const filtered = prev.images.filter((_, i) => i !== idx);
      if (filtered.length > 0 && !filtered.some((img) => img.isPrimary)) {
        filtered[0].isPrimary = true;
      }
      return { ...prev, images: filtered };
    });
  };

  const setPrimaryImage = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.map((img, i) => ({ ...img, isPrimary: i === idx })),
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Please provide an accessory item name.');
      return;
    }
    if (!formData.price || Number(formData.price) <= 0) {
      setError('Please enter a valid price greater than 0.');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const endpoint = editingId ? `/accessories/${editingId}` : '/accessories';
      const method = editingId ? 'PUT' : 'POST';

      const payload = {
        ...formData,
        description: formData.description.trim() || formData.name.trim(),
      };

      const res = await adminApiClient(endpoint, {
        method,
        body: JSON.stringify(payload),
      });

      if (res.success) {
        setIsModalOpen(false);
        setSuccessMsg(editingId ? 'Accessory updated successfully!' : 'Accessory published successfully!');
        setTimeout(() => setSuccessMsg(null), 3000);
        loadAccessories();
      } else {
        setError(res.message || 'Failed to save accessory');
      }
    } catch {
      setError('Connection failure while saving accessory');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this accessory?')) return;
    try {
      const res = await adminApiClient(`/accessories/${id}`, { method: 'DELETE' });
      if (res.success) {
        setSuccessMsg('Accessory removed.');
        setTimeout(() => setSuccessMsg(null), 2500);
        loadAccessories();
      }
    } catch {
      // Fallback
    }
  };

  const filteredAccessories = accessories.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || item.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-charcoal-950 tracking-tight">
            Accessories Inventory
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-500 font-medium">
            Manage genuine laptop chargers, backpacks, stands, mice, RAM, and NVMe SSDs.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-charcoal-950 font-bold text-xs shadow-sm transition-all hover:scale-105 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Accessory</span>
        </button>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 font-medium">
          <Check className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Filters Bar */}
      <div className="p-4 rounded-2xl bg-white border border-charcoal-200 shadow-soft flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-charcoal-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search accessories by name..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-charcoal-50 border border-charcoal-200 text-xs text-charcoal-950 focus:outline-none focus:border-brand-500 font-medium"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="text-xs font-bold text-charcoal-600 shrink-0">Category:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-xl bg-charcoal-50 border border-charcoal-200 text-xs text-charcoal-950 focus:outline-none focus:border-brand-500 font-medium w-full sm:w-auto"
          >
            <option value="all">All Categories</option>
            <option value="Chargers">Chargers &amp; Adapters</option>
            <option value="Laptop Bags">Bags &amp; Sleeves</option>
            <option value="Laptop Stands">Stands &amp; Cooling</option>
            <option value="RAM">RAM Modules</option>
            <option value="SSD">NVMe / SATA SSD</option>
            <option value="Mice">Mice &amp; Keyboards</option>
            <option value="Cables">Cables &amp; Converters</option>
          </select>
        </div>
      </div>

      {/* Accessories Table */}
      <div className="rounded-3xl bg-white border border-charcoal-200/90 shadow-soft overflow-hidden">
        {isLoading ? (
          <div className="py-20 text-center text-xs text-charcoal-400 font-medium flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-brand-600" />
            <span>Loading accessories inventory...</span>
          </div>
        ) : filteredAccessories.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-charcoal-50 border-b border-charcoal-200 text-charcoal-600 uppercase text-[10px] font-bold tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Photo</th>
                  <th className="py-3.5 px-4">Item Name</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Condition</th>
                  <th className="py-3.5 px-4">Stock</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal-100">
                {filteredAccessories.map((a) => {
                  const primaryImg = a.images?.find((img) => img.isPrimary) || a.images?.[0];
                  return (
                    <tr key={a._id} className="hover:bg-charcoal-50/60 transition-colors">
                      <td className="py-3 px-4">
                        <div className="w-12 h-12 rounded-xl bg-charcoal-100 border border-charcoal-200 overflow-hidden flex items-center justify-center shrink-0">
                          {primaryImg?.url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={primaryImg.url}
                              alt={a.name}
                              className="w-full h-full object-contain p-1"
                            />
                          ) : (
                            <ImageIcon className="w-5 h-5 text-charcoal-400" />
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-charcoal-950">{a.name}</div>
                        <div className="text-[11px] text-charcoal-400 font-mono">{a.slug}</div>
                      </td>
                      <td className="py-3 px-4 text-charcoal-700 font-medium">{a.category}</td>
                      <td className="py-3 px-4 font-black text-charcoal-950">
                        Rs. {a.price?.toLocaleString('en-PK')}
                      </td>
                      <td className="py-3 px-4 capitalize text-charcoal-600 font-medium">
                        {a.condition}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                            a.stockStatus === 'available'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border-rose-200'
                          }`}
                        >
                          {a.stockStatus === 'available' ? 'In Stock' : 'Sold Out'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          onClick={() => openEditModal(a)}
                          className="p-2 rounded-xl bg-charcoal-100 hover:bg-brand-100 text-charcoal-700 hover:text-brand-900 transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(a._id)}
                          className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center space-y-3">
            <Layers className="w-12 h-12 text-charcoal-300 mx-auto" />
            <p className="text-xs text-charcoal-500 font-medium">No accessories found.</p>
            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-400 text-charcoal-950 text-xs font-bold shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Accessory</span>
            </button>
          </div>
        )}
      </div>

      {/* Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-charcoal-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <form
            onSubmit={handleSave}
            className="max-w-lg w-full p-6 sm:p-8 rounded-3xl bg-white border border-charcoal-200 space-y-5 shadow-2xl my-8"
          >
            <div className="flex items-center justify-between pb-3 border-b border-charcoal-100">
              <h3 className="text-base font-black text-charcoal-950">
                {editingId ? 'Edit Accessory' : 'Catalog New Accessory'}
              </h3>
              <span className="text-xs text-charcoal-400 font-mono">
                {formData.slug || 'auto-slug'}
              </span>
            </div>

            {error && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
              {/* Item Name */}
              <div>
                <label className="block text-xs font-bold text-charcoal-900 mb-1">
                  Item Full Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: e.target.value,
                      slug: !editingId
                        ? e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
                        : formData.slug,
                    })
                  }
                  placeholder="e.g. HP 65W USB-C Original Smart Charger"
                  className="w-full px-4 py-2.5 rounded-xl bg-charcoal-50 border border-charcoal-200 text-xs text-charcoal-950 focus:outline-none focus:border-brand-500 font-medium"
                />
              </div>

              {/* Photo Uploading Section */}
              <div>
                <label className="block text-xs font-bold text-charcoal-900 mb-1">
                  Accessory Photos
                </label>
                <label className="border-2 border-dashed border-charcoal-200 hover:border-brand-500 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors bg-charcoal-50/50 hover:bg-brand-50/30">
                  <UploadCloud className="w-6 h-6 text-brand-600 mb-1" />
                  <span className="text-xs font-bold text-charcoal-800">
                    {isUploading ? 'Uploading to Cloudinary...' : 'Click to Upload Photos'}
                  </span>
                  <span className="text-[11px] text-charcoal-500">JPG, PNG, WebP supported</span>
                  <input
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,image/webp,image/jpg"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                    className="hidden"
                  />
                </label>

                {isUploading && (
                  <div className="flex items-center gap-2 text-xs text-brand-800 font-bold bg-brand-50 p-2.5 rounded-xl border border-brand-200 mt-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Uploading photo...</span>
                  </div>
                )}

                {/* Uploaded Thumbnails */}
                {formData.images.length > 0 && (
                  <div className="grid grid-cols-3 gap-2.5 pt-2.5">
                    {formData.images.map((img, idx) => (
                      <div
                        key={idx}
                        className={`relative rounded-xl border p-1.5 bg-charcoal-50 flex flex-col justify-between ${
                          img.isPrimary ? 'border-brand-500 ring-2 ring-brand-300' : 'border-charcoal-200'
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={img.url}
                          alt={img.alt || 'Accessory'}
                          className="w-full h-16 object-contain rounded-lg mb-1"
                        />
                        {img.isPrimary && (
                          <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-brand-500 text-charcoal-950 text-[8px] font-bold">
                            Main
                          </span>
                        )}
                        <div className="flex items-center justify-between pt-1 border-t border-charcoal-200 text-[10px]">
                          {!img.isPrimary ? (
                            <button
                              type="button"
                              onClick={() => setPrimaryImage(idx)}
                              className="text-brand-700 font-bold hover:underline"
                            >
                              Set Main
                            </button>
                          ) : (
                            <span className="text-charcoal-400 font-bold">Primary</span>
                          )}
                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="text-rose-600 font-bold hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Category and Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-charcoal-900 mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-charcoal-50 border border-charcoal-200 text-xs text-charcoal-950 focus:outline-none focus:border-brand-500 font-medium"
                  >
                    <option value="Chargers">Chargers &amp; Adapters</option>
                    <option value="Laptop Bags">Bags &amp; Sleeves</option>
                    <option value="Laptop Stands">Stands &amp; Cooling</option>
                    <option value="RAM">RAM Modules</option>
                    <option value="SSD">NVMe / SATA SSD</option>
                    <option value="Mice">Mice &amp; Keyboards</option>
                    <option value="Cables">Cables &amp; Converters</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal-900 mb-1">
                    Price (PKR) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    placeholder="e.g. 2500"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-charcoal-50 border border-charcoal-200 text-xs text-charcoal-950 focus:outline-none focus:border-brand-500 font-bold"
                  />
                </div>
              </div>

              {/* Condition and Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-charcoal-900 mb-1">
                    Condition
                  </label>
                  <select
                    value={formData.condition}
                    onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-charcoal-50 border border-charcoal-200 text-xs text-charcoal-950 focus:outline-none focus:border-brand-500 font-medium"
                  >
                    <option value="new">Brand New (Original Pack)</option>
                    <option value="like-new">Like New / Open Box</option>
                    <option value="excellent">Excellent Used</option>
                    <option value="used">Inspected Used</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal-900 mb-1">
                    Stock Status
                  </label>
                  <select
                    value={formData.stockStatus}
                    onChange={(e) => setFormData({ ...formData, stockStatus: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-charcoal-50 border border-charcoal-200 text-xs text-charcoal-950 focus:outline-none focus:border-brand-500 font-medium"
                  >
                    <option value="available">Available (In Stock)</option>
                    <option value="sold_out">Sold Out</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-charcoal-900 mb-1">
                  Description / Compatibility Notes
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="e.g. Compatible with HP EliteBook 840 G5/G6/G7/G8, 65W fast charging, 1-month replacement guarantee."
                  className="w-full p-3 rounded-xl bg-charcoal-50 border border-charcoal-200 text-xs text-charcoal-950 focus:outline-none focus:border-brand-500 font-medium"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-charcoal-100">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="py-2.5 rounded-xl bg-charcoal-100 hover:bg-charcoal-200 text-xs font-bold text-charcoal-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-charcoal-950 text-xs font-bold shadow-sm flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>Save Accessory</span>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
