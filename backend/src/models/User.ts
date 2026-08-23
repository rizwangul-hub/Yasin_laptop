import mongoose, { Schema, Document } from 'mongoose';
import { UserRole } from '../types';

export interface IUserDocument extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUserDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true, index: true },
    passwordHash: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ['admin', 'superadmin'],
      default: 'admin',
      required: true,
    },
    isActive: { type: Boolean, default: true, index: true },
    lastLogin: { type: Date },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        const obj = ret as Record<string, unknown>;
        delete obj.passwordHash;
        delete obj.__v;
        return obj;
      },
    },
  }
);

export const User = mongoose.models.User || mongoose.model<IUserDocument>('User', UserSchema);
