import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { UserItem, UserCreateBody, UserUpdateBody } from '../../types';
import type { ApiListResponse, ApiResponse, PaginationMeta } from '../../types';
import { endpoint } from '../../lib/endpoint';
import axios from '../../lib/axios';

export interface UserListParams {
  page: number;
  limit: number;
  name?: string;
  status?: string;
}

export const fetchUsers = createAsyncThunk<
  { data: UserItem[]; pagination: PaginationMeta },
  UserListParams,
  { rejectValue: string }
>('user/fetchUsers', async (params, { rejectWithValue }) => {
  try {
    const { data } = await axios.get<ApiListResponse<UserItem>>(endpoint.users.list(params));
    if (!data.success) return rejectWithValue(data.message);
    return { data: data.data, pagination: data.pagination };
  } catch (err: unknown) {
    const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Failed to fetch users';
    return rejectWithValue(msg);
  }
});

export const fetchUser = createAsyncThunk<UserItem, string, { rejectValue: string }>(
  'user/fetchUser',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.get<ApiResponse<UserItem>>(endpoint.users.get(id));
      if (!data.success || !data.data) return rejectWithValue(data.message ?? 'User not found');
      return data.data;
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Failed to fetch user';
      return rejectWithValue(msg);
    }
  }
);

export const createUser = createAsyncThunk<
  { data: UserItem; message: string },
  UserCreateBody,
  { rejectValue: string }
>('user/createUser', async (body, { rejectWithValue }) => {
  try {
    const { data } = await axios.post<ApiResponse<UserItem>>(endpoint.users.create(), body);
    if (!data.success || !data.data) return rejectWithValue(data.message ?? 'Create failed');
    return { data: data.data, message: data.message };
  } catch (err: unknown) {
    const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Create failed';
    return rejectWithValue(msg);
  }
});

export const updateUser = createAsyncThunk<
  { data: UserItem; message: string },
  { id: string; body: UserUpdateBody },
  { rejectValue: string }
>('user/updateUser', async ({ id, body }, { rejectWithValue }) => {
  try {
    const { data } = await axios.patch<ApiResponse<UserItem>>(endpoint.users.update(id), body);
    if (!data.success || !data.data) return rejectWithValue(data.message ?? 'Update failed');
    return { data: data.data, message: data.message };
  } catch (err: unknown) {
    const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Update failed';
    return rejectWithValue(msg);
  }
});

export const deleteUser = createAsyncThunk<
  { message: string },
  string,
  { rejectValue: string }
>('user/deleteUser', async (id, { rejectWithValue }) => {
  try {
    const { data } = await axios.delete<ApiResponse<null>>(endpoint.users.delete(id));
    if (!data.success) return rejectWithValue(data.message ?? 'Delete failed');
    return { message: data.message };
  } catch (err: unknown) {
    const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Delete failed';
    return rejectWithValue(msg);
  }
});

const userSlice = createSlice({
  name: 'user',
  initialState: {
    list: [] as UserItem[],
    pagination: null as PaginationMeta | null,
    current: null as UserItem | null,
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
      .addCase(fetchUsers.pending, (state) => { state.listLoading = true; state.error = null; })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.listLoading = false;
        state.list = action.payload.data;
        state.pagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.listLoading = false;
        state.error = action.payload ?? null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => { state.current = action.payload; })
      .addCase(createUser.fulfilled, (state) => { state.current = null; })
      .addCase(updateUser.fulfilled, (state) => { state.current = null; })
      .addCase(deleteUser.fulfilled, (state) => { state.current = null; });
  },
});

export const { clearCurrent: clearCurrentUser } = userSlice.actions;
export default userSlice.reducer;
