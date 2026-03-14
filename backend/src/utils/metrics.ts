import { Registry, collectDefaultMetrics, Counter, Histogram } from 'prom-client';
import type { Request, Response, NextFunction } from 'express';

export const register = new Registry();
collectDefaultMetrics({ register });

const httpRequestsTotal = new Counter({
  name: 'http_requests_total',
  help: 'Total HTTP requests',
  labelNames: ['method', 'route', 'status'],
  registers: [register],
});

const httpRequestDurationSeconds = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request duration in seconds',
  labelNames: ['method', 'route', 'status'],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5],
  registers: [register],
});

function getRoute(req: Request): string {
  const base = (req.route?.path ?? req.path) || '/';
  return req.baseUrl ? req.baseUrl + base : base;
}

export function metricsMiddleware(req: Request, res: Response, next: NextFunction): void {
  const start = performance.now();
  const route = getRoute(req);

  res.on('finish', () => {
    const status = String(res.statusCode);
    const duration = (performance.now() - start) / 1000;
    httpRequestsTotal.inc({ method: req.method, route, status });
    httpRequestDurationSeconds.observe({ method: req.method, route, status }, duration);
  });

  next();
}

// Frontend specific metrics
export const frontendVitals = new Histogram({
  name: 'frontend_vitals',
  help: 'Frontend Web Vitals (LCP, FID, CLS, TTFB, FCP) in milliseconds',
  labelNames: ['metric_name'],
  buckets: [50, 100, 250, 500, 1000, 2500, 5000, 10000],
  registers: [register],
});

export const frontendErrorsTotal = new Counter({
  name: 'frontend_errors_total',
  help: 'Total number of frontend errors caught',
  labelNames: ['message', 'stack'],
  registers: [register],
});
