import type { Request, Response } from 'express';
import mongoose from 'mongoose';
import { User, Role } from '../models/index.js';
import { registerSchema } from '../schema/index.js';
import { sendSuccess, sendError, addStatusText, mapRoleToFlat } from '../utils/response.js';
import {
  MSG_REGISTRATION_SUCCESS,
  MSG_REGISTRATION_FAILED,
  MSG_EMAIL_ALREADY_EXISTS,
  MSG_VALIDATION_FAILED,
} from '../constants/index.js';
import { STATUS_ACTIVE } from '../constants/index.js';

export async function registerController(req: Request, res: Response): Promise<void> {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message ?? MSG_VALIDATION_FAILED;
      sendError(res, message, 400);
      return;
    }

    const { firstname, lastname, email, password, role: roleId } = parsed.data;

    const existing = await User.findOne({ email });
    if (existing) {
      sendError(res, MSG_EMAIL_ALREADY_EXISTS, 409);
      return;
    }

    let roleIdToUse: mongoose.Types.ObjectId | null = null;
    if (roleId) {
      const r = await Role.findById(roleId);
      if (r) roleIdToUse = r._id;
    }
    if (!roleIdToUse) {
      const defaultRole = await Role.findOne({ status: STATUS_ACTIVE });
      if (!defaultRole) {
        sendError(res, 'No role available. Please contact administrator.', 400);
        return;
      }
      roleIdToUse = defaultRole._id;
    }

    const user = await User.create({
      firstname,
      lastname,
      email,
      password,
      role: roleIdToUse,
      status: STATUS_ACTIVE,
    });

    const populated = await User.findById(user._id)
      .select('-password')
      .populate('role', 'name')
      .lean();

    if (!populated || !('status' in populated)) {
      sendError(res, MSG_REGISTRATION_FAILED, 500);
      return;
    }

    const { role_id, role_name } = mapRoleToFlat(populated.role);
    const data = addStatusText({
      id: populated._id,
      firstname: populated.firstname,
      lastname: populated.lastname,
      email: populated.email,
      role_id,
      role_name,
      status: populated.status,
      createdAt: populated.createdAt,
      updatedAt: populated.updatedAt,
    });

    sendSuccess(res, data, MSG_REGISTRATION_SUCCESS, 201);
  } catch {
    sendError(res, MSG_REGISTRATION_FAILED, 500);
  }
}
