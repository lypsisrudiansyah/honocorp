import { mysqlTable, int, varchar, text, mysqlEnum, timestamp } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';
import { users } from './users.js';

export const projects = mysqlTable('projects', {
  id: int('id').autoincrement().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  ownerId: int('owner_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  status: mysqlEnum('status', ['planned', 'in_progress', 'completed', 'on_hold']).default('planned').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});

export const projectMembers = mysqlTable('project_members', {
  id: int('id').autoincrement().primaryKey(),
  projectId: int('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  userId: int('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  role: mysqlEnum('role', ['manager', 'member', 'viewer']).default('member').notNull(),
  joinedAt: timestamp('joined_at').defaultNow().notNull(),
});

export const projectsRelations = relations(projects, ({ one, many }) => ({
  owner: one(users, {
    fields: [projects.ownerId],
    references: [users.id],
  }),
  members: many(projectMembers),
}));

export const projectMembersRelations = relations(projectMembers, ({ one }) => ({
  project: one(projects, {
    fields: [projectMembers.projectId],
    references: [projects.id],
  }),
  user: one(users, {
    fields: [projectMembers.userId],
    references: [users.id],
  }),
}));

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
export type ProjectMember = typeof projectMembers.$inferSelect;
export type NewProjectMember = typeof projectMembers.$inferInsert;
