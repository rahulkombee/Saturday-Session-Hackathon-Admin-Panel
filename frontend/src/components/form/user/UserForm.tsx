import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userCreateSchema, userUpdateSchema, type UserCreateSchema, type UserUpdateSchema } from '../../../schema/userSchema';
import { STATUS_OPTIONS } from '../../../constants';
import { Button, Input, PasswordInput, Dropdown } from '../../ui';

interface UserFormProps {
  defaultValues?: Partial<UserCreateSchema | UserUpdateSchema>;
  mode: 'create' | 'edit' | 'view';
  roleOptions: { value: string; label: string }[];
  onSubmit: (data: UserCreateSchema | UserUpdateSchema) => void;
  loading?: boolean;
}

export function UserForm({ defaultValues, mode, roleOptions, onSubmit, loading }: UserFormProps) {
  const schema = mode === 'create' ? userCreateSchema : userUpdateSchema;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserCreateSchema | UserUpdateSchema>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues ?? {
      firstname: '',
      lastname: '',
      email: '',
      password: '',
      role: '',
      status: 'Y',
    },
  });

  const isEdit = mode === 'edit';
  const isView = mode === 'view';
  const disabled = isView;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input label="First name" {...register('firstname')} error={errors.firstname?.message} placeholder="First name" disabled={disabled} />
      <Input label="Last name" {...register('lastname')} error={errors.lastname?.message} placeholder="Last name" disabled={disabled} />
      <Input label="Email" type="email" {...register('email')} error={errors.email?.message} placeholder="email@example.com" disabled={isEdit || isView} />
      {!isEdit && !isView && (
        <PasswordInput label="Password" {...register('password')} error={errors.password?.message} placeholder="Min 6 characters" />
      )}
      {isEdit && !isView && (
        <PasswordInput label="New password (optional)" {...register('password')} error={(errors as { password?: { message?: string } }).password?.message} placeholder="Leave blank to keep" />
      )}
      <Dropdown
        label="Role"
        options={roleOptions}
        placeholder="Select role"
        {...register('role')}
        error={errors.role?.message}
        disabled={disabled}
      />
      <Dropdown
        label="Status"
        options={STATUS_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
        {...register('status')}
        error={errors.status?.message}
        disabled={disabled}
      />
      {!isView && (
        <Button type="submit" variant="primary" loading={loading} fullWidth>
          {mode === 'create' ? 'Create' : 'Update'}
        </Button>
      )}
    </form>
  );
}
