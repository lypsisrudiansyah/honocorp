import { Hono } from 'hono';
import {
  getUsersHandler,
  getUserByIdHandler,
  createUserHandler,
  getProfileHandler,
} from '../controllers/user.controller.js';

const userRoute = new Hono();

// Profile endpoint
userRoute.get('/profile', getProfileHandler);

// CRUD endpoints: list, create, get by id
userRoute.get('/', getUsersHandler);
userRoute.post('/', createUserHandler);
userRoute.get('/:id', getUserByIdHandler);

export { userRoute };
