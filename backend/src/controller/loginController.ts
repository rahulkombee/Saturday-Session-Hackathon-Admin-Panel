import type { Request, Response } from 'express';
import { User } from '../models/index.js';
import { loginSchema } from '../schema/index.js';
import { signAccessToken, signRefreshToken } from '../utils/token.js';
import { sendSuccess, sendError, addStatusText, mapRoleToFlat } from '../utils/response.js';
import {
  MSG_LOGIN_SUCCESS,
  MSG_INVALID_CREDENTIALS,
  MSG_VALIDATION_FAILED,
} from '../constants/index.js';
import { logger } from '../utils/logger.js';

export async function loginController(req: Request, res: Response): Promise<void> {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? MSG_VALIDATION_FAILED;
    logger.warn('login_validation_failure', { reason: message });
    sendError(res, message, 400);
    return;
  }

  const { email, password } = parsed.data;

  const user = await User.findOne({ email }).select('+password').populate('role', 'name');
  if (!user) {
    logger.warn('login_failure', { reason: 'user_not_found', email });
    sendError(res, MSG_INVALID_CREDENTIALS, 401);
    return;
  }

  const match = await user.comparePassword(password);
  if (!match) {
    logger.warn('login_failure', { reason: 'invalid_password', email });
    sendError(res, MSG_INVALID_CREDENTIALS, 401);
    return;
  }

  const userId = user._id.toString();
  const accessToken = signAccessToken({ userId, type: 'access' });
  const refreshToken = signRefreshToken({ userId, type: 'refresh' });

  const userData = await User.findById(user._id).select('-password').populate('role', 'name').lean();
  const withStatusText = userData ? (() => {
    const { role_id, role_name } = mapRoleToFlat(userData.role);
    return addStatusText({
      id: userData._id,
      firstname: userData.firstname,
      lastname: userData.lastname,
      email: userData.email,
      role_id,
      role_name,
      status: userData.status,
      createdAt: userData.createdAt,
      updatedAt: userData.updatedAt,
    });
  })() : null;

  sendSuccess(res, {
    accessToken,
    refreshToken,
    user: withStatusText,
  }, MSG_LOGIN_SUCCESS);
}
