import { Router, type Request, type Response } from 'express';
import { logger } from '../utils/logger.js';
import { frontendVitals, frontendErrorsTotal } from '../utils/metrics.js';

const router = Router();

/**
 * Capture Web Vitals from Frontend
 */
router.post('/vitals', (req: Request, res: Response) => {
  const { name, value, id } = req.body;
  
  logger.info('frontend_vital_received', { metric: name, value, id });
  
  // Record in Prometheus
  frontendVitals.observe({ metric_name: name }, value);
  
  res.status(204).send();
});

/**
 * Capture Frontend Errors
 */
router.post('/errors', (req: Request, res: Response) => {
  const { message, stack, url } = req.body;
  
  logger.error('frontend_error_received', { message, url, stack });
  
  // Record in Prometheus
  frontendErrorsTotal.inc({ 
    message: String(message).substring(0, 100), 
    stack: String(stack).substring(0, 100) 
  });
  
  res.status(204).send();
});

export default router;
