import jwt from 'jsonwebtoken';
import type { TokenPayload, JwtDecoded } from '../types/index.js';
import { ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_EXPIRY } from '../constants/index.js';

const JWT_SECRET = process.env.JWT_SECRET ?? 'change-me-in-production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET ?? 'change-refresh-in-production';

export function signAccessToken(payload: TokenPayload): string {
  return jwt.sign(
    { ...payload, type: 'access' as const },
    JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );
}

export function signRefreshToken(payload: TokenPayload): string {
  return jwt.sign(
    { ...payload, type: 'refresh' as const },
    JWT_REFRESH_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRY }
  );
}

export function verifyAccessToken(token: string): JwtDecoded | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtDecoded;
    return decoded.type === 'access' ? decoded : null;
  } catch {
    return null;
  }
}

export function verifyRefreshToken(token: string): JwtDecoded | null {
  try {
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET) as JwtDecoded;
    return decoded.type === 'refresh' ? decoded : null;
  } catch {
    return null;
  }
}
