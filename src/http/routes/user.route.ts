import { Hono } from 'hono';
import { getProfileHandler } from '../controllers/user.controller.js';

const userRoute = new Hono();

// Profile endpoint using separated controller
userRoute.get('/profile', getProfileHandler);

export { userRoute };
