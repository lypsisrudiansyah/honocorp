import type { Context } from 'hono';
import bcrypt from 'bcryptjs';
import { createUser } from '../../services/user.service.js';
import { successResponse } from '../../utils/response.util.js';
import type { RegisterInput } from '../validations/auth.validation.js';

/**
 * Handler for user registration
 */
export const registerHandler = async (c: Context) => {
  const body = (await c.req.json()) as RegisterInput;
  const hashedPassword = await bcrypt.hash(body.password, 10);

  const newUser = await createUser({
    name: body.name,
    email: body.email.toLowerCase(),
    password: hashedPassword,
    role: body.role ?? 'staff',
  });

  return successResponse(c, newUser, 'User registered successfully', 201);
};
