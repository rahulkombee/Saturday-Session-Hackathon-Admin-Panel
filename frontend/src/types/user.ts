export interface UserItem {
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

export interface UserCreateBody {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  role: string;
  status: string;
}

export interface UserUpdateBody {
  firstname?: string;
  lastname?: string;
  email?: string;
  password?: string;
  role?: string;
  status?: string;
}
