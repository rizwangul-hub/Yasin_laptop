'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { adminApiClient } from '@/lib/api-client';
import {
  MessageSquare,
  Clock,
  User,
  Phone,
  Tag,
  RefreshCw,
  Loader2,
  Check,
  MessageCircle,
  Archive,
  Save,
  X,
  Laptop,
} from 'lucide-react';

interface IInquiry {
  _id: string;
  productNameSnapshot: string;
  priceSnapshot?: number;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  message?: string;
  source: string;
  status: 'new' | 'contacted' | 'interested' | 'sold' | 'not_interested' | 'closed';
  adminNotes?: string;
  product?: {
    _id: string;
    name: string;
    slug: string;
    price: number;
    images?: Array<{ url: string }>;
  };
  createdAt: string;
}

const STATUS_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  new: { bg: 'bg-blue-950/60', text: 'text-blue-400', border: 'border-blue-800' },
  contacted: { bg: 'bg-purple-950/60', text: 'text-purple-400', border: 'border-purple-800' },
  interested: { bg: 'bg-emerald-950/60', text: 'text-emerald-400', border: 'border-emerald-800' },
  sold: { bg: 'bg-amber-950/60', text: 'text-amber-400', border: 'border-amber-800' },
  not_interested: { bg: 'bg-slate-900', text: 'text-slate-400', border: 'border-slate-800' },
  closed: { bg: 'bg-slate-900', text: 'text-slate-500', border: 'border-slate-800' },
};

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<IInquiry[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState<IInquiry | null>(null);
  const [notes, setNotes] = useState('');
  const [isSavingNotes, setIsSavingNotes] = useState(false);

  const loadInquiries = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await adminApiClient<{ items: IInquiry[]; pagination: { total: number } }>(
        `/inquiries?status=${statusFilter}`
      );
      if (res.success && res.data) {
        setInquiries(res.data.items);
        setTotalCount(res.data.pagination?.total || res.data.items.length);
      }
    } catch (err) {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    loadInquiries();
  }, [loadInquiries]);

  const handleOpenDetail = (inq: IInquiry) => {
    setSelectedInquiry(inq);
    setNotes(inq.adminNotes || '');
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await adminApiClient(`/inquiries/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.success) {
        setInquiries((prev) =>
          prev.map((item) => (item._id === id ? { ...item, status: newStatus as any } : item))
        );
        if (selectedInquiry?._id === id) {
          setSelectedInquiry((prev) => (prev ? { ...prev, status: newStatus as any } : null));
        }
      }
    } catch (err) {}
  };

  const handleSaveNotes = async () => {
    if (!selectedInquiry) return;
    setIsSavingNotes(true);

    try {
      const res = await adminApiClient(`/inquiries/${selectedInquiry._id}`, {
        method: 'PATCH',
        body: JSON.stringify({ adminNotes: notes }),
      });

      if (res.success) {
        setInquiries((prev) =>
          prev.map((item) => (item._id === selectedInquiry._id ? { ...item, adminNotes: notes } : item))
        );
        setSelectedInquiry((prev) => (prev ? { ...prev, adminNotes: notes } : null));
      }
    } catch (err) {
    } finally {
      setIsSavingNotes(false);
    }
  };

  const handleArchive = async (id: string) => {
    if (!confirm('Archive this customer inquiry?')) return;

    try {
      const res = await adminApiClient(`/inquiries/${id}`, {
        method: 'DELETE',
      });

      if (res.success) {
        setInquiries((prev) => prev.filter((item) => item._id !== id));
        if (selectedInquiry?._id === id) setSelectedInquiry(null);
      }
    } catch (err) {}
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Customer Leads &amp; WhatsApp Inquiries
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            {totalCount} inquiries logged from website product pages and contact forms.
          </p>
        </div>

        <button
          onClick={loadInquiries}
          disabled={isLoading}
          className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
          title="Refresh inquiries"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-xl bg-slate-900/60 border border-slate-800">
        {['all', 'new', 'contacted', 'interested', 'sold', 'closed'].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
              statusFilter === status
                ? 'bg-brand-600 text-white shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Main List */}
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden">
        {isLoading ? (
          <div className="py-20 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-brand-400" />
            <span>Loading customer inquiries...</span>
          </div>
        ) : inquiries.length > 0 ? (
          <div className="divide-y divide-slate-800/60">
            {inquiries.map((inq) => {
              const color = STATUS_COLORS[inq.status] || STATUS_COLORS.new;
              return (
                <div
                  key={inq._id}
                  onClick={() => handleOpenDetail(inq)}
                  className="p-4 hover:bg-slate-900/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer"
                >
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${color.bg} ${color.text} ${color.border}`}>
                        {inq.status}
                      </span>
                      <h4 className="text-xs font-bold text-white truncate">
                        {inq.productNameSnapshot}
                      </h4>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
                      {inq.customerName && (
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3 text-slate-500" />
                          <span>{inq.customerName}</span>
                        </span>
                      )}
                      {inq.customerPhone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-500" />
                          <span>{inq.customerPhone}</span>
                        </span>
                      )}
                      <span className="flex items-center gap-1 text-slate-500">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(inq.createdAt).toLocaleString('en-PK')}</span>
                      </span>
                    </div>

                    {inq.message && (
                      <p className="text-xs text-slate-300 line-clamp-1 italic">
                        &ldquo;{inq.message}&rdquo;
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <select
                      value={inq.status}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => handleUpdateStatus(inq._id, e.target.value)}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none"
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="interested">Interested</option>
                      <option value="sold">Sold</option>
                      <option value="not_interested">Not Interested</option>
                      <option value="closed">Closed</option>
                    </select>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleArchive(inq._id);
                      }}
                      className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-rose-400"
                      title="Archive inquiry"
                    >
                      <Archive className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-16 text-center space-y-3">
            <MessageSquare className="w-12 h-12 text-slate-700 mx-auto" />
            <h3 className="text-base font-bold text-white">No inquiries found</h3>
            <p className="text-xs text-slate-400">Customer leads submitted via WhatsApp or contact forms will appear here.</p>
          </div>
        )}
      </div>

      {/* Inquiry Details Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-lg w-full p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Inquiry Details</h3>
              <button
                onClick={() => setSelectedInquiry(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Product:</span>
                <span className="text-white font-bold">{selectedInquiry.productNameSnapshot}</span>
              </div>
              {selectedInquiry.priceSnapshot && (
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">Snapshot Price:</span>
                  <span className="text-brand-400 font-bold">
                    Rs. {selectedInquiry.priceSnapshot.toLocaleString('en-PK')}
                  </span>
                </div>
              )}
              {selectedInquiry.customerName && (
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">Customer:</span>
                  <span className="text-white">{selectedInquiry.customerName}</span>
                </div>
              )}
              {selectedInquiry.customerPhone && (
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">Phone:</span>
                  <span className="text-white font-mono">{selectedInquiry.customerPhone}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Received:</span>
                <span className="text-slate-400">
                  {new Date(selectedInquiry.createdAt).toLocaleString('en-PK')}
                </span>
              </div>
            </div>

            {selectedInquiry.message && (
              <div className="space-y-1 text-xs">
                <span className="font-semibold text-slate-400">Customer Message:</span>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 leading-relaxed">
                  {selectedInquiry.message}
                </div>
              </div>
            )}

            {/* Admin Private Notes */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-400">
                Private Admin Notes (Shop Staff Only)
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Called customer on Tuesday, agreed on Rs. 44,000, picking up tomorrow..."
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              {selectedInquiry.customerPhone ? (
                <a
                  href={`https://wa.me/${selectedInquiry.customerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Assalam o Alaikum ${selectedInquiry.customerName || ''}, thank you for contacting Yasin Laptop Hub regarding ${selectedInquiry.productNameSnapshot}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow transition-all"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Reply on WhatsApp</span>
                </a>
              ) : (
                <div />
              )}

              <button
                type="button"
                onClick={handleSaveNotes}
                disabled={isSavingNotes}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs shadow transition-all"
              >
                {isSavingNotes ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                <span>Save Notes</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
