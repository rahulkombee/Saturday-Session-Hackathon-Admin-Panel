import mongoose, { Document, Schema } from 'mongoose';
import { STATUS_ACTIVE, STATUS_VALUES } from '../constants/index.js';

export interface IRole extends Document {
  name: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const roleSchema = new Schema<IRole>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
      unique: true,
    },
    status: {
      type: String,
      required: true,
      enum: STATUS_VALUES,
      default: STATUS_ACTIVE,
    },
  },
  { timestamps: true }
);

roleSchema.index({ name: 1 });
roleSchema.index({ status: 1 });
roleSchema.index({ createdAt: -1 });

export const Role = mongoose.model<IRole>('Role', roleSchema);
