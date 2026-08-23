'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { adminApiClient } from '@/lib/api-client';
import {
  Laptop,
  Upload,
  X,
  Plus,
  ArrowUp,
  ArrowDown,
  Check,
  Loader2,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  Layers,
  HardDrive,
  Cpu,
  Monitor,
  Eye,
  Trash2,
} from 'lucide-react';

export interface IProductImageForm {
  url: string;
  publicId?: string;
  alt?: string;
  isPrimary?: boolean;
}

export interface IProductFormData {
  name: string;
  slug?: string;
  brand: string;
  laptopModel?: string;
  productType: 'laptop' | 'chromebook' | 'accessory';
  description: string;
  shortDescription?: string;
  price: number;
  previousPrice?: number;
  condition: string;
  stockStatus: 'available' | 'sold_out';
  warranty?: string;
  chargerIncluded: boolean;
  featured: boolean;
  bestDeal: boolean;
  latestArrival: boolean;
  categories: string[];
  useCases: string[];
  images: IProductImageForm[];
  specs: {
    processor?: string;
    generation?: string;
    ram?: string;
    ramType?: string;
    storage?: string;
    storageType?: string;
    displaySize?: string;
    displayResolution?: string;
    graphics?: string;
    battery?: string;
    operatingSystem?: string;
    color?: string;
  };
  seoTitle?: string;
  seoDescription?: string;
}

interface ProductFormProps {
  initialData?: IProductFormData;
  productId?: string;
}

