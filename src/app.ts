import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';
import { indexRoute } from './http/routes/index.route.js';
import { userRoute } from './http/routes/user.route.js';
import { errorResponse } from './utils/response.util.js';
import { env } from './config/env.js';

const app = new Hono();

// Global Middlewares
app.use('*', logger());
app.use(
  '*',
  cors({
    origin: env.CORS_ORIGIN,
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// Routes
app.route('/', indexRoute);
app.route('/api/v1/users', userRoute);

// Global 404 Not Found Handler
app.notFound((c) => {
  return errorResponse(c, `Route ${c.req.method} ${c.req.path} not found`, 404);
});

// Global Error Handler
app.onError((err, c) => {
  console.error('Unhandled Application Error:', err);
  return errorResponse(c, err.message || 'Internal Server Error', 500);
});

export default app;
export { app };
