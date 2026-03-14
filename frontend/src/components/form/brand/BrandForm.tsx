import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { brandCreateSchema, brandUpdateSchema, type BrandCreateSchema, type BrandUpdateSchema } from '../../../schema/brandSchema';
import { STATUS_OPTIONS } from '../../../constants';
import { Button, Input, Dropdown } from '../../ui';

interface BrandFormProps {
  defaultValues?: Partial<BrandCreateSchema | BrandUpdateSchema>;
  mode: 'create' | 'edit' | 'view';
  onSubmit: (data: BrandCreateSchema | BrandUpdateSchema) => void;
  loading?: boolean;
}

export function BrandForm({ defaultValues, mode, onSubmit, loading }: BrandFormProps) {
  const schema = mode === 'create' ? brandCreateSchema : brandUpdateSchema;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BrandCreateSchema | BrandUpdateSchema>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues ?? { name: '', status: 'Y', description: '' },
  });

  const isView = mode === 'view';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input label="Name" {...register('name')} error={errors.name?.message} placeholder="Brand name" disabled={isView} />
      <Dropdown
        label="Status"
        options={STATUS_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
        {...register('status')}
        error={errors.status?.message}
        disabled={isView}
      />
      <div className="sm:col-span-2">
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Description (optional)</label>
        <textarea
          {...register('description')}
          rows={3}
          disabled={isView}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 disabled:opacity-80 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
          placeholder="Description"
        />
        {errors.description?.message && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description.message}</p>
        )}
      </div>
      {!isView && (
        <Button type="submit" variant="primary" loading={loading} fullWidth>
          {mode === 'create' ? 'Create' : 'Update'}
        </Button>
      )}
    </form>
  );
}
