import { Link } from 'react-router-dom';
import { PATHS } from '../routes/paths';
import { Button } from '../components/ui/Button';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gray-50 p-8 dark:bg-gray-950">
      <div className="text-center">
        <h1 className="text-8xl font-bold text-gray-300 dark:text-gray-700">404</h1>
        <h2 className="mt-2 text-xl font-semibold text-gray-800 dark:text-gray-200">Page not found</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          The page you are looking for does not exist or has been moved.
        </p>
      </div>
      <Link to={PATHS.login}>
        <Button variant="primary">Go to Login</Button>
      </Link>
    </div>
  );
}
