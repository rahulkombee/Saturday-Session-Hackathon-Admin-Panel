import type { Response } from 'express';
import mongoose from 'mongoose';
import { Brand } from '../models/index.js';
import { brandCreateSchema, brandUpdateSchema, listQuerySchema } from '../schema/index.js';
import { sendSuccess, sendListSuccess, sendError, addStatusText } from '../utils/response.js';
import { buildPagination } from '../utils/pagination.js';
import type { RequestWithUser } from '../types/index.js';
import {
  MSG_BRAND_NOT_FOUND,
  MSG_BRAND_CREATED,
  MSG_BRAND_UPDATED,
  MSG_BRAND_DELETED,
  MSG_LIST_SUCCESS,
  MSG_DETAIL_SUCCESS,
  MSG_VALIDATION_FAILED,
  MSG_INVALID_ID,
} from '../constants/index.js';

function toBrandResponse(doc: Record<string, unknown> & { _id: unknown; name: string; status: string; description?: string; createdAt: Date; updatedAt?: Date }) {
  return addStatusText({
    id: doc._id,
    name: doc.name,
    status: doc.status,
    description: doc.description,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  });
}

export async function listBrands(req: RequestWithUser, res: Response): Promise<void> {
  const parsed = listQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? MSG_VALIDATION_FAILED;
    sendError(res, message, 400);
    return;
  }
  const { page, limit, name, status } = parsed.data;

  const filter: Record<string, unknown> = {};
  if (name) filter.name = new RegExp(name, 'i');
  if (status) filter.status = status;

  const [items, total] = await Promise.all([
    Brand.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    Brand.countDocuments(filter),
  ]);

  const data = items.map((doc) => toBrandResponse(doc as unknown as Parameters<typeof toBrandResponse>[0]));
  const pagination = buildPagination(page, limit, total);
  sendListSuccess(res, data, MSG_LIST_SUCCESS, pagination);
}

export async function getBrand(req: RequestWithUser, res: Response): Promise<void> {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    sendError(res, MSG_INVALID_ID, 400);
    return;
  }
  const brand = await Brand.findById(id).lean();
  if (!brand) {
    sendError(res, MSG_BRAND_NOT_FOUND, 404);
    return;
  }
  const data = toBrandResponse(brand as unknown as Parameters<typeof toBrandResponse>[0]);
  sendSuccess(res, data, MSG_DETAIL_SUCCESS);
}

export async function createBrand(req: RequestWithUser, res: Response): Promise<void> {
  const parsed = brandCreateSchema.safeParse(req.body);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? MSG_VALIDATION_FAILED;
    sendError(res, message, 400);
    return;
  }
  const toCreate: { name: string; status: string; description?: string } = { name: parsed.data.name, status: parsed.data.status };
  if (parsed.data.description !== undefined) toCreate.description = parsed.data.description;
  const brand = await Brand.create(toCreate);
  const data = toBrandResponse({
    _id: brand._id,
    name: brand.name,
    status: brand.status,
    description: brand.description,
    createdAt: brand.createdAt,
    updatedAt: brand.updatedAt,
  } as unknown as Parameters<typeof toBrandResponse>[0]);
  sendSuccess(res, data, MSG_BRAND_CREATED, 201);
}

export async function updateBrand(req: RequestWithUser, res: Response): Promise<void> {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    sendError(res, MSG_INVALID_ID, 400);
    return;
  }
  const parsed = brandUpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? MSG_VALIDATION_FAILED;
    sendError(res, message, 400);
    return;
  }

  const update: Record<string, unknown> = {};
  if (parsed.data.name !== undefined) update.name = parsed.data.name;
  if (parsed.data.status !== undefined) update.status = parsed.data.status;
  if (parsed.data.description !== undefined) update.description = parsed.data.description;
  const brand = await Brand.findByIdAndUpdate(id, { $set: update }, { new: true }).lean();
  if (!brand) {
    sendError(res, MSG_BRAND_NOT_FOUND, 404);
    return;
  }
  const data = toBrandResponse(brand as unknown as Parameters<typeof toBrandResponse>[0]);
  sendSuccess(res, data, MSG_BRAND_UPDATED);
}

export async function deleteBrand(req: RequestWithUser, res: Response): Promise<void> {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    sendError(res, MSG_INVALID_ID, 400);
    return;
  }
  const deleted = await Brand.findByIdAndDelete(id);
  if (!deleted) {
    sendError(res, MSG_BRAND_NOT_FOUND, 404);
    return;
  }
  sendSuccess(res, null as unknown as Record<string, unknown>, MSG_BRAND_DELETED);
}
