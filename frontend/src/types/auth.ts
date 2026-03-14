export interface LoginBody {
  email: string;
  password: string;
}

export interface RegisterBody {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  role?: string;
}

export interface AuthUser {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  role_id: string;
  role_name: string;
  status: string;
  status_text: string;
  createdAt: string;
  updatedAt?: string;
}

export interface AuthTokensResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser | null;
}
