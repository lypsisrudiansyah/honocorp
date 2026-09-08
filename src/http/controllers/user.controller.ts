import type { Context } from 'hono';
import { successResponse } from '../../utils/response.util.js';

export const getProfileHandler = async (c: Context) => {
  // Mock/sample profile data showcasing Context handling and controller separation
  const profile = {
    id: 1,
    name: 'Honocorp Admin',
    email: 'admin@honocorp.local',
    role: 'admin',
    createdAt: new Date().toISOString(),
  };

  return successResponse(c, profile, 'User profile fetched successfully');
};
