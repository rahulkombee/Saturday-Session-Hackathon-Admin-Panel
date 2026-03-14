import type { Types } from 'mongoose';

export interface RoleResponse {
  id: Types.ObjectId;
  name: string;
  status: string;
  status_text: string;
  createdAt: Date;
  updatedAt?: Date;
}
