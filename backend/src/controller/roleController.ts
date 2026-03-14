import type { Response } from 'express';
import mongoose from 'mongoose';
import { Role } from '../models/index.js';
import { roleCreateSchema, roleUpdateSchema, listQuerySchema } from '../schema/index.js';
import { sendSuccess, sendListSuccess, sendError, addStatusText } from '../utils/response.js';
import { buildPagination } from '../utils/pagination.js';
import type { RequestWithUser } from '../types/index.js';
import {
  MSG_ROLE_NAME_ALREADY_EXISTS,
  MSG_ROLE_NOT_FOUND,
  MSG_ROLE_CREATED,
  MSG_ROLE_UPDATED,
  MSG_ROLE_DELETED,
  MSG_LIST_SUCCESS,
  MSG_DETAIL_SUCCESS,
  MSG_VALIDATION_FAILED,
  MSG_INVALID_ID,
} from '../constants/index.js';

function toRoleResponse(doc: Record<string, unknown> & { _id: unknown; name: string; status: string; createdAt: Date; updatedAt?: Date }) {
  return addStatusText({
    id: doc._id,
    name: doc.name,
    status: doc.status,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  });
}

export async function listRoles(req: RequestWithUser, res: Response): Promise<void> {
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
    Role.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    Role.countDocuments(filter),
  ]);

  const data = items.map((doc) => toRoleResponse(doc as unknown as Parameters<typeof toRoleResponse>[0]));
  const pagination = buildPagination(page, limit, total);
  sendListSuccess(res, data, MSG_LIST_SUCCESS, pagination);
}

export async function getRole(req: RequestWithUser, res: Response): Promise<void> {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    sendError(res, MSG_INVALID_ID, 400);
    return;
  }
  const role = await Role.findById(id).lean();
  if (!role) {
    sendError(res, MSG_ROLE_NOT_FOUND, 404);
    return;
  }
  const data = toRoleResponse(role as unknown as Parameters<typeof toRoleResponse>[0]);
  sendSuccess(res, data, MSG_DETAIL_SUCCESS);
}

export async function createRole(req: RequestWithUser, res: Response): Promise<void> {
  const parsed = roleCreateSchema.safeParse(req.body);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? MSG_VALIDATION_FAILED;
    sendError(res, message, 400);
    return;
  }
  const { name, status } = parsed.data;

  const existing = await Role.findOne({ name });
  if (existing) {
    sendError(res, MSG_ROLE_NAME_ALREADY_EXISTS, 409);
    return;
  }

  const role = await Role.create({ name, status });
  const data = toRoleResponse({
    _id: role._id,
    name: role.name,
    status: role.status,
    createdAt: role.createdAt,
    updatedAt: role.updatedAt,
  } as unknown as Parameters<typeof toRoleResponse>[0]);
  sendSuccess(res, data, MSG_ROLE_CREATED, 201);
}

export async function updateRole(req: RequestWithUser, res: Response): Promise<void> {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    sendError(res, MSG_INVALID_ID, 400);
    return;
  }
  const parsed = roleUpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? MSG_VALIDATION_FAILED;
    sendError(res, message, 400);
    return;
  }

  const role = await Role.findById(id);
  if (!role) {
    sendError(res, MSG_ROLE_NOT_FOUND, 404);
    return;
  }

  if (parsed.data.name !== undefined && parsed.data.name !== role.name) {
    const existing = await Role.findOne({ name: parsed.data.name });
    if (existing) {
      sendError(res, MSG_ROLE_NAME_ALREADY_EXISTS, 409);
      return;
    }
  }

  Object.assign(role, parsed.data);
  await role.save();
  const data = toRoleResponse({
    _id: role._id,
    name: role.name,
    status: role.status,
    createdAt: role.createdAt,
    updatedAt: role.updatedAt,
  } as unknown as Parameters<typeof toRoleResponse>[0]);
  sendSuccess(res, data, MSG_ROLE_UPDATED);
}

export async function deleteRole(req: RequestWithUser, res: Response): Promise<void> {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    sendError(res, MSG_INVALID_ID, 400);
    return;
  }
  const deleted = await Role.findByIdAndDelete(id);
  if (!deleted) {
    sendError(res, MSG_ROLE_NOT_FOUND, 404);
    return;
  }
  sendSuccess(res, null as unknown as Record<string, unknown>, MSG_ROLE_DELETED);
}
