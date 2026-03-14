import type { Types } from 'mongoose';

export interface RegisterBody {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  role?: string;
}

export interface UserResponse {
  id: Types.ObjectId;
  firstname: string;
  lastname: string;
  email: string;
  role_id: Types.ObjectId;
  role_name: string;
  status: string;
  status_text: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface UserListItemResponse {
  id: Types.ObjectId;
  firstname: string;
  lastname: string;
  email: string;
  role_id: Types.ObjectId;
  role_name: string;
  status: string;
  status_text: string;
  createdAt: Date;
  updatedAt?: Date;
}
