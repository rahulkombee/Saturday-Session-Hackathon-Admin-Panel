import mongoose, { Document, Schema } from 'mongoose';
import { STATUS_ACTIVE, STATUS_VALUES } from '../constants/index.js';

export interface IBrand extends Document {
  name: string;
  status: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const brandSchema = new Schema<IBrand>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [200, 'Name cannot exceed 200 characters'],
    },
    status: {
      type: String,
      required: true,
      enum: STATUS_VALUES,
      default: STATUS_ACTIVE,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
  },
  { timestamps: true }
);

brandSchema.index({ name: 1 });
brandSchema.index({ status: 1 });
brandSchema.index({ createdAt: -1 });

export const Brand = mongoose.model<IBrand>('Brand', brandSchema);
