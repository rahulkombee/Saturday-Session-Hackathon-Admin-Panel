import { useEffect, useState, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchBrands, createBrand, updateBrand, deleteBrand, clearCurrentBrand } from '../redux/slices/brandSlice';
import { useDebounce } from '../hooks';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '../constants';
import { DataTable, type Column } from '../components/table/DataTable';
import { FormDrawer } from '../components/drawer/FormDrawer';
import { BrandForm } from '../components/form/brand/BrandForm';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import type { BrandItem } from '../types';
import type { BrandCreateSchema, BrandUpdateSchema } from '../schema/brandSchema';
import { showSuccess, showError } from '../components/toast/Toast';
import { STATUS_OPTIONS } from '../constants';

export default function BrandPage() {
  const dispatch = useAppDispatch();
  const { list, pagination, listLoading } = useAppSelector((s) => s.brand);
  const [page, setPage] = useState(DEFAULT_PAGE);
  const [searchName, setSearchName] = useState('');
  const [searchStatus, setSearchStatus] = useState('');
  const debouncedName = useDebounce(searchName, 300);
  const debouncedStatus = useDebounce(searchStatus, 300);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedBrand, setSelectedBrand] = useState<BrandItem | null>(null);
  const [brandToDelete, setBrandToDelete] = useState<BrandItem | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const load = useCallback(() => {
    dispatch(
      fetchBrands({
        page,
        limit: DEFAULT_PAGE_SIZE,
        name: debouncedName || undefined,
        status: debouncedStatus || undefined,
      })
    );
  }, [dispatch, page, debouncedName, debouncedStatus]);

  useEffect(() => {
    load();
  }, [load]);

  const handleCloseDrawer = useCallback(() => {
    setDrawerOpen(false);
    setSelectedBrand(null);
    setDrawerMode('create');
    dispatch(clearCurrentBrand());
  }, [dispatch]);

  const handleCreate = () => {
    setSelectedBrand(null);
    setDrawerMode('create');
    setDrawerOpen(true);
  };

  const handleView = (row: BrandItem) => {
    setSelectedBrand(row);
    setDrawerMode('view');
    setDrawerOpen(true);
  };

  const handleEdit = (row: BrandItem) => {
    setSelectedBrand(row);
    setDrawerMode('edit');
    setDrawerOpen(true);
  };

  const handleDeleteClick = (row: BrandItem) => {
    setBrandToDelete(row);
  };

  const handleDeleteConfirm = async () => {
    if (!brandToDelete) return;
    setDeleteLoading(true);
    const result = await dispatch(deleteBrand(brandToDelete.id));
    setDeleteLoading(false);
    if (deleteBrand.fulfilled.match(result)) {
      showSuccess(result.payload?.message ?? 'Brand deleted');
      setBrandToDelete(null);
      load();
    } else if (deleteBrand.rejected.match(result)) {
      showError(result.payload ?? 'Delete failed');
    }
  };

  const handleSubmit = async (data: BrandCreateSchema | BrandUpdateSchema) => {
    if (drawerMode === 'create') {
      const result = await dispatch(createBrand(data as BrandCreateSchema));
      if (createBrand.fulfilled.match(result)) {
        showSuccess(result.payload?.message ?? 'Brand created');
        handleCloseDrawer();
        load();
      } else if (createBrand.rejected.match(result)) {
        showError(result.payload ?? 'Create failed');
      }
    } else if (selectedBrand) {
      const result = await dispatch(updateBrand({ id: selectedBrand.id, body: data as BrandUpdateSchema }));
      if (updateBrand.fulfilled.match(result)) {
        showSuccess(result.payload?.message ?? 'Brand updated');
        handleCloseDrawer();
        load();
      } else if (updateBrand.rejected.match(result)) {
        showError(result.payload ?? 'Update failed');
      }
    }
  };

  const columns: Column<BrandItem>[] = [
    { id: 'name', label: 'Name', render: (r) => r.name },
    { id: 'status_text', label: 'Status', render: (r) => r.status_text },
    { id: 'description', label: 'Description', render: (r) => r.description ?? '—' },
  ];

  return (
    <>
      <h1 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-gray-100">Brands</h1>
      <DataTable<BrandItem>
        columns={columns}
        data={list}
        loading={listLoading}
        pagination={pagination}
        onPageChange={setPage}
        searchPlaceholder="Search by name..."
        searchValue={searchName}
        onSearchChange={setSearchName}
        filterNode={
          <select
            value={searchStatus}
            onChange={(e) => setSearchStatus(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
          >
            <option value="">All status</option>
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        }
        onCreateClick={handleCreate}
        createLabel="Create Brand"
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        getRowId={(r) => r.id}
      />
      <FormDrawer
        open={drawerOpen}
        onClose={handleCloseDrawer}
        onCloseComplete={handleCloseDrawer}
        title={drawerMode === 'create' ? 'Create Brand' : drawerMode === 'view' ? 'View Brand' : 'Edit Brand'}
        mode={drawerMode}
      >
        <div className="sm:col-span-2">
          <BrandForm
            mode={drawerMode}
            defaultValues={
              selectedBrand
                ? {
                    name: selectedBrand.name,
                    status: selectedBrand.status as 'Y' | 'N',
                    description: selectedBrand.description,
                  }
                : undefined
            }
            onSubmit={handleSubmit}
          />
        </div>
      </FormDrawer>
      <ConfirmDialog
        open={brandToDelete !== null}
        title="Delete brand"
        message={brandToDelete ? `Are you sure you want to delete "${brandToDelete.name}"? This action cannot be undone.` : ''}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
        loading={deleteLoading}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setBrandToDelete(null)}
      />
    </>
  );
}
