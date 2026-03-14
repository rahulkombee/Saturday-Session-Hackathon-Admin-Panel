import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/toast/Toast';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AppRouter } from './routes';
import './index.css';
import { initTelemetry } from './utils/telemetry';

// Initialize performance and error tracking
initTelemetry();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
        <ThemeProvider>
          <AuthProvider>
            <ToastProvider />
            <AppRouter />
          </AuthProvider>
        </ThemeProvider>
      </Provider>
    </ErrorBoundary>
  </StrictMode>
);
