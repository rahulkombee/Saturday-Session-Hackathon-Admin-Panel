import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { roleCreateSchema, roleUpdateSchema, type RoleCreateSchema, type RoleUpdateSchema } from '../../../schema/roleSchema';
import { STATUS_OPTIONS } from '../../../constants';
import { Button, Input, Dropdown } from '../../ui';

interface RoleFormProps {
  defaultValues?: Partial<RoleCreateSchema>;
  mode: 'create' | 'edit' | 'view';
  onSubmit: (data: RoleCreateSchema | RoleUpdateSchema) => void;
  loading?: boolean;
}

export function RoleForm({ defaultValues, mode, onSubmit, loading }: RoleFormProps) {
  const schema = mode === 'create' ? roleCreateSchema : roleUpdateSchema;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RoleCreateSchema | RoleUpdateSchema>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues ?? { name: '', status: 'Y' },
  });

  const isView = mode === 'view';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Name"
        {...register('name')}
        error={errors.name?.message}
        placeholder="Role name"
        disabled={isView}
      />
      <Dropdown
        label="Status"
        options={STATUS_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
        {...register('status')}
        error={errors.status?.message}
        disabled={isView}
      />
      {!isView && (
        <Button type="submit" variant="primary" loading={loading} fullWidth>
          {mode === 'create' ? 'Create' : 'Update'}
        </Button>
      )}
    </form>
  );
}
