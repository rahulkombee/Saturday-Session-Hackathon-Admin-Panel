import type { Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import type { RequestWithUser } from '../types/index.js';
import { verifyAccessToken } from '../utils/token.js';
import { AUTH_HEADER, BEARER_PREFIX } from '../constants/index.js';
import { MSG_UNAUTHORIZED, MSG_INVALID_OR_EXPIRED_TOKEN } from '../constants/index.js';

export function authMiddleware(
  req: RequestWithUser,
  res: Response,
  next: NextFunction
): void {
  const header = req.get(AUTH_HEADER);
  if (!header || !header.startsWith(BEARER_PREFIX)) {
    res.status(401).json({ success: false, message: MSG_UNAUTHORIZED });
    return;
  }
  const token = header.slice(BEARER_PREFIX.length).trim();
  if (!token) {
    res.status(401).json({ success: false, message: MSG_INVALID_OR_EXPIRED_TOKEN });
    return;
  }
  const decoded = verifyAccessToken(token);
  if (!decoded) {
    res.status(401).json({ success: false, message: MSG_INVALID_OR_EXPIRED_TOKEN });
    return;
  }
  try {
    req.userId = new Types.ObjectId(decoded.userId);
  } catch {
    res.status(401).json({ success: false, message: MSG_INVALID_OR_EXPIRED_TOKEN });
    return;
  }
  next();
}
