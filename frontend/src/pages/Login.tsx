import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginSchema } from '../schema/authSchema';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { login } from '../redux/slices/authSlice';
import { PATHS } from '../routes/paths';
import { Button, Input, PasswordInput } from '../components/ui';
import { showError, showSuccess } from '../components/toast/Toast';

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  const loading = useAppSelector((s) => s.auth.loading);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  useEffect(() => {
    if (isAuthenticated) navigate(PATHS.dashboard, { replace: true });
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data: LoginSchema) => {
    const result = await dispatch(login(data));
    if (login.fulfilled.match(result)) {
      showSuccess(result.payload?.user ? 'Login successful' : (result.payload as { message?: string })?.message ?? 'Login successful');
      navigate(PATHS.dashboard, { replace: true });
    } else if (login.rejected.match(result)) {
      showError(result.payload ?? 'Login failed');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-900">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Login</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
          <Input label="Email" type="email" {...register('email')} error={errors.email?.message} placeholder="email@example.com" />
          <PasswordInput label="Password" {...register('password')} error={errors.password?.message} placeholder="Password" />
          <Button type="submit" variant="primary" fullWidth loading={loading}>
            Login
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          Don&apos;t have an account?{' '}
          <Link to={PATHS.register} className="font-medium text-blue-600 hover:underline dark:text-blue-400">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
