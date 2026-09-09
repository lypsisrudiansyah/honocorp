import { z } from 'zod';

export const createProjectSchema = z.object({
  name: z.string().min(3, { message: 'Project name must be at least 3 characters long' }).max(255),
  description: z.string().max(1000).optional(),
  ownerId: z.number().int().positive({ message: 'ownerId must be a positive integer' }),
  status: z.enum(['planned', 'in_progress', 'completed', 'on_hold']).optional().default('planned'),
  members: z
    .array(
      z.object({
        userId: z.number().int().positive({ message: 'userId must be a positive integer' }),
        role: z.enum(['manager', 'member', 'viewer']).optional().default('member'),
      })
    )
    .optional(),
});

export type CreateProjectSchemaInput = z.infer<typeof createProjectSchema>;
