import { trace } from '@opentelemetry/api';
import { appendFileSync, mkdirSync, existsSync } from 'fs';
import { dirname } from 'path';

const LOG_PATH = process.env.LOG_PATH ?? './logs/app.log';
const ENABLE_FILE_LOG = process.env.ENABLE_FILE_LOG !== 'false';

function getTraceId(): string | undefined {
  const span = trace.getActiveSpan();
  return span?.spanContext().traceId;
}

function writeLine(obj: Record<string, unknown>): void {
  const line = JSON.stringify(obj) + '\n';
  process.stdout.write(line);
  if (ENABLE_FILE_LOG) {
    try {
      const dir = dirname(LOG_PATH);
      if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
      appendFileSync(LOG_PATH, line);
    } catch {
      // ignore file write errors
    }
  }
}

export function log(level: string, msg: string, meta?: Record<string, unknown>): void {
  const traceId = getTraceId();
  writeLine({
    time: new Date().toISOString(),
    level,
    msg,
    traceId: traceId ?? undefined,
    ...meta,
  });
}

export const logger = {
  info: (msg: string, meta?: Record<string, unknown>) => log('info', msg, meta),
  warn: (msg: string, meta?: Record<string, unknown>) => log('warn', msg, meta),
  error: (msg: string, meta?: Record<string, unknown>) => log('error', msg, meta),
};
