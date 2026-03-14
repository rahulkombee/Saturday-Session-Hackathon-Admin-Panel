import type { Request } from 'express';
import type { Types } from 'mongoose';

export interface LoginBody {
  email: string;
  password: string;
}

export interface TokenPayload {
  userId: string;
  type: 'access' | 'refresh';
}

export interface AuthTokensResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn?: string;
}

export interface JwtDecoded {
  userId: string;
  type: 'access' | 'refresh';
  iat?: number;
  exp?: number;
}

export interface RequestWithUser extends Request {
  userId?: Types.ObjectId;
}
