import { Hono } from 'hono';
import { successResponse } from '../../utils/response.util.js';

const indexRoute = new Hono();

// Welcome endpoint
indexRoute.get('/', (c) => {
  return successResponse(
    c,
    {
      service: 'honocorp-backend',
      version: '1.0.0',
      status: 'operational',
    },
    'Welcome to Honocorp Backend API'
  );
});

// Health check endpoint
indexRoute.get('/health', (c) => {
  return successResponse(
    c,
    {
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      nodeVersion: process.version,
    },
    'Health check passed'
  );
});

export { indexRoute };
