import type { Request, Response } from 'express';
import { refreshSchema } from '../schema/index.js';
import { signAccessToken, verifyRefreshToken } from '../utils/token.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { MSG_REFRESH_SUCCESS, MSG_INVALID_OR_EXPIRED_TOKEN, MSG_VALIDATION_FAILED } from '../constants/index.js';

export async function refreshController(req: Request, res: Response): Promise<void> {
  const parsed = refreshSchema.safeParse(req.body);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? MSG_VALIDATION_FAILED;
    sendError(res, message, 400);
    return;
  }

  const { refreshToken } = parsed.data;
  const decoded = verifyRefreshToken(refreshToken);
  if (!decoded) {
    sendError(res, MSG_INVALID_OR_EXPIRED_TOKEN, 401);
    return;
  }

  const accessToken = signAccessToken({ userId: decoded.userId, type: 'access' });
  sendSuccess(res, { accessToken }, MSG_REFRESH_SUCCESS);
}
