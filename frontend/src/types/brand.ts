export interface BrandItem {
  id: string;
  name: string;
  status: string;
  status_text: string;
  description?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface BrandCreateBody {
  name: string;
  status: string;
  description?: string;
}

export interface BrandUpdateBody {
  name?: string;
  status?: string;
  description?: string;
}
