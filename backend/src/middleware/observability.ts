import type { Request, Response, NextFunction } from 'express';
import { metricsMiddleware } from '../utils/metrics.js';
import { log, logger } from '../utils/logger.js';

export function observabilityMiddleware(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();
  logger.info('request_start', { method: req.method, path: req.path });

  res.on('finish', () => {
    const duration = Date.now() - start;
    const level = res.statusCode >= 500 ? 'error' : res.statusCode >= 400 ? 'warn' : 'info';
    log(level, 'request_end', {
      method: req.method,
      path: req.path,
      status: res.statusCode,
      durationMs: duration,
    });
  });

  metricsMiddleware(req, res, next);
}
