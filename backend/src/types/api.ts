export interface PaginationMeta {
  from: number;
  to: number;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiSuccessResponse<T> {
  success: true;
  message: string;
  data: T;
}

export interface ApiListResponse<T> {
  success: true;
  message: string;
  data: T[];
  pagination: PaginationMeta;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  data?: null;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
export type ApiListPayload<T> = ApiListResponse<T> | ApiErrorResponse;
