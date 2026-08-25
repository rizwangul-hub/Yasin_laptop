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

const STANDARD_BRANDS: Array<{ _id: string; name: string }> = [
  { _id: 'HP', name: 'HP' },
  { _id: 'Dell', name: 'Dell' },
  { _id: 'Lenovo', name: 'Lenovo' },
  { _id: 'Apple', name: 'Apple' },
  { _id: 'Acer', name: 'Acer' },
  { _id: 'Asus', name: 'Asus' },
  { _id: 'Samsung', name: 'Samsung' },
  { _id: 'Toshiba', name: 'Toshiba' },
  { _id: 'Microsoft', name: 'Microsoft' },
  { _id: 'Other', name: 'Other' },
];

export const ProductForm: React.FC<ProductFormProps> = ({ initialData, productId }) => {
  const router = useRouter();

  const [formData, setFormData] = useState<IProductFormData>(
    initialData || {
      name: '',
      slug: '',
      brand: 'HP',
      laptopModel: '',
      productType: 'laptop',
      description: '',
      shortDescription: '',
      price: 0,
      previousPrice: undefined,
      condition: 'excellent',
      stockStatus: 'available',
      warranty: '1 Month Checking Warranty Included',
      chargerIncluded: true,
      featured: false,
      bestDeal: false,
      latestArrival: true,
      categories: [],
      useCases: [],
      images: [],
      specs: {
        processor: '',
        generation: '',
        ram: '',
        ramType: 'DDR4',
        storage: '',
        storageType: 'NVMe SSD',
        displaySize: '14"',
        displayResolution: '1920x1080 FHD',
        graphics: 'Integrated',
        battery: 'Tested 3-5 Hours Backup',
        operatingSystem: 'Windows 11 Pro Genuine',
        color: 'Silver',
      },
      seoTitle: '',
      seoDescription: '',
    }
  );

  const [brands, setBrands] = useState<Array<{ _id: string; name: string }>>(STANDARD_BRANDS);
  const [categoriesList, setCategoriesList] = useState<Array<{ _id: string; name: string }>>([]);
  const [isCustomBrand, setIsCustomBrand] = useState(false);
  const [customBrandName, setCustomBrandName] = useState('');

  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Load auxiliary lists: brands, categories
  useEffect(() => {
    async function loadAux() {
      try {
        const [bRes, cRes] = await Promise.allSettled([
          adminApiClient<Array<{ _id: string; name: string }>>('/brands'),
          adminApiClient<Array<{ _id: string; name: string }>>('/categories'),
        ]);

        if (bRes.status === 'fulfilled' && bRes.value.success && bRes.value.data) {
          const raw = bRes.value.data as unknown as Record<string, unknown>;
          const apiBrands = (Array.isArray(raw)
            ? raw
            : Array.isArray(raw.brands)
            ? raw.brands
            : Array.isArray(raw.items)
            ? raw.items
            : []) as Array<{ _id: string; name: string }>;

          if (apiBrands.length > 0) {
            // Merge API brands with standard brands
            const existingNames = new Set(apiBrands.map((b) => b.name.toLowerCase()));
            const merged = [...apiBrands];
            for (const sb of STANDARD_BRANDS) {
              if (!existingNames.has(sb.name.toLowerCase())) {
                merged.push(sb);
              }
            }
            setBrands(merged);
          }
        }

        if (cRes.status === 'fulfilled' && cRes.value.success && cRes.value.data) {
          const raw = cRes.value.data as unknown as Record<string, unknown>;
          setCategoriesList(
            (Array.isArray(raw)
              ? raw
              : Array.isArray(raw.categories)
              ? raw.categories
              : Array.isArray(raw.items)
              ? raw.items
              : []) as Array<{ _id: string; name: string }>
          );
        }
      } catch {
        // auxiliary load error - gracefully fallback to standard brands
      }
    }

    loadAux();
  }, []);

  // Auto slug generation on name change
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormData((prev) => ({
      ...prev,
      name: val,
      slug: prev.slug && productId ? prev.slug : val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
    }));
  };

  // Upload image handler
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setError(null);

    try {
      const fileList = Array.from(files);
      const newImages: IProductImageForm[] = [];

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
          body: JSON.stringify({
            image: base64,
            folder: 'yasin-laptops',
          }),
        });

        if (uploadRes.success && uploadRes.data?.url) {
          newImages.push({
            url: uploadRes.data.url,
            publicId: uploadRes.data.publicId || '',
            alt: `${formData.name || 'Laptop'} Photograph`,
            isPrimary: formData.images.length === 0 && newImages.length === 0,
          });
        }
      }

      if (newImages.length > 0) {
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, ...newImages],
        }));
      }
    } catch {
      setError('Image upload failed. Please verify image format and size.');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  // Set primary image
  const setPrimaryImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.map((img, i) => ({
        ...img,
        isPrimary: i === index,
      })),
    }));
  };

  // Remove image
  const removeImage = (index: number) => {
    setFormData((prev) => {
      const remaining = prev.images.filter((_, i) => i !== index);
      if (remaining.length > 0 && !remaining.some((img) => img.isPrimary)) {
        remaining[0].isPrimary = true;
      }
      return { ...prev, images: remaining };
    });
  };

  // Move image order
  const moveImage = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= formData.images.length) return;

    setFormData((prev) => {
      const items = [...prev.images];
      const [moved] = items.splice(index, 1);
      items.splice(targetIdx, 0, moved);
      return { ...prev, images: items };
    });
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const finalBrand = isCustomBrand ? customBrandName.trim() : formData.brand?.trim();

    if (!formData.name || !formData.name.trim()) {
      setError('Please provide a Product Full Title (e.g. HP EliteBook 840 G7).');
      return;
    }

    if (!finalBrand) {
      setError('Please select or enter a Brand (e.g. HP, Dell, Lenovo, Apple).');
      return;
    }

    if (!formData.price || Number(formData.price) <= 0) {
      setError('Please provide a valid Price greater than 0.');
      return;
    }

    setIsSaving(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const endpoint = productId ? `/products/${productId}` : '/products';
      const method = productId ? 'PUT' : 'POST';

      const payload = {
        ...formData,
        brand: finalBrand,
        laptopModel: formData.laptopModel?.trim() || formData.name.trim(),
        description:
          formData.description?.trim() ||
          formData.shortDescription?.trim() ||
          `${formData.name.trim()} - genuine tested unit with checking warranty and original charger included.`,
      };

      const res = await adminApiClient(endpoint, {
        method,
        body: JSON.stringify(payload),
      });

      if (res.success) {
        setSuccessMsg(productId ? 'Product updated successfully!' : 'Product published to catalog!');
        setTimeout(() => {
          router.push('/products');
        }, 1200);
      } else {
        setError(res.message || 'Failed to save product');
      }
    } catch {
      setError('Server connection failure while saving product');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl mx-auto pb-20">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-charcoal-200">
        <div>
          <h1 className="text-2xl font-black text-charcoal-950 tracking-tight">
            {productId ? `Edit Product: ${formData.name}` : 'Catalog New Product'}
          </h1>
          <p className="text-xs text-charcoal-500 font-medium">
            Configure product identity, specifications, Cloudinary gallery, and pricing.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push('/products')}
            className="px-4 py-2.5 rounded-xl bg-charcoal-100 hover:bg-charcoal-200 text-xs font-bold text-charcoal-800 transition-colors"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-charcoal-950 font-bold text-xs shadow-sm transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
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
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2 font-medium">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 font-medium">
          <Check className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* SECTION 1: BASIC INFORMATION */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-charcoal-200/90 shadow-soft space-y-4">
        <h2 className="text-sm font-black text-charcoal-950 uppercase tracking-wider flex items-center gap-2">
          <Laptop className="w-4 h-4 text-brand-700" />
          <span>1. Basic Identity &amp; Classification</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-charcoal-900 mb-1">
              Product Full Title *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={handleNameChange}
              placeholder="e.g. HP EliteBook 840 G7"
              className="w-full px-4 py-2.5 rounded-xl bg-charcoal-50 border border-charcoal-200 text-xs text-charcoal-950 focus:outline-none focus:border-brand-500 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-charcoal-900 mb-1">
              URL Slug (Canonical)
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="e.g. hp-elitebook-840-g7"
              className="w-full px-4 py-2.5 rounded-xl bg-charcoal-50 border border-charcoal-200 text-xs text-charcoal-600 focus:outline-none focus:border-brand-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-charcoal-900 mb-1">
              Product Type
            </label>
            <select
              value={formData.productType}
              onChange={(e) => setFormData({ ...formData, productType: e.target.value as 'laptop' | 'chromebook' | 'accessory' })}
              className="w-full px-4 py-2.5 rounded-xl bg-charcoal-50 border border-charcoal-200 text-xs text-charcoal-950 focus:outline-none focus:border-brand-500 font-medium"
            >
              <option value="laptop">Laptop</option>
              <option value="chromebook">Chromebook</option>
              <option value="accessory">Accessory</option>
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-charcoal-900">
                Brand *
              </label>
              <button
                type="button"
                onClick={() => {
                  setIsCustomBrand(!isCustomBrand);
                  if (!isCustomBrand && !customBrandName) {
                    setCustomBrandName(formData.brand || '');
                  }
                }}
                className="text-[11px] font-bold text-brand-700 hover:text-brand-800 underline"
              >
                {isCustomBrand ? 'Choose from list' : '+ Custom Brand'}
              </button>
            </div>

            {isCustomBrand ? (
              <input
                type="text"
                required
                value={customBrandName}
                onChange={(e) => setCustomBrandName(e.target.value)}
                placeholder="e.g. MSI, Razer, Microsoft..."
                className="w-full px-4 py-2.5 rounded-xl bg-charcoal-50 border border-brand-400 text-xs text-charcoal-950 focus:outline-none focus:border-brand-500 font-medium"
              />
            ) : (
              <select
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-charcoal-50 border border-charcoal-200 text-xs text-charcoal-950 focus:outline-none focus:border-brand-500 font-medium"
              >
                <option value="">Select Brand...</option>
                {brands.map((b) => (
                  <option key={b._id} value={b._id}>
                    {b.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-charcoal-900 mb-1">
              Hardware Model Code
            </label>
            <input
              type="text"
              value={formData.laptopModel || ''}
              onChange={(e) => setFormData({ ...formData, laptopModel: e.target.value })}
              placeholder="e.g. 840 G7 / Latitude 5410"
              className="w-full px-4 py-2.5 rounded-xl bg-charcoal-50 border border-charcoal-200 text-xs text-charcoal-950 focus:outline-none focus:border-brand-500 font-medium"
            />
          </div>

          <div className="md:col-span-3">
            <label className="block text-xs font-bold text-charcoal-900 mb-1">
              Short Marketing Summary
            </label>
            <input
              type="text"
              value={formData.shortDescription || ''}
              onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
              placeholder="e.g. Business-class laptop with Intel Core i7, 16GB RAM and 512GB SSD"
              className="w-full px-4 py-2.5 rounded-xl bg-charcoal-50 border border-charcoal-200 text-xs text-charcoal-950 focus:outline-none focus:border-brand-500 font-medium"
            />
          </div>
        </div>
      </div>

      {/* SECTION 2: PRICING & INVENTORY STATUS */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-charcoal-200/90 shadow-soft space-y-4">
        <h2 className="text-sm font-black text-charcoal-950 uppercase tracking-wider flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>2. Pricing &amp; Stock Availability</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold text-charcoal-900 mb-1">
              Current Selling Price (PKR) *
            </label>
            <input
              type="number"
              required
              min={0}
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
              className="w-full px-4 py-2.5 rounded-xl bg-charcoal-50 border border-charcoal-200 text-xs text-charcoal-950 focus:outline-none focus:border-brand-500 font-black"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-charcoal-900 mb-1">
              Previous Price (Discount strike-through)
            </label>
            <input
              type="number"
              min={0}
              value={formData.previousPrice || ''}
              onChange={(e) => setFormData({ ...formData, previousPrice: e.target.value ? Number(e.target.value) : undefined })}
              placeholder="Optional"
              className="w-full px-4 py-2.5 rounded-xl bg-charcoal-50 border border-charcoal-200 text-xs text-charcoal-500 focus:outline-none focus:border-brand-500 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-charcoal-900 mb-1">
              Condition Grade
            </label>
            <select
              value={formData.condition}
              onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-charcoal-50 border border-charcoal-200 text-xs text-charcoal-950 focus:outline-none focus:border-brand-500 capitalize font-medium"
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
            <label className="block text-xs font-bold text-charcoal-900 mb-1">
              Stock Availability
            </label>
            <select
              value={formData.stockStatus}
              onChange={(e) => setFormData({ ...formData, stockStatus: e.target.value as 'available' | 'sold_out' })}
              className="w-full px-4 py-2.5 rounded-xl bg-charcoal-50 border border-charcoal-200 text-xs text-charcoal-950 focus:outline-none focus:border-brand-500 font-medium"
            >
              <option value="available">Available (In Stock)</option>
              <option value="sold_out">Sold Out</option>
            </select>
          </div>
        </div>

        {/* Feature Toggles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3 border-t border-charcoal-100">
          <label className="flex items-center gap-2 cursor-pointer text-xs text-charcoal-800 font-bold select-none">
            <input
              type="checkbox"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="rounded bg-charcoal-100 border-charcoal-300 text-brand-600 focus:ring-0"
            />
            <span>Featured Product</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-xs text-charcoal-800 font-bold select-none">
            <input
              type="checkbox"
              checked={formData.bestDeal}
              onChange={(e) => setFormData({ ...formData, bestDeal: e.target.checked })}
              className="rounded bg-charcoal-100 border-charcoal-300 text-amber-600 focus:ring-0"
            />
            <span>Best Deal Highlight</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-xs text-charcoal-800 font-bold select-none">
            <input
              type="checkbox"
              checked={formData.latestArrival}
              onChange={(e) => setFormData({ ...formData, latestArrival: e.target.checked })}
              className="rounded bg-charcoal-100 border-charcoal-300 text-emerald-600 focus:ring-0"
            />
            <span>Latest Arrival</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-xs text-charcoal-800 font-bold select-none">
            <input
              type="checkbox"
              checked={formData.chargerIncluded}
              onChange={(e) => setFormData({ ...formData, chargerIncluded: e.target.checked })}
              className="rounded bg-charcoal-100 border-charcoal-300 text-brand-600 focus:ring-0"
            />
            <span>Charger Included</span>
          </label>
        </div>
      </div>

      {/* SECTION 3: HARDWARE SPECIFICATIONS */}
      {formData.productType !== 'accessory' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-charcoal-200/90 shadow-soft space-y-4">
          <h2 className="text-sm font-black text-charcoal-950 uppercase tracking-wider flex items-center gap-2">
            <Cpu className="w-4 h-4 text-brand-700" />
            <span>3. Hardware &amp; Component Specifications</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-charcoal-900 mb-1">Processor</label>
              <input
                type="text"
                value={formData.specs.processor || ''}
                onChange={(e) => setFormData({ ...formData, specs: { ...formData.specs, processor: e.target.value } })}
                placeholder="e.g. Intel Core i7-10610U"
                className="w-full px-4 py-2 rounded-xl bg-charcoal-50 border border-charcoal-200 text-xs text-charcoal-950 focus:outline-none focus:border-brand-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal-900 mb-1">Generation</label>
              <input
                type="text"
                value={formData.specs.generation || ''}
                onChange={(e) => setFormData({ ...formData, specs: { ...formData.specs, generation: e.target.value } })}
                placeholder="e.g. 10th Gen"
                className="w-full px-4 py-2 rounded-xl bg-charcoal-50 border border-charcoal-200 text-xs text-charcoal-950 focus:outline-none focus:border-brand-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal-900 mb-1">RAM Capacity</label>
              <input
                type="text"
                value={formData.specs.ram || ''}
                onChange={(e) => setFormData({ ...formData, specs: { ...formData.specs, ram: e.target.value } })}
                placeholder="e.g. 16GB"
                className="w-full px-4 py-2 rounded-xl bg-charcoal-50 border border-charcoal-200 text-xs text-charcoal-950 focus:outline-none focus:border-brand-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal-900 mb-1">RAM Type</label>
              <input
                type="text"
                value={formData.specs.ramType || ''}
                onChange={(e) => setFormData({ ...formData, specs: { ...formData.specs, ramType: e.target.value } })}
                placeholder="e.g. DDR4 / LPDDR4x"
                className="w-full px-4 py-2 rounded-xl bg-charcoal-50 border border-charcoal-200 text-xs text-charcoal-950 focus:outline-none focus:border-brand-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal-900 mb-1">Storage</label>
              <input
                type="text"
                value={formData.specs.storage || ''}
                onChange={(e) => setFormData({ ...formData, specs: { ...formData.specs, storage: e.target.value } })}
                placeholder="e.g. 512GB"
                className="w-full px-4 py-2 rounded-xl bg-charcoal-50 border border-charcoal-200 text-xs text-charcoal-950 focus:outline-none focus:border-brand-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal-900 mb-1">Storage Type</label>
              <input
                type="text"
                value={formData.specs.storageType || ''}
                onChange={(e) => setFormData({ ...formData, specs: { ...formData.specs, storageType: e.target.value } })}
                placeholder="e.g. NVMe PCIe SSD"
                className="w-full px-4 py-2 rounded-xl bg-charcoal-50 border border-charcoal-200 text-xs text-charcoal-950 focus:outline-none focus:border-brand-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal-900 mb-1">Display Size</label>
              <input
                type="text"
                value={formData.specs.displaySize || ''}
                onChange={(e) => setFormData({ ...formData, specs: { ...formData.specs, displaySize: e.target.value } })}
                placeholder='e.g. 14"'
                className="w-full px-4 py-2 rounded-xl bg-charcoal-50 border border-charcoal-200 text-xs text-charcoal-950 focus:outline-none focus:border-brand-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal-900 mb-1">Resolution</label>
              <input
                type="text"
                value={formData.specs.displayResolution || ''}
                onChange={(e) => setFormData({ ...formData, specs: { ...formData.specs, displayResolution: e.target.value } })}
                placeholder="e.g. 1920x1080 FHD IPS"
                className="w-full px-4 py-2 rounded-xl bg-charcoal-50 border border-charcoal-200 text-xs text-charcoal-950 focus:outline-none focus:border-brand-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal-900 mb-1">Graphics / GPU</label>
              <input
                type="text"
                value={formData.specs.graphics || ''}
                onChange={(e) => setFormData({ ...formData, specs: { ...formData.specs, graphics: e.target.value } })}
                placeholder="e.g. Intel Iris Xe Graphics"
                className="w-full px-4 py-2 rounded-xl bg-charcoal-50 border border-charcoal-200 text-xs text-charcoal-950 focus:outline-none focus:border-brand-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal-900 mb-1">Operating System</label>
              <input
                type="text"
                value={formData.specs.operatingSystem || ''}
                onChange={(e) => setFormData({ ...formData, specs: { ...formData.specs, operatingSystem: e.target.value } })}
                placeholder="e.g. Windows 11 Pro"
                className="w-full px-4 py-2 rounded-xl bg-charcoal-50 border border-charcoal-200 text-xs text-charcoal-950 focus:outline-none focus:border-brand-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal-900 mb-1">Color</label>
              <input
                type="text"
                value={formData.specs.color || ''}
                onChange={(e) => setFormData({ ...formData, specs: { ...formData.specs, color: e.target.value } })}
                placeholder="e.g. Silver / Dark Gray"
                className="w-full px-4 py-2 rounded-xl bg-charcoal-50 border border-charcoal-200 text-xs text-charcoal-950 focus:outline-none focus:border-brand-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal-900 mb-1">Warranty Info</label>
              <input
                type="text"
                value={formData.warranty || ''}
                onChange={(e) => setFormData({ ...formData, warranty: e.target.value })}
                placeholder="e.g. 1 Month Checking Warranty"
                className="w-full px-4 py-2 rounded-xl bg-charcoal-50 border border-charcoal-200 text-xs text-charcoal-950 focus:outline-none focus:border-brand-500 font-medium"
              />
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: PRODUCT IMAGES & CLOUDINARY UPLOAD */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-charcoal-200/90 shadow-soft space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-black text-charcoal-950 uppercase tracking-wider flex items-center gap-2">
            <Upload className="w-4 h-4 text-brand-700" />
            <span>4. Product Images (Cloudinary Multi-Photo Gallery)</span>
          </h2>
          <span className="text-xs text-charcoal-500 font-bold">{formData.images.length} images cataloged</span>
        </div>

        {/* Upload Trigger Dropzone */}
        <label className="border-2 border-dashed border-charcoal-200 hover:border-brand-500 rounded-3xl p-8 flex flex-col items-center justify-center text-center cursor-pointer bg-charcoal-50 hover:bg-white transition-all shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 border border-brand-200 text-brand-800 flex items-center justify-center mb-3">
            <Upload className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold text-charcoal-950">Click or drag images to upload</span>
          <span className="text-[11px] text-charcoal-400 mt-1 font-medium">Supports JPEG, JPG, PNG, WebP up to 5MB</span>
          <input
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,image/jpg"
            onChange={handleImageFileChange}
            className="hidden"
          />
        </label>

        {isUploading && (
          <div className="flex items-center gap-2 text-xs text-brand-800 font-bold bg-brand-50 p-3 rounded-2xl border border-brand-200">
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
                className={`relative rounded-2xl bg-charcoal-50 border overflow-hidden p-2 flex flex-col justify-between group shadow-xs ${
                  img.isPrimary ? 'border-brand-500 ring-2 ring-brand-400/40 shadow-sm' : 'border-charcoal-200'
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.url}
                  alt={img.alt || 'Product'}
                  className="w-full h-24 object-contain rounded-xl mb-2"
                />

                {img.isPrimary && (
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-brand-500 text-charcoal-950 text-[9px] font-bold">
                    Primary
                  </span>
                )}

                <div className="flex items-center justify-between gap-1 pt-1 border-t border-charcoal-200 text-charcoal-500 text-xs">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => moveImage(idx, 'up')}
                      className="p-1 hover:text-charcoal-950 disabled:opacity-30"
                      title="Move Left"
                    >
                      <ArrowUp className="w-3 h-3 rotate-[-90deg]" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === formData.images.length - 1}
                      onClick={() => moveImage(idx, 'down')}
                      className="p-1 hover:text-charcoal-950 disabled:opacity-30"
                      title="Move Right"
                    >
                      <ArrowDown className="w-3 h-3 rotate-[-90deg]" />
                    </button>
                  </div>

                  {!img.isPrimary && (
                    <button
                      type="button"
                      onClick={() => setPrimaryImage(idx)}
                      className="text-[10px] text-brand-700 font-bold hover:underline"
                    >
                      Set Main
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="p-1 text-rose-600 hover:text-rose-700"
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
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-charcoal-200/90 shadow-soft space-y-4">
        <h2 className="text-sm font-black text-charcoal-950 uppercase tracking-wider">
          5. Detailed Description &amp; Technical Notes
        </h2>
        <textarea
          rows={6}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Enter thorough laptop description, ports layout, battery notes, and accessories..."
          className="w-full p-4 rounded-2xl bg-charcoal-50 border border-charcoal-200 text-xs text-charcoal-950 focus:outline-none focus:border-brand-500 leading-relaxed font-medium"
        />
      </div>

      {/* SECTION 6: SEO OVERRIDES */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-charcoal-200/90 shadow-soft space-y-4">
        <h2 className="text-sm font-black text-charcoal-950 uppercase tracking-wider">
          6. Search Engine Optimization (SEO Defaults / Overrides)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-charcoal-900 mb-1">
              Custom Meta Title
            </label>
            <input
              type="text"
              value={formData.seoTitle || ''}
              onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
              placeholder="Leave empty for auto-generated SEO title"
              className="w-full px-4 py-2.5 rounded-xl bg-charcoal-50 border border-charcoal-200 text-xs text-charcoal-950 focus:outline-none focus:border-brand-500 font-medium"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-charcoal-900 mb-1">
              Custom Meta Description
            </label>
            <input
              type="text"
              value={formData.seoDescription || ''}
              onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
              placeholder="Leave empty for auto-generated SEO description"
              className="w-full px-4 py-2.5 rounded-xl bg-charcoal-50 border border-charcoal-200 text-xs text-charcoal-950 focus:outline-none focus:border-brand-500 font-medium"
            />
          </div>
        </div>
      </div>

      {/* Bottom Save Action Bar */}
      <div className="flex items-center justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={() => router.push('/products')}
          className="px-5 py-2.5 rounded-xl bg-charcoal-100 hover:bg-charcoal-200 text-xs font-bold text-charcoal-800 transition-colors"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-charcoal-950 font-bold text-xs shadow-sm transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
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
