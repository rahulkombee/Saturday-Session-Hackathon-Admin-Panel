import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { AuthUser } from '../../types';
import { endpoint } from '../../lib/endpoint';
import { AUTH_TOKEN_KEY, REFRESH_TOKEN_KEY, USER_KEY } from '../../constants';
import type { AuthTokensResponse } from '../../types';
import type { ApiResponse } from '../../types';

function persistAuth(accessToken: string, refreshToken: string, user: AuthUser | null): void {
  localStorage.setItem(AUTH_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  localStorage.setItem(USER_KEY, user ? JSON.stringify(user) : '');
}

function clearAuth(): void {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export const login = createAsyncThunk<
  AuthTokensResponse,
  { email: string; password: string },
  { rejectValue: string }
>('auth/login', async (body, { rejectWithValue }) => {
  const axios = (await import('../../lib/axios')).default;
  try {
    const { data } = await axios.post<ApiResponse<AuthTokensResponse>>(endpoint.auth.login(), body);
    if (!data.success || !data.data) return rejectWithValue(data.message ?? 'Login failed');
    const d = data.data;
    persistAuth(d.accessToken, d.refreshToken, d.user ?? null);
    return d;
  } catch (err: unknown) {
    const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Login failed';
    return rejectWithValue(message);
  }
});

export const register = createAsyncThunk<
  void,
  { firstname: string; lastname: string; email: string; password: string; role?: string },
  { rejectValue: string }
>('auth/register', async (body, { rejectWithValue }) => {
  const axios = (await import('../../lib/axios')).default;
  try {
    const { data } = await axios.post(endpoint.auth.register(), body);
    if (!data.success) return rejectWithValue((data as { message?: string }).message ?? 'Registration failed');
  } catch (err: unknown) {
    const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Registration failed';
    return rejectWithValue(message);
  }
});

export const logout = createAsyncThunk('auth/logout', async () => {
  const axios = (await import('../../lib/axios')).default;
  try {
    await axios.post(endpoint.auth.logout());
  } catch {
    // ignore
  }
  clearAuth();
  return undefined;
});

function loadStored(): { accessToken: string | null; user: AuthUser | null } {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  const userStr = localStorage.getItem(USER_KEY);
  let user: AuthUser | null = null;
  if (userStr) {
    try {
      user = JSON.parse(userStr) as AuthUser;
    } catch {
      // ignore
    }
  }
  return { accessToken: token, user };
}

const stored = loadStored();

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: stored.user as AuthUser | null,
    accessToken: stored.accessToken as string | null,
    isAuthenticated: !!stored.accessToken,
    loading: false,
    error: null as string | null,
  },
  reducers: {
    clearAuth: (state) => {
      clearAuth();
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.accessToken = action.payload.accessToken;
        state.user = action.payload.user ?? null;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? null;
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
        state.error = null;
      });
  },
});

export const { clearAuth: clearAuthAction } = authSlice.actions;
export default authSlice.reducer;
