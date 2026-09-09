import { eq, count } from 'drizzle-orm';
import { db } from '../config/db.js';
import { users, type User, type NewUser } from '../db/schema/users.js';

export interface UserListParams {
  limit?: number;
  offset?: number;
}

/**
 * Service CRUD: Insert user baru menggunakan db.insert().values()
 */
export const createUser = async (data: NewUser) => {
  const [result] = await db.insert(users).values(data);
  return {
    id: result.insertId,
    name: data.name,
    email: data.email,
    role: data.role ?? 'staff',
  };
};

/**
 * Service pembacaan data: Ambil daftar user menggunakan db.select().from()
 */
export const getUsers = async (params?: UserListParams) => {
  const query = db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    })
    .from(users);

  if (params?.limit !== undefined && params?.offset !== undefined) {
    return await query.limit(params.limit).offset(params.offset);
  }

  return await query;
};

/**
 * Get total users count for pagination calculations
 */
export const countUsers = async (): Promise<number> => {
  const [res] = await db.select({ total: count() }).from(users);
  return Number(res?.total ?? 0);
};

/**
 * Read single user by ID using db.select().from().where()
 */
export const getUserById = async (id: number) => {
  const [user] = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    })
    .from(users)
    .where(eq(users.id, id));

  return user ?? null;
};

/**
 * Read single user by email for lookup and validation
 */
export const getUserByEmail = async (email: string): Promise<User | null> => {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email));

  return user ?? null;
};

/**
 * Update user by ID
 */
export const updateUser = async (id: number, data: Partial<Omit<NewUser, 'id'>>) => {
  await db.update(users).set(data).where(eq(users.id, id));
  return getUserById(id);
};

/**
 * Delete user by ID
 */
export const deleteUser = async (id: number): Promise<boolean> => {
  const [result] = await db.delete(users).where(eq(users.id, id));
  return result.affectedRows > 0;
};
