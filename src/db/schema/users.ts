import { mysqlTable, int, varchar, mysqlEnum, timestamp } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';
import { projects, projectMembers } from './projects.js';

export const users = mysqlTable('users', {
  id: int('id').autoincrement().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  role: mysqlEnum('role', ['admin', 'manager', 'staff']).default('staff').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  ownedProjects: many(projects),
  projectMemberships: many(projectMembers),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

