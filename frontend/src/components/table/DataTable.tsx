import type { PaginationMeta } from '../../types';
import { Button } from '../ui/Button';
import { TableSkeleton } from './TableSkeleton';

export interface Column<T> {
  id: string;
  label: string;
  render: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  pagination: PaginationMeta | null;
  onPageChange: (page: number) => void;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  filterNode?: React.ReactNode;
  onCreateClick?: () => void;
  createLabel?: string;
  onView?: (row: T) => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  getRowId: (row: T) => string;
}

const IconView = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const IconEdit = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const IconDelete = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

export function DataTable<T>({
  columns,
  data,
  loading,
  pagination,
  onPageChange,
  searchPlaceholder = 'Search...',
  searchValue = '',
  onSearchChange,
  filterNode,
  onCreateClick,
  createLabel = 'Create',
  onView,
  onEdit,
  onDelete,
  getRowId,
}: DataTableProps<T>) {
  const p = pagination;
  const hasActions = Boolean(onView || onEdit || onDelete);

  return (
    <div className="space-y-4">
      {/* Top bar: Create only */}
      <div className="flex justify-end">
        {onCreateClick && (
          <Button variant="primary" onClick={onCreateClick}>
            {createLabel}
          </Button>
        )}
      </div>

      {/* Table card: header, filter row, body */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800/80">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.id}
                    className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300"
                  >
                    {col.label}
                  </th>
                ))}
                {hasActions && (
                  <th className="w-36 px-4 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                    Actions
                  </th>
                )}
              </tr>
              {/* Filter row: below header, full width */}
              {(onSearchChange || filterNode) && (
                <tr className="bg-gray-50 dark:bg-gray-800/80">
                  <td colSpan={columns.length + (hasActions ? 1 : 0)} className="px-4 py-3">
                    <div className="flex flex-wrap items-center gap-3">
                      {onSearchChange && (
                        <input
                          type="search"
                          placeholder={searchPlaceholder}
                          value={searchValue}
                          onChange={(e) => onSearchChange(e.target.value)}
                          className="min-w-[200px] max-w-xs rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400"
                        />
                      )}
                      {filterNode}
                    </div>
                  </td>
                </tr>
              )}
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
              {loading ? (
                <TableSkeleton
                  columnCount={columns.length}
                  actionColumn={hasActions}
                  rowCount={6}
                />
              ) : (
                <>
                  {data.length === 0 ? (
                    <tr>
                      <td
                        colSpan={columns.length + (hasActions ? 1 : 0)}
                        className="px-4 py-12 text-center text-sm text-gray-500 dark:text-gray-400"
                      >
                        No data
                      </td>
                    </tr>
                  ) : (
                    data.map((row) => (
                      <tr
                        key={getRowId(row)}
                        className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      >
                        {columns.map((col) => (
                          <td
                            key={col.id}
                            className="whitespace-nowrap px-4 py-3 text-sm text-gray-900 dark:text-gray-100"
                          >
                            {col.render(row)}
                          </td>
                        ))}
                        {hasActions && (
                          <td className="whitespace-nowrap px-4 py-3">
                            <div className="flex justify-end gap-1">
                              {onView && (
                                <button
                                  type="button"
                                  onClick={() => onView(row)}
                                  className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
                                  title="View"
                                  aria-label="View"
                                >
                                  <IconView />
                                </button>
                              )}
                              {onEdit && (
                                <button
                                  type="button"
                                  onClick={() => onEdit(row)}
                                  className="rounded-lg p-2 text-gray-500 transition hover:bg-blue-100 hover:text-blue-600 dark:text-gray-400 dark:hover:bg-blue-900/30 dark:hover:text-blue-400"
                                  title="Edit"
                                  aria-label="Edit"
                                >
                                  <IconEdit />
                                </button>
                              )}
                              {onDelete && (
                                <button
                                  type="button"
                                  onClick={() => onDelete(row)}
                                  className="rounded-lg p-2 text-gray-500 transition hover:bg-red-100 hover:text-red-600 dark:text-gray-400 dark:hover:bg-red-900/30 dark:hover:text-red-400"
                                  title="Delete"
                                  aria-label="Delete"
                                >
                                  <IconDelete />
                                </button>
                              )}
                            </div>
                          </td>
                        )}
                      </tr>
                    ))
                  )}
                </>
              )}
            </tbody>
          </table>
        </div>

      </div>

      {p && p.totalPages > 1 && !loading && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Showing {p.from}–{p.to} of {p.total}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              disabled={p.page <= 1}
              onClick={() => onPageChange(p.page - 1)}
            >
              Previous
            </Button>
            <span className="min-w-[100px] text-center text-sm text-gray-700 dark:text-gray-300">
              Page {p.page} of {p.totalPages}
            </span>
            <Button
              variant="secondary"
              disabled={p.page >= p.totalPages}
              onClick={() => onPageChange(p.page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
