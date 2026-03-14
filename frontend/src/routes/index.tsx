import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { MainLayout } from '../components/layout/MainLayout';
import { PATHS } from './paths';

const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const User = lazy(() => import('../pages/User'));
const Role = lazy(() => import('../pages/Role'));
const Brand = lazy(() => import('../pages/Brand'));
const NotFound = lazy(() => import('../pages/NotFound'));

function RouteFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <span className="text-gray-500">Loading…</span>
    </div>
  );
}

function LazyRoute({ Component }: { Component: React.LazyExoticComponent<React.ComponentType> }) {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Component />
    </Suspense>
  );
}

function RootRedirect() {
  const token = localStorage.getItem('accessToken');
  if (token) return <Navigate to={PATHS.dashboard} replace />;
  return <Navigate to={PATHS.login} replace />;
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootRedirect />,
  },
  { path: PATHS.login, element: <LazyRoute Component={Login} /> },
  { path: PATHS.register, element: <LazyRoute Component={Register} /> },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: 'dashboard', element: <LazyRoute Component={Dashboard} /> },
      { path: 'user', element: <LazyRoute Component={User} /> },
      { path: 'role', element: <LazyRoute Component={Role} /> },
      { path: 'brand', element: <LazyRoute Component={Brand} /> },
    ],
  },
  { path: '*', element: <LazyRoute Component={NotFound} /> },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}

export { router };
