import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { BrandItem, BrandCreateBody, BrandUpdateBody } from '../../types';
import type { ApiListResponse, ApiResponse, PaginationMeta } from '../../types';
import { endpoint } from '../../lib/endpoint';
import axios from '../../lib/axios';

export interface BrandListParams {
  page: number;
  limit: number;
  name?: string;
  status?: string;
}

export const fetchBrands = createAsyncThunk<
  { data: BrandItem[]; pagination: PaginationMeta },
  BrandListParams,
  { rejectValue: string }
>('brand/fetchBrands', async (params, { rejectWithValue }) => {
  try {
    const { data } = await axios.get<ApiListResponse<BrandItem>>(endpoint.brands.list(params));
    if (!data.success) return rejectWithValue(data.message);
    return { data: data.data, pagination: data.pagination };
  } catch (err: unknown) {
    const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Failed to fetch brands';
    return rejectWithValue(msg);
  }
});

export const fetchBrand = createAsyncThunk<BrandItem, string, { rejectValue: string }>(
  'brand/fetchBrand',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.get<ApiResponse<BrandItem>>(endpoint.brands.get(id));
      if (!data.success || !data.data) return rejectWithValue(data.message ?? 'Brand not found');
      return data.data;
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Failed to fetch brand';
      return rejectWithValue(msg);
    }
  }
);

export const createBrand = createAsyncThunk<
  { data: BrandItem; message: string },
  BrandCreateBody,
  { rejectValue: string }
>('brand/createBrand', async (body, { rejectWithValue }) => {
  try {
    const { data } = await axios.post<ApiResponse<BrandItem>>(endpoint.brands.create(), body);
    if (!data.success || !data.data) return rejectWithValue(data.message ?? 'Create failed');
    return { data: data.data, message: data.message };
  } catch (err: unknown) {
    const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Create failed';
    return rejectWithValue(msg);
  }
});

export const updateBrand = createAsyncThunk<
  { data: BrandItem; message: string },
  { id: string; body: BrandUpdateBody },
  { rejectValue: string }
>('brand/updateBrand', async ({ id, body }, { rejectWithValue }) => {
  try {
    const { data } = await axios.patch<ApiResponse<BrandItem>>(endpoint.brands.update(id), body);
    if (!data.success || !data.data) return rejectWithValue(data.message ?? 'Update failed');
    return { data: data.data, message: data.message };
  } catch (err: unknown) {
    const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Update failed';
    return rejectWithValue(msg);
  }
});

export const deleteBrand = createAsyncThunk<
  { message: string },
  string,
  { rejectValue: string }
>('brand/deleteBrand', async (id, { rejectWithValue }) => {
  try {
    const { data } = await axios.delete<ApiResponse<null>>(endpoint.brands.delete(id));
    if (!data.success) return rejectWithValue(data.message ?? 'Delete failed');
    return { message: data.message };
  } catch (err: unknown) {
    const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Delete failed';
    return rejectWithValue(msg);
  }
});

const brandSlice = createSlice({
  name: 'brand',
  initialState: {
    list: [] as BrandItem[],
    pagination: null as PaginationMeta | null,
    current: null as BrandItem | null,
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
      .addCase(fetchBrands.pending, (state) => { state.listLoading = true; state.error = null; })
      .addCase(fetchBrands.fulfilled, (state, action) => {
        state.listLoading = false;
        state.list = action.payload.data;
        state.pagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(fetchBrands.rejected, (state, action) => {
        state.listLoading = false;
        state.error = action.payload ?? null;
      })
      .addCase(fetchBrand.fulfilled, (state, action) => { state.current = action.payload; })
      .addCase(createBrand.fulfilled, (state) => { state.current = null; })
      .addCase(updateBrand.fulfilled, (state) => { state.current = null; })
      .addCase(deleteBrand.fulfilled, (state) => { state.current = null; });
  },
});

export const { clearCurrent: clearCurrentBrand } = brandSlice.actions;
export default brandSlice.reducer;
