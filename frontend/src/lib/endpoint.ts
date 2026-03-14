const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000';

function url(path: string): string {
  return `${BASE_URL}${path}`;
}

export const endpoint = {
  auth: {
    register: () => url('/api/register'),
    login: () => url('/api/login'),
    logout: () => url('/api/logout'),
    refresh: () => url('/api/refresh'),
  },
  users: {
    list: (params: { page?: number; limit?: number; name?: string; status?: string }) => {
      const search = new URLSearchParams();
      if (params.page != null) search.set('page', String(params.page));
      if (params.limit != null) search.set('limit', String(params.limit));
      if (params.name) search.set('name', params.name);
      if (params.status) search.set('status', params.status);
      return url('/api/users') + (search.toString() ? '?' + search.toString() : '');
    },
    get: (id: string) => url(`/api/users/${id}`),
    create: () => url('/api/users'),
    update: (id: string) => url(`/api/users/${id}`),
    delete: (id: string) => url(`/api/users/${id}`),
  },
  roles: {
    list: (params: { page?: number; limit?: number; name?: string; status?: string }) => {
      const search = new URLSearchParams();
      if (params.page != null) search.set('page', String(params.page));
      if (params.limit != null) search.set('limit', String(params.limit));
      if (params.name) search.set('name', params.name);
      if (params.status) search.set('status', params.status);
      return url('/api/roles') + (search.toString() ? '?' + search.toString() : '');
    },
    get: (id: string) => url(`/api/roles/${id}`),
    create: () => url('/api/roles'),
    update: (id: string) => url(`/api/roles/${id}`),
    delete: (id: string) => url(`/api/roles/${id}`),
  },
  brands: {
    list: (params: { page?: number; limit?: number; name?: string; status?: string }) => {
      const search = new URLSearchParams();
      if (params.page != null) search.set('page', String(params.page));
      if (params.limit != null) search.set('limit', String(params.limit));
      if (params.name) search.set('name', params.name);
      if (params.status) search.set('status', params.status);
      return url('/api/brands') + (search.toString() ? '?' + search.toString() : '');
    },
    get: (id: string) => url(`/api/brands/${id}`),
    create: () => url('/api/brands'),
    update: (id: string) => url(`/api/brands/${id}`),
    delete: (id: string) => url(`/api/brands/${id}`),
  },
};