export const ProductForm: React.FC<ProductFormProps> = ({ initialData, productId }) => {
  const router = useRouter();

  const [formData, setFormData] = useState<IProductFormData>(
    initialData || {
      name: '',
      slug: '',
      brand: '',
      laptopModel: '',
      productType: 'laptop',
      description: '',
      shortDescription: '',
      price: 0,
      previousPrice: undefined,
      condition: 'excellent',
      stockStatus: 'available',
      warranty: 'Checking Warranty Included',
      chargerIncluded: true,
      featured: false,
      bestDeal: false,
      latestArrival: true,
      categories: [],
      useCases: [],
      images: [],
      specs: {
        processor: 'Intel Core i5',
        generation: '10th Gen',
        ram: '8GB',
        ramType: 'DDR4',
        storage: '256GB',
        storageType: 'NVMe SSD',
        displaySize: '14"',
        displayResolution: '1920x1080 Full HD',
        graphics: 'Intel Iris Xe',
        battery: 'Healthy battery backup',
        operatingSystem: 'Windows 11 Pro',
        color: 'Silver',
      },
    }
  );

  const [brands, setBrands] = useState<Array<{ _id: string; name: string }>>([]);
  const [categoriesList, setCategoriesList] = useState<Array<{ _id: string; name: string }>>([]);
  const [useCasesList, setUseCasesList] = useState<Array<{ _id: string; name: string }>>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Load brands, categories, and use cases
  useEffect(() => {
    adminApiClient<Array<{ _id: string; name: string }>>('/brands').then((res) => {
      if (res.success && res.data) setBrands(res.data);
    });
    adminApiClient<Array<{ _id: string; name: string }>>('/categories').then((res) => {
      if (res.success && res.data) setCategoriesList(res.data);
    });
    adminApiClient<Array<{ _id: string; name: string }>>('/use-cases').then((res) => {
      if (res.success && res.data) setUseCasesList(res.data);
    });
  }, []);

  // Auto-generate slug from name if empty
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const generatedSlug = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    setFormData((prev) => ({
      ...prev,
      name: val,
      slug: !initialData ? generatedSlug : prev.slug,
    }));
  };

  // Image Upload handler via FileReader and /api/upload
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setError(null);

    const fileList = Array.from(files);

    for (const file of fileList) {
      if (file.size > 10 * 1024 * 1024) {
        setError(`"${file.name}" exceeds 10MB limit.`);
        continue;
      }

      try {
        const base64Data = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        const res = await adminApiClient<{ url: string; publicId: string }>('/upload', {
          method: 'POST',
          body: JSON.stringify({ image: base64Data, folder: 'products' }),
        });

        const imageUrl = res.success && res.data?.url ? res.data.url : base64Data;
        const imagePublicId =
          res.success && res.data?.publicId
            ? res.data.publicId
            : `img-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

        setFormData((prev) => ({
          ...prev,
          images: [
            ...prev.images,
            {
              url: imageUrl,
              publicId: imagePublicId,
              isPrimary: prev.images.length === 0,
              alt: `${formData.name || 'Laptop'} image`,
            },
          ],
        }));
      } catch (err) {
        console.error('Image upload error:', err);
        setError('Failed to upload image to server');
      }
    }

    setIsUploading(false);
    e.target.value = '';
  };

  const removeImage = (index: number) => {
    setFormData((prev) => {
      const updated = prev.images.filter((_, i) => i !== index);
      if (updated.length > 0 && !updated.some((img) => img.isPrimary)) {
        updated[0].isPrimary = true;
      }
      return { ...prev, images: updated };
    });
  };

  const setPrimaryImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.map((img, i) => ({
        ...img,
        isPrimary: i === index,
      })),
    }));
  };

  const moveImage = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= formData.images.length) return;

    const copy = [...formData.images];
    const item = copy.splice(index, 1)[0];
    copy.splice(newIndex, 0, item);

    setFormData((prev) => ({ ...prev, images: copy }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Product Name is required.');
      return;
    }
    if (formData.price < 0) {
      setError('Price cannot be negative.');
      return;
    }

    setIsSaving(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const endpoint = productId ? `/products/${productId}` : '/products';
      const method = productId ? 'PUT' : 'POST';

      const res = await adminApiClient(endpoint, {
        method,
        body: JSON.stringify(formData),
      });

      if (res.success) {
        setSuccessMsg(productId ? 'Product updated successfully!' : 'Product created successfully!');
        setTimeout(() => {
          router.push('/products');
        }, 1200);
      } else {
        setError(res.message || 'Failed to save product');
      }
    } catch (err) {
      setError('Server connection failure while saving product');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl mx-auto pb-20">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            {productId ? `Edit Product: ${formData.name}` : 'Catalog New Product'}
          </h1>
          <p className="text-xs text-slate-400">
            Configure product identity, specifications, Cloudinary gallery, and pricing.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push('/products')}
            className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs shadow-md shadow-brand-600/30 transition-all disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>{productId ? 'Update Product' : 'Publish Product'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-800/80 text-xs text-rose-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-800/80 text-xs text-emerald-300 flex items-center gap-2">
          <Check className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* SECTION 1: BASIC INFORMATION */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Laptop className="w-4 h-4 text-brand-400" />
          <span>1. Basic Identity &amp; Classification</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Product Full Title *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={handleNameChange}
              placeholder="e.g. HP EliteBook 840 G7"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              URL Slug (Canonical)
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="e.g. hp-elitebook-840-g7"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Product Type
            </label>
            <select
              value={formData.productType}
              onChange={(e) => setFormData({ ...formData, productType: e.target.value as 'laptop' | 'chromebook' | 'accessory' })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-brand-500"
            >
              <option value="laptop">Laptop</option>
              <option value="chromebook">Chromebook</option>
              <option value="accessory">Accessory</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Brand
            </label>
            <select
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-brand-500"
            >
              <option value="">Select Brand...</option>
              {brands.map((b) => (
                <option key={b._id} value={b._id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Hardware Model Code
            </label>
            <input
              type="text"
              value={formData.laptopModel || ''}
              onChange={(e) => setFormData({ ...formData, laptopModel: e.target.value })}
              placeholder="e.g. 840 G7 / Latitude 5410"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="md:col-span-3">
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Short Marketing Summary
            </label>
            <input
              type="text"
              value={formData.shortDescription || ''}
              onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
              placeholder="e.g. Business-class laptop with Intel Core i7, 16GB RAM and 512GB SSD"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-brand-500"
            />
          </div>
        </div>
      </div>

      {/* SECTION 2: PRICING & INVENTORY STATUS */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>2. Pricing &amp; Stock Availability</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Current Selling Price (PKR) *
            </label>
            <input
              type="number"
              required
              min={0}
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-brand-500 font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Previous Price (Discount strike-through)
            </label>
            <input
              type="number"
              min={0}
              value={formData.previousPrice || ''}
              onChange={(e) => setFormData({ ...formData, previousPrice: e.target.value ? Number(e.target.value) : undefined })}
              placeholder="Optional"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Condition Grade
            </label>
            <select
              value={formData.condition}
              onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-brand-500 capitalize"
            >
              <option value="new">New</option>
              <option value="like-new">Like New</option>
              <option value="excellent">Excellent</option>
              <option value="very-good">Very Good</option>
              <option value="good">Good</option>
              <option value="fair">Fair</option>
              <option value="refurbished">Refurbished</option>
              <option value="used">Used</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Stock Availability
            </label>
            <select
              value={formData.stockStatus}
              onChange={(e) => setFormData({ ...formData, stockStatus: e.target.value as 'available' | 'sold_out' })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-brand-500"
            >
              <option value="available">Available (In Stock)</option>
              <option value="sold_out">Sold Out</option>
            </select>
          </div>
        </div>

        {/* Feature Toggles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3 border-t border-slate-800/80">
          <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 select-none">
            <input
              type="checkbox"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="rounded bg-slate-950 border-slate-800 text-brand-600 focus:ring-0"
            />
            <span>Featured Product</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 select-none">
            <input
              type="checkbox"
              checked={formData.bestDeal}
              onChange={(e) => setFormData({ ...formData, bestDeal: e.target.checked })}
              className="rounded bg-slate-950 border-slate-800 text-amber-600 focus:ring-0"
            />
            <span>Best Deal Highlight</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 select-none">
            <input
              type="checkbox"
              checked={formData.latestArrival}
              onChange={(e) => setFormData({ ...formData, latestArrival: e.target.checked })}
              className="rounded bg-slate-950 border-slate-800 text-emerald-600 focus:ring-0"
            />
            <span>Latest Arrival</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 select-none">
            <input
              type="checkbox"
              checked={formData.chargerIncluded}
              onChange={(e) => setFormData({ ...formData, chargerIncluded: e.target.checked })}
              className="rounded bg-slate-950 border-slate-800 text-brand-600 focus:ring-0"
            />
            <span>Charger Included</span>
          </label>
        </div>
      </div>

      {/* SECTION 3: HARDWARE SPECIFICATIONS */}
      {formData.productType !== 'accessory' && (
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Cpu className="w-4 h-4 text-brand-400" />
            <span>3. Hardware &amp; Component Specifications</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Processor</label>
              <input
                type="text"
                value={formData.specs.processor || ''}
                onChange={(e) => setFormData({ ...formData, specs: { ...formData.specs, processor: e.target.value } })}
                placeholder="e.g. Intel Core i7-10610U"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Generation</label>
              <input
                type="text"
                value={formData.specs.generation || ''}
                onChange={(e) => setFormData({ ...formData, specs: { ...formData.specs, generation: e.target.value } })}
                placeholder="e.g. 10th Gen"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">RAM Capacity</label>
              <input
                type="text"
                value={formData.specs.ram || ''}
                onChange={(e) => setFormData({ ...formData, specs: { ...formData.specs, ram: e.target.value } })}
                placeholder="e.g. 16GB"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">RAM Type</label>
              <input
                type="text"
                value={formData.specs.ramType || ''}
                onChange={(e) => setFormData({ ...formData, specs: { ...formData.specs, ramType: e.target.value } })}
                placeholder="e.g. DDR4 / LPDDR4x"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Storage</label>
              <input
                type="text"
                value={formData.specs.storage || ''}
                onChange={(e) => setFormData({ ...formData, specs: { ...formData.specs, storage: e.target.value } })}
                placeholder="e.g. 512GB"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Storage Type</label>
              <input
                type="text"
                value={formData.specs.storageType || ''}
                onChange={(e) => setFormData({ ...formData, specs: { ...formData.specs, storageType: e.target.value } })}
                placeholder="e.g. NVMe PCIe SSD"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Display Size</label>
              <input
                type="text"
                value={formData.specs.displaySize || ''}
                onChange={(e) => setFormData({ ...formData, specs: { ...formData.specs, displaySize: e.target.value } })}
                placeholder='e.g. 14"'
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Resolution</label>
              <input
                type="text"
                value={formData.specs.displayResolution || ''}
                onChange={(e) => setFormData({ ...formData, specs: { ...formData.specs, displayResolution: e.target.value } })}
                placeholder="e.g. 1920x1080 FHD IPS"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Graphics / GPU</label>
              <input
                type="text"
                value={formData.specs.graphics || ''}
                onChange={(e) => setFormData({ ...formData, specs: { ...formData.specs, graphics: e.target.value } })}
                placeholder="e.g. Intel Iris Xe Graphics"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Operating System</label>
              <input
                type="text"
                value={formData.specs.operatingSystem || ''}
                onChange={(e) => setFormData({ ...formData, specs: { ...formData.specs, operatingSystem: e.target.value } })}
                placeholder="e.g. Windows 11 Pro"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Color</label>
              <input
                type="text"
                value={formData.specs.color || ''}
                onChange={(e) => setFormData({ ...formData, specs: { ...formData.specs, color: e.target.value } })}
                placeholder="e.g. Silver / Dark Gray"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Warranty Info</label>
              <input
                type="text"
                value={formData.warranty || ''}
                onChange={(e) => setFormData({ ...formData, warranty: e.target.value })}
                placeholder="e.g. 1 Month Checking Warranty"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: PRODUCT IMAGES & CLOUDINARY UPLOAD */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Upload className="w-4 h-4 text-brand-400" />
            <span>4. Product Images (Cloudinary Multi-Photo Gallery)</span>
          </h2>
          <span className="text-xs text-slate-400">{formData.images.length} images cataloged</span>
        </div>

        {/* Upload Trigger Dropzone */}
        <label className="border-2 border-dashed border-slate-800 hover:border-brand-500/50 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer bg-slate-950/40 hover:bg-slate-950 transition-all">
          <Upload className="w-8 h-8 text-brand-400 mb-2" />
          <span className="text-xs font-bold text-white">Click or drag images to upload</span>
          <span className="text-[11px] text-slate-500 mt-1">Supports JPEG, JPG, PNG, WebP up to 5MB</span>
          <input
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,image/jpg"
            onChange={handleImageFileChange}
            className="hidden"
          />
        </label>

        {isUploading && (
          <div className="flex items-center gap-2 text-xs text-brand-400">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Processing and uploading image to Cloudinary...</span>
          </div>
        )}

        {/* Image Thumbnails Strip with Reorder / Delete / Primary actions */}
        {formData.images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
            {formData.images.map((img, idx) => (
              <div
                key={idx}
                className={`relative rounded-xl bg-slate-950 border overflow-hidden p-2 flex flex-col justify-between group ${
                  img.isPrimary ? 'border-brand-500 ring-2 ring-brand-500/30' : 'border-slate-800'
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.url}
                  alt={img.alt || 'Product'}
                  className="w-full h-24 object-contain rounded-lg mb-2"
                />

                {img.isPrimary && (
                  <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-brand-600 text-white text-[9px] font-bold">
                    Primary
                  </span>
                )}

                <div className="flex items-center justify-between gap-1 pt-1 border-t border-slate-800/60 text-slate-400 text-xs">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => moveImage(idx, 'up')}
                      className="p-1 hover:text-white disabled:opacity-30"
                      title="Move Left"
                    >
                      <ArrowUp className="w-3 h-3 rotate-[-90deg]" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === formData.images.length - 1}
                      onClick={() => moveImage(idx, 'down')}
                      className="p-1 hover:text-white disabled:opacity-30"
                      title="Move Right"
                    >
                      <ArrowDown className="w-3 h-3 rotate-[-90deg]" />
                    </button>
                  </div>

                  {!img.isPrimary && (
                    <button
                      type="button"
                      onClick={() => setPrimaryImage(idx)}
                      className="text-[10px] text-brand-400 hover:underline"
                    >
                      Set Main
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="p-1 text-rose-400 hover:text-rose-300"
                    title="Delete Photo"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECTION 5: FULL DESCRIPTION */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider">
          5. Detailed Description &amp; Technical Notes
        </h2>
        <textarea
          rows={6}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Enter thorough laptop description, ports layout, battery notes, and accessories..."
          className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-brand-500 leading-relaxed"
        />
      </div>

      {/* SECTION 6: SEO OVERRIDES */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider">
          6. Search Engine Optimization (SEO Defaults / Overrides)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Custom Meta Title
            </label>
            <input
              type="text"
              value={formData.seoTitle || ''}
              onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
              placeholder="Leave empty for auto-generated SEO title"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-brand-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Custom Meta Description
            </label>
            <input
              type="text"
              value={formData.seoDescription || ''}
              onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
              placeholder="Leave empty for auto-generated SEO description"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-brand-500"
            />
          </div>
        </div>
      </div>

      {/* Bottom Save Action Bar */}
      <div className="flex items-center justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={() => router.push('/products')}
          className="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs shadow-md shadow-brand-600/30 transition-all disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Check className="w-4 h-4" />
              <span>{productId ? 'Update Product' : 'Publish Product'}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};
