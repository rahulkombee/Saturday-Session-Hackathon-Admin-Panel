import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { registerSchema, type RegisterSchema } from '../schema/authSchema';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { register as registerThunk } from '../redux/slices/authSlice';
import { PATHS } from '../routes/paths';
import { Button, Input, PasswordInput } from '../components/ui';
import { showError, showSuccess } from '../components/toast/Toast';

export default function Register() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const loading = useAppSelector((s) => s.auth.loading);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: { firstname: '', lastname: '', email: '', password: '' },
  });

  const onSubmit = async (data: RegisterSchema) => {
    const result = await dispatch(registerThunk(data));
    if (registerThunk.fulfilled.match(result)) {
      showSuccess('Registration successful. Please login.');
      navigate(PATHS.login, { replace: true });
    } else if (registerThunk.rejected.match(result)) {
      showError(result.payload ?? 'Registration failed');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-900">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Register</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
          <Input label="First name" {...register('firstname')} error={errors.firstname?.message} placeholder="First name" />
          <Input label="Last name" {...register('lastname')} error={errors.lastname?.message} placeholder="Last name" />
          <Input label="Email" type="email" {...register('email')} error={errors.email?.message} placeholder="email@example.com" />
          <PasswordInput label="Password" {...register('password')} error={errors.password?.message} placeholder="Min 6 characters" />
          <Button type="submit" variant="primary" fullWidth loading={loading}>
            Register
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <Link to={PATHS.login} className="font-medium text-blue-600 hover:underline dark:text-blue-400">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
