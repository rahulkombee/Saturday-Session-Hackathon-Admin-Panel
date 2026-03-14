export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 10;
export const STATUS_ACTIVE = 'Y';
export const STATUS_INACTIVE = 'N';
export const STATUS_OPTIONS = [
  { value: 'Y', label: 'Active' },
  { value: 'N', label: 'Inactive' },
] as const;

export const AUTH_TOKEN_KEY = 'accessToken';
export const REFRESH_TOKEN_KEY = 'refreshToken';
export const USER_KEY = 'user';
