import mongoose, { Schema, Document, Types } from 'mongoose';

export type InquiryStatus = 'new' | 'contacted' | 'interested' | 'sold' | 'not_interested' | 'closed';

export interface IWhatsAppInquiryDocument extends Document {
  product?: Types.ObjectId;
  productNameSnapshot: string;
  priceSnapshot?: number;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  message?: string;
  source: string;
  status: InquiryStatus;
  adminNotes?: string;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const InquirySchema = new Schema<IWhatsAppInquiryDocument>(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product' },
    productNameSnapshot: { type: String, required: true, trim: true },
    priceSnapshot: { type: Number, min: 0 },
    customerName: { type: String, trim: true },
    customerPhone: { type: String, trim: true },
    customerEmail: { type: String, trim: true },
    message: { type: String, trim: true },
    source: { type: String, default: 'website_contact' },
    status: {
      type: String,
      enum: ['new', 'contacted', 'interested', 'sold', 'not_interested', 'closed'],
      default: 'new',
      index: true,
    },
    adminNotes: { type: String, trim: true },
    isArchived: { type: Boolean, default: false, index: true },
  },
  {
    timestamps: true,
  }
);

InquirySchema.index({ isArchived: 1, createdAt: -1 });

export const Inquiry =
  mongoose.models.Inquiry || mongoose.model<IWhatsAppInquiryDocument>('Inquiry', InquirySchema);
