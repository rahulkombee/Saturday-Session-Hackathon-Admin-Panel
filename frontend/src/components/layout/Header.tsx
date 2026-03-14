import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch } from '../../redux/hooks';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { logout } from '../../redux/slices/authSlice';
import { PATHS } from '../../routes/paths';
import { Button } from '../ui/Button';

const BREADCRUMB: Record<string, string> = {
  [PATHS.dashboard]: 'Dashboard',
  [PATHS.user]: 'Users',
  [PATHS.role]: 'Roles',
  [PATHS.brand]: 'Brands',
};

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const breadcrumbLabel = BREADCRUMB[location.pathname] ?? 'App';

  const handleLogout = () => {
    dispatch(logout());
    navigate(PATHS.login);
  };

  return (
    <header className="flex h-14 items-center justify-between border-b border-gray-200 bg-white px-4 dark:border-gray-700 dark:bg-gray-900">
      <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
        {breadcrumbLabel}
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggleTheme}
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-400"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
        <span className="text-sm text-gray-700 dark:text-gray-300">
          {user?.firstname} {user?.lastname}
        </span>
        <Button variant="ghost" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </header>
  );
}
