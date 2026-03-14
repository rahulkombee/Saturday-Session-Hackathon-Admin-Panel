import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { RoleItem, RoleCreateBody, RoleUpdateBody } from '../../types';
import type { ApiListResponse, ApiResponse, PaginationMeta } from '../../types';
import { endpoint } from '../../lib/endpoint';
import axios from '../../lib/axios';

export interface RoleListParams {
  page: number;
  limit: number;
  name?: string;
  status?: string;
}

export const fetchRoles = createAsyncThunk<
  { data: RoleItem[]; pagination: PaginationMeta },
  RoleListParams,
  { rejectValue: string }
>('role/fetchRoles', async (params, { rejectWithValue }) => {
  try {
    const { data } = await axios.get<ApiListResponse<RoleItem>>(endpoint.roles.list(params));
    if (!data.success) return rejectWithValue(data.message);
    return { data: data.data, pagination: data.pagination };
  } catch (err: unknown) {
    const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Failed to fetch roles';
    return rejectWithValue(msg);
  }
});

export const fetchRole = createAsyncThunk<RoleItem, string, { rejectValue: string }>(
  'role/fetchRole',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.get<ApiResponse<RoleItem>>(endpoint.roles.get(id));
      if (!data.success || !data.data) return rejectWithValue(data.message ?? 'Role not found');
      return data.data;
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Failed to fetch role';
      return rejectWithValue(msg);
    }
  }
);

export const createRole = createAsyncThunk<
  { data: RoleItem; message: string },
  RoleCreateBody,
  { rejectValue: string }
>('role/createRole', async (body, { rejectWithValue }) => {
  try {
    const { data } = await axios.post<ApiResponse<RoleItem>>(endpoint.roles.create(), body);
    if (!data.success || !data.data) return rejectWithValue(data.message ?? 'Create failed');
    return { data: data.data, message: data.message };
  } catch (err: unknown) {
    const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Create failed';
    return rejectWithValue(msg);
  }
});

export const updateRole = createAsyncThunk<
  { data: RoleItem; message: string },
  { id: string; body: RoleUpdateBody },
  { rejectValue: string }
>('role/updateRole', async ({ id, body }, { rejectWithValue }) => {
  try {
    const { data } = await axios.patch<ApiResponse<RoleItem>>(endpoint.roles.update(id), body);
    if (!data.success || !data.data) return rejectWithValue(data.message ?? 'Update failed');
    return { data: data.data, message: data.message };
  } catch (err: unknown) {
    const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Update failed';
    return rejectWithValue(msg);
  }
});

export const deleteRole = createAsyncThunk<
  { message: string },
  string,
  { rejectValue: string }
>('role/deleteRole', async (id, { rejectWithValue }) => {
  try {
    const { data } = await axios.delete<ApiResponse<null>>(endpoint.roles.delete(id));
    if (!data.success) return rejectWithValue(data.message ?? 'Delete failed');
    return { message: data.message };
  } catch (err: unknown) {
    const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Delete failed';
    return rejectWithValue(msg);
  }
});

const roleSlice = createSlice({
  name: 'role',
  initialState: {
    list: [] as RoleItem[],
    pagination: null as PaginationMeta | null,
    current: null as RoleItem | null,
    loading: false,
    listLoading: false,
    error: null as string | null,
  },
  reducers: {
    clearCurrent: (state) => {
      state.current = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoles.pending, (state) => { state.listLoading = true; state.error = null; })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.listLoading = false;
        state.list = action.payload.data;
        state.pagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.listLoading = false;
        state.error = action.payload ?? null;
      })
      .addCase(fetchRole.fulfilled, (state, action) => { state.current = action.payload; })
      .addCase(createRole.fulfilled, (state) => { state.current = null; })
      .addCase(updateRole.fulfilled, (state) => { state.current = null; })
      .addCase(deleteRole.fulfilled, (state) => { state.current = null; });
  },
});

export const { clearCurrent: clearCurrentRole } = roleSlice.actions;
export default roleSlice.reducer;
