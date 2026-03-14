export interface RoleItem {
  id: string;
  name: string;
  status: string;
  status_text: string;
  createdAt: string;
  updatedAt?: string;
}

export interface RoleCreateBody {
  name: string;
  status: string;
}

export interface RoleUpdateBody {
  name?: string;
  status?: string;
}
