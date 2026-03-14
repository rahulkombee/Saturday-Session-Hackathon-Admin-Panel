import type { Response } from 'express';
import mongoose from 'mongoose';
import { User, Role } from '../models/index.js';
import { userCreateSchema, userUpdateSchema, listQuerySchema } from '../schema/index.js';
import { sendSuccess, sendListSuccess, sendError, addStatusText, mapRoleToFlat } from '../utils/response.js';
import { buildPagination } from '../utils/pagination.js';
import type { RequestWithUser } from '../types/index.js';
import {
  MSG_EMAIL_ALREADY_EXISTS,
  MSG_USER_NOT_FOUND,
  MSG_USER_CREATED,
  MSG_USER_UPDATED,
  MSG_USER_DELETED,
  MSG_LIST_SUCCESS,
  MSG_DETAIL_SUCCESS,
  MSG_VALIDATION_FAILED,
  MSG_INVALID_ID,
} from '../constants/index.js';

function toUserResponse(doc: Record<string, unknown> & { _id: unknown; firstname: string; lastname: string; email: string; role: unknown; status: string; createdAt: Date; updatedAt?: Date }) {
  const { role_id, role_name } = mapRoleToFlat(doc.role);
  return addStatusText({
    id: doc._id,
    firstname: doc.firstname,
    lastname: doc.lastname,
    email: doc.email,
    role_id,
    role_name,
    status: doc.status,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  });
}

export async function listUsers(req: RequestWithUser, res: Response): Promise<void> {
  const parsed = listQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? MSG_VALIDATION_FAILED;
    sendError(res, message, 400);
    return;
  }
  const { page, limit, name, status } = parsed.data;

  const filter: Record<string, unknown> = {};
  if (name) {
    const re = new RegExp(name, 'i');
    filter.$or = [
      { firstname: re },
      { lastname: re },
      { email: re },
    ];
  }
  if (status) filter.status = status;

  const [items, total] = await Promise.all([
    User.find(filter).select('-password').populate('role', 'name').sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    User.countDocuments(filter),
  ]);

  const data = items.map((doc) => toUserResponse(doc as unknown as Parameters<typeof toUserResponse>[0]));
  const pagination = buildPagination(page, limit, total);
  sendListSuccess(res, data, MSG_LIST_SUCCESS, pagination);
}

export async function getUser(req: RequestWithUser, res: Response): Promise<void> {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    sendError(res, MSG_INVALID_ID, 400);
    return;
  }
  const user = await User.findById(id).select('-password').populate('role', 'name').lean();
  if (!user) {
    sendError(res, MSG_USER_NOT_FOUND, 404);
    return;
  }
  const data = toUserResponse(user as unknown as Parameters<typeof toUserResponse>[0]);
  sendSuccess(res, data, MSG_DETAIL_SUCCESS);
}

export async function createUser(req: RequestWithUser, res: Response): Promise<void> {
  const parsed = userCreateSchema.safeParse(req.body);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? MSG_VALIDATION_FAILED;
    sendError(res, message, 400);
    return;
  }
  const { firstname, lastname, email, password, role, status } = parsed.data;

  const existing = await User.findOne({ email });
  if (existing) {
    sendError(res, MSG_EMAIL_ALREADY_EXISTS, 409);
    return;
  }

  const roleExists = await Role.findById(role);
  if (!roleExists) {
    sendError(res, 'Invalid role', 400);
    return;
  }

  const user = await User.create({ firstname, lastname, email, password, role, status });
  const populated = await User.findById(user._id).select('-password').populate('role', 'name').lean();
  if (!populated) {
    sendError(res, MSG_VALIDATION_FAILED, 500);
    return;
  }
  const data = toUserResponse(populated as unknown as Parameters<typeof toUserResponse>[0]);
  sendSuccess(res, data, MSG_USER_CREATED, 201);
}

export async function updateUser(req: RequestWithUser, res: Response): Promise<void> {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    sendError(res, MSG_INVALID_ID, 400);
    return;
  }
  const parsed = userUpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? MSG_VALIDATION_FAILED;
    sendError(res, message, 400);
    return;
  }

  const user = await User.findById(id);
  if (!user) {
    sendError(res, MSG_USER_NOT_FOUND, 404);
    return;
  }

  if (parsed.data.email !== undefined && parsed.data.email !== user.email) {
    const existing = await User.findOne({ email: parsed.data.email });
    if (existing) {
      sendError(res, MSG_EMAIL_ALREADY_EXISTS, 409);
      return;
    }
  }
  if (parsed.data.role !== undefined) {
    const roleExists = await Role.findById(parsed.data.role);
    if (!roleExists) {
      sendError(res, 'Invalid role', 400);
      return;
    }
  }

  Object.assign(user, parsed.data);
  await user.save();
  const populated = await User.findById(user._id).select('-password').populate('role', 'name').lean();
  if (!populated) {
    sendError(res, MSG_VALIDATION_FAILED, 500);
    return;
  }
  const data = toUserResponse(populated as unknown as Parameters<typeof toUserResponse>[0]);
  sendSuccess(res, data, MSG_USER_UPDATED);
}

export async function deleteUser(req: RequestWithUser, res: Response): Promise<void> {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    sendError(res, MSG_INVALID_ID, 400);
    return;
  }
  const deleted = await User.findByIdAndDelete(id);
  if (!deleted) {
    sendError(res, MSG_USER_NOT_FOUND, 404);
    return;
  }
  sendSuccess(res, null as unknown as Record<string, unknown>, MSG_USER_DELETED);
}
