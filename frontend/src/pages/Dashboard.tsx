import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Dashboard</h1>
      <p className="mt-2 text-gray-600 dark:text-gray-400">
        Welcome, {user?.firstname} {user?.lastname}.
      </p>
    </div>
  );
}
