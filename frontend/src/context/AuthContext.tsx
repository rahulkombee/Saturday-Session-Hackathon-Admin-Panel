import { createContext, useContext, type ReactNode } from 'react';
import { useAppSelector } from '../redux/hooks';

interface AuthContextValue {
  isAuthenticated: boolean;
  user: { id: string; firstname: string; lastname: string; email: string } | null;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  const user = useAppSelector((s) => s.auth.user);

  const value: AuthContextValue = {
    isAuthenticated,
    user: user ? { id: user.id, firstname: user.firstname, lastname: user.lastname, email: user.email } : null,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
