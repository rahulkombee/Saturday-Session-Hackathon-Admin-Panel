import { useEffect, useCallback, type ReactNode } from 'react';

export type DrawerMode = 'create' | 'view' | 'edit';

interface FormDrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  mode: DrawerMode;
  /** Called when drawer closes (after close button or overlay click). Use to clear form/selection state. */
  onCloseComplete?: () => void;
}

export function FormDrawer({ open, onClose, title, children, onCloseComplete }: FormDrawerProps) {
  const handleClose = useCallback(() => {
    onClose();
    onCloseComplete?.();
  }, [onClose, onCloseComplete]);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) handleClose();
  };

  useEffect(() => {
    if (!open) return;
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    document.addEventListener('keydown', onEscape);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onEscape);
      document.body.style.overflow = '';
    };
  }, [open, handleClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/40"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className="h-full w-[40vw] min-w-[280px] max-w-[600px] overflow-y-auto bg-white shadow-xl dark:bg-gray-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-900">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h2>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
