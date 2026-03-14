/**
 * Frontend Telemetry Utility
 * Captures Web Vitals and Errors and sends them to the backend.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
const TELEMETRY_URL = `${API_BASE_URL}/api/telemetry`;

export const initTelemetry = () => {
  console.log('🚀 Initializing Frontend Telemetry...');
  console.log(`📡 Telemetry destination: ${TELEMETRY_URL}`);

  // 1. Capture JS Errors
  window.addEventListener('error', (event) => {
    sendTelemetry('errors', {
      message: event.message,
      url: window.location.href,
      stack: event.error?.stack || 'No stack trace'
    });
  });

  // 2. Capture Unhandled Promise Rejections
  window.addEventListener('unhandledrejection', (event) => {
    sendTelemetry('errors', {
      message: `Unhandled Rejection: ${event.reason}`,
      url: window.location.href,
      stack: event.reason?.stack || 'No stack trace'
    });
  });

  // 3. Capture Basic Performance Metrics (TTFB)
  if (performance && performance.getEntriesByType) {
    const [nav] = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
    if (nav) {
      sendTelemetry('vitals', {
        name: 'TTFB',
        value: nav.responseStart,
        id: 'basic-nav'
      });
    }
  }
};

const sendTelemetry = (type: 'vitals' | 'errors', data: any) => {
  try {
    fetch(`${TELEMETRY_URL}/${type}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      keepalive: true, // Ensure it sends even if page is closing
    })
    .then(res => {
        if (res.ok) {
            console.log(`✅ Telemetry sent (${type}):`, data.name || data.message || 'vitals');
        } else {
            console.warn(`⚠️ Telemetry failed (${type}):`, res.status, res.statusText);
        }
    })
    .catch((err) => {
        console.error(`❌ Telemetry Error (${type}):`, err.message);
    });
  } catch (err) {
      console.error(`❌ Telemetry Exception (${type}):`, err);
  }
};
