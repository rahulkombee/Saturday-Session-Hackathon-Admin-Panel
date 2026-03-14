import { useState } from 'react';
import { Input } from './Input';

interface PasswordInputProps extends Omit<Parameters<typeof Input>[0], 'type'> {}

export function PasswordInput(props: PasswordInputProps) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Input type={show ? 'text' : 'password'} {...props} />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute right-3 top-9 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
      >
        {show ? 'Hide' : 'Show'}
      </button>
    </div>
  );
}
