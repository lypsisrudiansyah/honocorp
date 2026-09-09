import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { registerSchema } from '../validations/auth.validation.js';
import { registerHandler } from '../controllers/auth.controller.js';
import { errorResponse } from '../../utils/response.util.js';

const authRoute = new Hono();

/**
 * Fase 3.26: Pasang middleware zValidator pada rute POST /register
 */
authRoute.post(
  '/register',
  zValidator('json', registerSchema, (result, c) => {
    if (!result.success) {
      return errorResponse(
        c,
        'Validation failed',
        422,
        result.error.issues,
        'VALIDATION_ERROR'
      );
    }
  }),
  registerHandler
);

export { authRoute };
