import type { Response } from 'express';
import type { Types } from 'mongoose';
import { getStatusText } from '../constants/index.js';
import type { PaginationMeta } from '../types/index.js';

export function addStatusText<T extends { status: string }>(obj: T): T & { status_text: string } {
  return { ...obj, status_text: getStatusText(obj.status) };
}

/**
 * Map populated role (child) to flat role_id and role_name for API response.
 * role may be { _id, name } when populated or ObjectId when not.
 */
export function mapRoleToFlat(role: unknown): { role_id: Types.ObjectId; role_name: string } {
  if (role && typeof role === 'object' && '_id' in role) {
    const r = role as { _id: Types.ObjectId; name?: string };
    return {
      role_id: r._id,
      role_name: typeof r.name === 'string' ? r.name : '',
    };
  }
  if (role && typeof role === 'object' && 'id' in role) {
    const r = role as { id: Types.ObjectId; name?: string };
    return {
      role_id: r.id,
      role_name: typeof r.name === 'string' ? r.name : '',
    };
  }
  const id = role as Types.ObjectId;
  return { role_id: id, role_name: '' };
}

export function sendSuccess<T>(
  res: Response,
  data: T,
  message: string,
  statusCode = 200
): void {
  res.status(statusCode).json({ success: true, message, data });
}

export function sendListSuccess<T>(
  res: Response,
  data: T[],
  message: string,
  pagination: PaginationMeta
): void {
  res.status(200).json({ success: true, message, data, pagination });
}

export function sendError(res: Response, message: string, statusCode = 400): void {
  res.status(statusCode).json({ success: false, message });
}
