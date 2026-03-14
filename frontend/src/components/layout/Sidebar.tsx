import { NavLink } from 'react-router-dom';
import { PATHS } from '../../routes/paths';

const links = [
  { to: PATHS.dashboard, label: 'Dashboard' },
  { to: PATHS.user, label: 'Users' },
  { to: PATHS.role, label: 'Roles' },
  { to: PATHS.brand, label: 'Brands' },
];

export function Sidebar() {
  return (
    <aside className="w-56 flex-shrink-0 border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
      <nav className="flex flex-col gap-1 p-3">
        {links.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `rounded-lg px-3 py-2 text-sm font-medium transition ${
                isActive
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
