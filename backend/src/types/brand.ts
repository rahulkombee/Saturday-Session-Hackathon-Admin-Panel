import type { Types } from 'mongoose';

export interface BrandResponse {
  id: Types.ObjectId;
  name: string;
  status: string;
  status_text: string;
  description?: string;
  createdAt: Date;
  updatedAt?: Date;
}
