import { useEffect, useState, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchRoles, createRole, updateRole, deleteRole, clearCurrentRole } from '../redux/slices/roleSlice';
import { useDebounce } from '../hooks';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '../constants';
import { DataTable, type Column } from '../components/table/DataTable';
import { FormDrawer } from '../components/drawer/FormDrawer';
import { RoleForm } from '../components/form/role/RoleForm';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import type { RoleItem } from '../types';
import type { RoleCreateSchema, RoleUpdateSchema } from '../schema/roleSchema';
import { showSuccess, showError } from '../components/toast/Toast';
import { STATUS_OPTIONS } from '../constants';

export default function RolePage() {
  const dispatch = useAppDispatch();
  const { list, pagination, listLoading } = useAppSelector((s) => s.role);
  const [page, setPage] = useState(DEFAULT_PAGE);
  const [searchName, setSearchName] = useState('');
  const [searchStatus, setSearchStatus] = useState('');
  const debouncedName = useDebounce(searchName, 300);
  const debouncedStatus = useDebounce(searchStatus, 300);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedRole, setSelectedRole] = useState<RoleItem | null>(null);
  const [roleToDelete, setRoleToDelete] = useState<RoleItem | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const load = useCallback(() => {
    dispatch(
      fetchRoles({
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
    setSelectedRole(null);
    setDrawerMode('create');
    dispatch(clearCurrentRole());
  }, [dispatch]);

  const handleCreate = () => {
    setSelectedRole(null);
    setDrawerMode('create');
    setDrawerOpen(true);
  };

  const handleView = (row: RoleItem) => {
    setSelectedRole(row);
    setDrawerMode('view');
    setDrawerOpen(true);
  };

  const handleEdit = (row: RoleItem) => {
    setSelectedRole(row);
    setDrawerMode('edit');
    setDrawerOpen(true);
  };

  const handleDeleteClick = (row: RoleItem) => {
    setRoleToDelete(row);
  };

  const handleDeleteConfirm = async () => {
    if (!roleToDelete) return;
    setDeleteLoading(true);
    const result = await dispatch(deleteRole(roleToDelete.id));
    setDeleteLoading(false);
    if (deleteRole.fulfilled.match(result)) {
      showSuccess(result.payload?.message ?? 'Role deleted');
      setRoleToDelete(null);
      load();
    } else if (deleteRole.rejected.match(result)) {
      showError(result.payload ?? 'Delete failed');
    }
  };

  const handleSubmit = async (data: RoleCreateSchema | RoleUpdateSchema) => {
    if (drawerMode === 'create') {
      const result = await dispatch(createRole(data as RoleCreateSchema));
      if (createRole.fulfilled.match(result)) {
        showSuccess(result.payload?.message ?? 'Role created');
        handleCloseDrawer();
        load();
      } else if (createRole.rejected.match(result)) {
        showError(result.payload ?? 'Create failed');
      }
    } else if (selectedRole) {
      const result = await dispatch(updateRole({ id: selectedRole.id, body: data as RoleUpdateSchema }));
      if (updateRole.fulfilled.match(result)) {
        showSuccess(result.payload?.message ?? 'Role updated');
        handleCloseDrawer();
        load();
      } else if (updateRole.rejected.match(result)) {
        showError(result.payload ?? 'Update failed');
      }
    }
  };

  const columns: Column<RoleItem>[] = [
    { id: 'name', label: 'Name', render: (r) => r.name },
    { id: 'status_text', label: 'Status', render: (r) => r.status_text },
  ];

  return (
    <>
      <h1 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-gray-100">Roles</h1>
      <DataTable<RoleItem>
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
        createLabel="Create Role"
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        getRowId={(r) => r.id}
      />
      <FormDrawer
        open={drawerOpen}
        onClose={handleCloseDrawer}
        onCloseComplete={handleCloseDrawer}
        title={drawerMode === 'create' ? 'Create Role' : drawerMode === 'view' ? 'View Role' : 'Edit Role'}
        mode={drawerMode}
      >
        <div className="sm:col-span-2">
          <RoleForm
            mode={drawerMode}
            defaultValues={selectedRole ? { name: selectedRole.name, status: selectedRole.status as 'Y' | 'N' } : undefined}
            onSubmit={handleSubmit}
          />
        </div>
      </FormDrawer>
      <ConfirmDialog
        open={roleToDelete !== null}
        title="Delete role"
        message={roleToDelete ? `Are you sure you want to delete "${roleToDelete.name}"? This action cannot be undone.` : ''}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
        loading={deleteLoading}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setRoleToDelete(null)}
      />
    </>
  );
}
