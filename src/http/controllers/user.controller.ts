import type { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import {
  createUser,
  getUsers,
  getUserById,
  countUsers,
} from '../../services/user.service.js';
import { parsePagination, createPaginationMeta } from '../../utils/pagination.util.js';
import { successResponse } from '../../utils/response.util.js';
import type { NewUser } from '../../db/schema/users.js';

/**
 * Fase 2.18 & Fase 3.33: Ambil daftar user dengan paginasi MySQL limit & offset
 */
export const getUsersHandler = async (c: Context) => {
  const query = c.req.query();
  const { page, limit, offset } = parsePagination(query);

  const [usersList, totalItems] = await Promise.all([
    getUsers({ limit, offset }),
    countUsers(),
  ]);

  const paginationMeta = createPaginationMeta(totalItems, page, limit);

  return successResponse(
    c,
    usersList,
    'Users fetched successfully',
    200,
    { pagination: paginationMeta }
  );
};

/**
 * Fase 3.29: Implementasi pelemparan error HTTP kustom HTTPException(404, ...)
 */
export const getUserByIdHandler = async (c: Context) => {
  const id = Number(c.req.param('id'));
  if (isNaN(id) || id <= 0) {
    throw new HTTPException(400, { message: 'Invalid user ID parameter' });
  }

  const user = await getUserById(id);
  if (!user) {
    // Fase 3.29: Pelemparan error HTTP kustom
    throw new HTTPException(404, { message: 'User not found' });
  }

  return successResponse(c, user, 'User details retrieved successfully');
};

/**
 * Fase 2.17: Insert user baru menggunakan db.insert().values()
 */
export const createUserHandler = async (c: Context) => {
  const body = (await c.req.json()) as NewUser;
  const created = await createUser(body);
  return successResponse(c, created, 'User created successfully', 201);
};

/**
 * Rute profil pengguna
 */
export const getProfileHandler = async (c: Context) => {
  const profile = {
    id: 1,
    name: 'Honocorp Admin',
    email: 'admin@honocorp.local',
    role: 'admin',
    createdAt: new Date().toISOString(),
  };

  return successResponse(c, profile, 'User profile fetched successfully');
};
