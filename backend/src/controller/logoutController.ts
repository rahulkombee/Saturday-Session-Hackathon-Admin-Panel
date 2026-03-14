import type { Request, Response } from 'express';
import { sendSuccess } from '../utils/response.js';
import { MSG_LOGOUT_SUCCESS } from '../constants/index.js';

/**
 * Logout – returns success. Client must discard access and refresh tokens.
 * No server-side token invalidation (stateless JWT).
 */
export function logoutController(_req: Request, res: Response): void {
  sendSuccess(res, null as unknown as Record<string, unknown>, MSG_LOGOUT_SUCCESS);
}
