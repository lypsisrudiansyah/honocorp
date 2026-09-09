import type { MiddlewareHandler } from 'hono';
import { logger } from '../../config/logger.js';

export const pinoLoggerMiddleware: MiddlewareHandler = async (c, next) => {
  const start = Date.now();
  const method = c.req.method;
  const path = c.req.path;

  await next();

  const status = c.res.status;
  const duration = Date.now() - start;

  logger.info(
    {
      type: 'http_request',
      method,
      path,
      status,
      durationMs: duration,
    },
    `${method} ${path} ${status} - ${duration}ms`
  );
};
