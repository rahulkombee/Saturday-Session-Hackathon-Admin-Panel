interface TableSkeletonProps {
  columnCount: number;
  actionColumn?: boolean;
  rowCount?: number;
}

export function TableSkeleton({ columnCount, actionColumn = true, rowCount = 6 }: TableSkeletonProps) {
  return (
    <>
      {Array.from({ length: rowCount }).map((_, rowIndex) => (
        <tr key={rowIndex} className="animate-pulse border-b border-gray-200 last:border-0 dark:border-gray-700">
          {Array.from({ length: columnCount }).map((_, colIndex) => (
            <td key={colIndex} className="px-4 py-3">
              <div
                className="h-4 rounded bg-gray-100 dark:bg-gray-800"
                style={{ width: `${50 + (colIndex % 3) * 15}%` }}
              />
            </td>
          ))}
          {actionColumn && (
            <td className="px-4 py-3">
              <div className="flex justify-end gap-1">
                <div className="h-8 w-8 rounded bg-gray-100 dark:bg-gray-800" />
                <div className="h-8 w-8 rounded bg-gray-100 dark:bg-gray-800" />
                <div className="h-8 w-8 rounded bg-gray-100 dark:bg-gray-800" />
              </div>
            </td>
          )}
        </tr>
      ))}
    </>
  );
}
