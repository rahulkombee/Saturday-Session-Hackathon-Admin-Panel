/**
 * Anomaly injection endpoints for observability demos.
 * Use only in non-production or with a feature flag.
 */
import { Router, type Request, type Response } from 'express';
import { logger } from '../utils/logger.js';

const router = Router();

router.get('/delay', async (_req: Request, res: Response) => {
  const ms = Math.min(parseInt(String(_req.query.ms), 10) || 2000, 10000);
  logger.info('observability_delay', { ms });
  await new Promise((r) => setTimeout(r, ms));
  res.json({ ok: true, delayed: ms });
});

router.get('/error500', (_req: Request, res: Response) => {
  logger.error('observability_forced_500', {});
  res.status(500).json({ success: false, message: 'Intentional 500 for observability demo' });
});

router.get('/heavy', async (_req: Request, res: Response) => {
  const size = Math.min(parseInt(String(_req.query.kb), 10) || 100, 500);
  const payload = 'x'.repeat(size * 1024);
  logger.info('observability_heavy', { sizeKb: size });
  res.json({ ok: true, sizeKb: size, payloadLength: payload.length });
});

export default router;
