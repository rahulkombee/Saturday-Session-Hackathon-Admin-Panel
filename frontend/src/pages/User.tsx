import { useEffect, useState, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchUsers, createUser, updateUser, deleteUser, clearCurrentUser } from '../redux/slices/userSlice';
import { fetchRoles } from '../redux/slices/roleSlice';
import { useDebounce } from '../hooks';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '../constants';
import { DataTable, type Column } from '../components/table/DataTable';
import { FormDrawer } from '../components/drawer/FormDrawer';
import { UserForm } from '../components/form/user/UserForm';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import type { UserItem } from '../types';
import type { UserCreateSchema, UserUpdateSchema } from '../schema/userSchema';
import { showSuccess, showError } from '../components/toast/Toast';
import { STATUS_OPTIONS } from '../constants';

export default function UserPage() {
  const dispatch = useAppDispatch();
  const { list, pagination, listLoading } = useAppSelector((s) => s.user);
  const roleList = useAppSelector((s) => s.role.list);
  const [page, setPage] = useState(DEFAULT_PAGE);
  const [searchName, setSearchName] = useState('');
  const [searchStatus, setSearchStatus] = useState('');
  const debouncedName = useDebounce(searchName, 300);
  const debouncedStatus = useDebounce(searchStatus, 300);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
  const [userToDelete, setUserToDelete] = useState<UserItem | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const loadRoles = useCallback(() => {
    dispatch(fetchRoles({ page: 1, limit: 100 }));
  }, [dispatch]);

  useEffect(() => {
    loadRoles();
  }, [loadRoles]);

  const load = useCallback(() => {
    dispatch(
      fetchUsers({
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
    setSelectedUser(null);
    setDrawerMode('create');
    dispatch(clearCurrentUser());
  }, [dispatch]);

  const handleCreate = () => {
    setSelectedUser(null);
    setDrawerMode('create');
    setDrawerOpen(true);
  };

  const handleView = (row: UserItem) => {
    setSelectedUser(row);
    setDrawerMode('view');
    setDrawerOpen(true);
  };

  const handleEdit = (row: UserItem) => {
    setSelectedUser(row);
    setDrawerMode('edit');
    setDrawerOpen(true);
  };

  const handleDeleteClick = (row: UserItem) => {
    setUserToDelete(row);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;
    setDeleteLoading(true);
    const result = await dispatch(deleteUser(userToDelete.id));
    setDeleteLoading(false);
    if (deleteUser.fulfilled.match(result)) {
      showSuccess(result.payload?.message ?? 'User deleted');
      setUserToDelete(null);
      load();
    } else if (deleteUser.rejected.match(result)) {
      showError(result.payload ?? 'Delete failed');
    }
  };

  const handleSubmit = async (data: UserCreateSchema | UserUpdateSchema) => {
    const body = { ...data } as UserUpdateSchema;
    if (body.password === '') delete (body as { password?: string }).password;

    if (drawerMode === 'create') {
      const result = await dispatch(createUser(data as UserCreateSchema));
      if (createUser.fulfilled.match(result)) {
        showSuccess(result.payload?.message ?? 'User created');
        handleCloseDrawer();
        load();
      } else if (createUser.rejected.match(result)) {
        showError(result.payload ?? 'Create failed');
      }
    } else if (selectedUser) {
      const result = await dispatch(updateUser({ id: selectedUser.id, body }));
      if (updateUser.fulfilled.match(result)) {
        showSuccess(result.payload?.message ?? 'User updated');
        handleCloseDrawer();
        load();
      } else if (updateUser.rejected.match(result)) {
        showError(result.payload ?? 'Update failed');
      }
    }
  };

  const roleOptions = roleList.map((r) => ({ value: r.id, label: r.name }));

  const columns: Column<UserItem>[] = [
    { id: 'firstname', label: 'First name', render: (r) => r.firstname },
    { id: 'lastname', label: 'Last name', render: (r) => r.lastname },
    { id: 'email', label: 'Email', render: (r) => r.email },
    { id: 'role_name', label: 'Role', render: (r) => r.role_name },
    { id: 'status_text', label: 'Status', render: (r) => r.status_text },
  ];

  return (
    <>
      <h1 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-gray-100">Users</h1>
      <DataTable<UserItem>
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
        createLabel="Create User"
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        getRowId={(r) => r.id}
      />
      <FormDrawer
        open={drawerOpen}
        onClose={handleCloseDrawer}
        onCloseComplete={handleCloseDrawer}
        title={drawerMode === 'create' ? 'Create User' : drawerMode === 'view' ? 'View User' : 'Edit User'}
        mode={drawerMode}
      >
        <div className="sm:col-span-2">
          <UserForm
            mode={drawerMode}
            roleOptions={roleOptions}
            defaultValues={
              selectedUser
                ? {
                    firstname: selectedUser.firstname,
                    lastname: selectedUser.lastname,
                    email: selectedUser.email,
                    role: selectedUser.role_id,
                    status: selectedUser.status as 'Y' | 'N',
                  }
                : undefined
            }
            onSubmit={handleSubmit}
          />
        </div>
      </FormDrawer>
      <ConfirmDialog
        open={userToDelete !== null}
        title="Delete user"
        message={userToDelete ? `Are you sure you want to delete ${userToDelete.firstname} ${userToDelete.lastname}? This action cannot be undone.` : ''}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
        loading={deleteLoading}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setUserToDelete(null)}
      />
    </>
  );
}
