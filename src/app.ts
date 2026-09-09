import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { HTTPException } from 'hono/http-exception';
import { env } from './config/env.js';
import { logger } from './config/logger.js';
import { pinoLoggerMiddleware } from './http/middlewares/logger.middleware.js';
import { indexRoute } from './http/routes/index.route.js';
import { authRoute } from './http/routes/auth.route.js';
import { userRoute } from './http/routes/user.route.js';
import { projectRoute } from './http/routes/project.route.js';
import { errorResponse } from './utils/response.util.js';
import { AppHttpException } from './utils/errors.util.js';

const app = new Hono();

// Fase 3.31: Global Logger Middleware menggunakan Pino (JSON format & file streaming)
app.use('*', pinoLoggerMiddleware);

// CORS configuration
app.use(
  '*',
  cors({
    origin: env.CORS_ORIGIN,
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// Route Bindings
app.route('/', indexRoute);
app.route('/api/v1/auth', authRoute);
app.route('/api/v1/users', userRoute);
app.route('/api/v1/projects', projectRoute);

// Fase 3.30: Global Not Found Handler di app.notFound()
app.notFound((c) => {
  return errorResponse(
    c,
    `Route ${c.req.method} ${c.req.path} not found`,
    404,
    undefined,
    'NOT_FOUND'
  );
});

// Fase 3.28 & 3.29: Global Error Handler di app.onError() memformat error JSON standar (code, message)
app.onError((err, c) => {
  logger.error(
    {
      err,
      method: c.req.method,
      path: c.req.path,
    },
    `Unhandled error on ${c.req.method} ${c.req.path}: ${err.message}`
  );

  if (err instanceof AppHttpException) {
    return errorResponse(c, err.message, err.status, undefined, err.code || `HTTP_${err.status}`);
  }

  if (err instanceof HTTPException) {
    return errorResponse(c, err.message, err.status, (err as any).cause, `HTTP_${err.status}`);
  }

  return errorResponse(
    c,
    err.message || 'Internal Server Error',
    500,
    undefined,
    'INTERNAL_SERVER_ERROR'
  );
});

export default app;
export { app };
