import './instrumentation.js';
import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import type { Application } from 'express';
import { connectDB } from './utils/db.js';
import { observabilityMiddleware } from './middleware/observability.js';
import { register } from './utils/metrics.js';
import routes from './route/index.js';
import { logger } from './utils/logger.js';

const app: Application = express();
const PORT = process.env.PORT ?? 4000;

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(observabilityMiddleware);

app.use('/api', routes);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/metrics', async (_req, res) => {
  res.setHeader('Content-Type', register.contentType);
  res.end(await register.metrics());
});

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      logger.info('Server started', { port: PORT });
    });
  })
  .catch((err) => {
    logger.error('MongoDB connection failed', { err: String(err) });
    process.exit(1);
  });

export default app;
