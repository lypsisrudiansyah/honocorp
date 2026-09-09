import { z } from 'zod';
import { getUserByEmail } from '../../services/user.service.js';

export const registerBaseSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters long' }).max(255),
  email: z.string().email({ message: 'Invalid email address format' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
  role: z.enum(['admin', 'manager', 'staff']).optional().default('staff'),
});

/**
 * Fase 3.25 & 3.27: Validasi skema Zod payload registrasi dengan refine ke DB untuk cek email unik
 */
export const registerSchema = registerBaseSchema.refine(
  async ({ email }) => {
    const existingUser = await getUserByEmail(email);
    return !existingUser;
  },
  {
    message: 'Email is already registered',
    path: ['email'],
  }
);

export type RegisterInput = z.infer<typeof registerBaseSchema>;
