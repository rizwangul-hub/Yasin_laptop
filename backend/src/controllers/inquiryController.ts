import { Request, Response } from 'express';
import { Inquiry } from '../models/Inquiry';
import { sendSuccess, sendError } from '../utils/apiResponse';
import { isDatabaseConnected } from '../config/database';
import { logActivity } from './activityController';

export const createInquiry = async (req: Request, res: Response): Promise<void> => {
  const {
    productNameSnapshot,
    productId,
    priceSnapshot,
    customerName,
    customerPhone,
    customerEmail,
    message,
    source = 'website_contact',
    _hp, // Honeypot
  } = req.body;

  // Bot spam honeypot check
  if (_hp) {
    sendSuccess(res, 'Inquiry received', { ok: true });
    return;
  }

  if (!productNameSnapshot && !message) {
    sendError(res, 'Inquiry requires product details or a message', undefined, 400);
    return;
  }

  if (!isDatabaseConnected()) {
    sendSuccess(
      res,
      'Inquiry accepted (database offline)',
      { productNameSnapshot: productNameSnapshot || 'General Inquiry' },
      201
    );
    return;
  }

  try {
    const inquiry = await Inquiry.create({
      product: productId || undefined,
      productNameSnapshot: productNameSnapshot || 'General Customer Inquiry',
      priceSnapshot: priceSnapshot ? Number(priceSnapshot) : undefined,
      customerName: customerName ? String(customerName).trim().slice(0, 100) : undefined,
      customerPhone: customerPhone ? String(customerPhone).trim().slice(0, 30) : undefined,
      customerEmail: customerEmail ? String(customerEmail).trim().slice(0, 100) : undefined,
      message: message ? String(message).trim().slice(0, 1000) : undefined,
      source,
      status: 'new',
    });

    await logActivity(
      'New Customer Inquiry',
      'product',
      `Inquiry received from ${customerName || customerPhone || 'Visitor'} for "${inquiry.productNameSnapshot}"`,
      inquiry._id.toString()
    );

    sendSuccess(res, 'Inquiry recorded successfully', inquiry, 201);
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Failed to record inquiry';
    sendError(res, msg, undefined, 400);
  }
};

export const getInquiries = async (req: Request, res: Response): Promise<void> => {
  if (!isDatabaseConnected()) {
    sendSuccess(res, 'Database offline; returning empty inquiries list', []);
    return;
  }

  const { status, limit = '50', page = '1' } = req.query;
  const filter: Record<string, unknown> = { isArchived: false };
  if (status && status !== 'all') {
    filter.status = status;
  }

  const pageNum = Math.max(1, parseInt(String(page), 10));
  const limitNum = Math.min(100, parseInt(String(limit), 10));
  const skip = (pageNum - 1) * limitNum;

  const [inquiries, total] = await Promise.all([
    Inquiry.find(filter)
      .populate('product', 'name slug price images')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean(),
    Inquiry.countDocuments(filter),
  ]);

  sendSuccess(res, 'Inquiries fetched successfully', {
    items: inquiries,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    },
  });
};

export const updateInquiryStatus = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { status, adminNotes } = req.body;

  if (!isDatabaseConnected()) {
    sendError(res, 'Database offline', undefined, 503);
    return;
  }

  const update: Record<string, unknown> = {};
  if (status) update.status = status;
  if (adminNotes !== undefined) update.adminNotes = adminNotes;

  const inquiry = await Inquiry.findByIdAndUpdate(id, { $set: update }, { new: true });
  if (!inquiry) {
    sendError(res, 'Inquiry not found', undefined, 404);
    return;
  }

  await logActivity(
    'Inquiry Status Updated',
    'product',
    `Updated inquiry for "${inquiry.productNameSnapshot}" to status "${inquiry.status}"`,
    inquiry._id.toString()
  );

  sendSuccess(res, 'Inquiry updated successfully', inquiry);
};

export const archiveInquiry = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  if (!isDatabaseConnected()) {
    sendError(res, 'Database offline', undefined, 503);
    return;
  }

  const inquiry = await Inquiry.findByIdAndUpdate(id, { $set: { isArchived: true } }, { new: true });
  if (!inquiry) {
    sendError(res, 'Inquiry not found', undefined, 404);
    return;
  }

  sendSuccess(res, 'Inquiry archived successfully', { id });
};
