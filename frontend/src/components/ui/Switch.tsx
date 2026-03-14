import type { InputHTMLAttributes } from 'react';

interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

export function Switch({ label, id, className = '', ...props }: SwitchProps) {
  const switchId = id ?? label?.toLowerCase().replace(/\s/g, '-');
  return (
    <label htmlFor={switchId} className="flex cursor-pointer items-center gap-2">
      <span className="relative inline-flex h-6 w-11 flex-shrink-0">
        <input
          type="checkbox"
          id={switchId}
          role="switch"
          className="peer sr-only"
          {...props}
        />
        <span className="block h-6 w-11 rounded-full bg-gray-200 dark:bg-gray-700 peer-checked:bg-blue-600 peer-focus:ring-2 peer-focus:ring-blue-500 peer-focus:ring-offset-2 peer-disabled:opacity-50 transition-colors" />
        <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
      </span>
      {label && <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>}
    </label>
  );
}
