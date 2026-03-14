import toast, { Toaster } from 'react-hot-toast';

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: 'var(--toast-bg, #1f2937)',
          color: 'var(--toast-color, #f9fafb)',
        },
        success: { iconTheme: { primary: '#22c55e', secondary: '#16a34a' } },
        error: { iconTheme: { primary: '#ef4444', secondary: '#dc2626' } },
      }}
    />
  );
}

export function showSuccess(message: string): void {
  toast.success(message);
}

export function showError(message: string): void {
  toast.error(message);
}
