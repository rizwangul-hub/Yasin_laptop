import mongoose, { Schema, Document } from 'mongoose';

export interface IActivityLogDocument extends Document {
  action: string;
  user: string;
  entityType: 'product' | 'category' | 'brand' | 'setting' | 'auth';
  entityId?: string;
  details: string;
  createdAt: Date;
}

const ActivityLogSchema = new Schema<IActivityLogDocument>(
  {
    action: { type: String, required: true, index: true },
    user: { type: String, required: true, default: 'Yasin Admin' },
    entityType: { type: String, enum: ['product', 'category', 'brand', 'setting', 'auth'], required: true },
    entityId: { type: String },
    details: { type: String, required: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

ActivityLogSchema.index({ createdAt: -1 });

export const ActivityLog =
  mongoose.models.ActivityLog || mongoose.model<IActivityLogDocument>('ActivityLog', ActivityLogSchema);
