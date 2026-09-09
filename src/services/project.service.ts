import { eq } from 'drizzle-orm';
import { db } from '../config/db.js';
import {
  projects,
  projectMembers,
  type NewProject,
} from '../db/schema/projects.js';

export interface AssignMemberInput {
  userId: number;
  role?: 'manager' | 'member' | 'viewer';
}

export interface CreateProjectWithMembersInput {
  name: string;
  description?: string | null;
  ownerId: number;
  status?: 'planned' | 'in_progress' | 'completed' | 'on_hold';
  members?: AssignMemberInput[];
}

/**
 * Fase 2.22: Bungkus logika pembuatan proyek dan penugasan anggota di dalam db.transaction()
 */
export const createProjectWithMembers = async (input: CreateProjectWithMembersInput) => {
  return await db.transaction(async (tx) => {
    // 1. Insert project
    const [projectResult] = await tx.insert(projects).values({
      name: input.name,
      description: input.description,
      ownerId: input.ownerId,
      status: input.status ?? 'planned',
    });

    const projectId = projectResult.insertId;

    // 2. Assign members within the same transaction if provided
    if (input.members && input.members.length > 0) {
      const membersToInsert = input.members.map((member) => ({
        projectId,
        userId: member.userId,
        role: member.role ?? ('member' as const),
      }));

      await tx.insert(projectMembers).values(membersToInsert);
    }

    // 3. Return the created project with nested relations
    const createdProject = await tx.query.projects.findFirst({
      where: eq(projects.id, projectId),
      with: {
        owner: {
          columns: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        members: {
          with: {
            user: {
              columns: {
                id: true,
                name: true,
                email: true,
                role: true,
              },
            },
          },
        },
      },
    });

    return createdProject;
  });
};

/**
 * Fase 2.21: Praktikkan Nested Query Drizzle untuk mengambil Proyek beserta nama anggotanya
 */
export const getProjectsWithMembers = async () => {
  return await db.query.projects.findMany({
    with: {
      owner: {
        columns: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      members: {
        with: {
          user: {
            columns: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
      },
    },
  });
};

/**
 * Fase 2.21: Nested Query untuk mengambil detail proyek tunggal dengan anggota
 */
export const getProjectByIdWithMembers = async (id: number) => {
  return await db.query.projects.findFirst({
    where: eq(projects.id, id),
    with: {
      owner: {
        columns: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      members: {
        with: {
          user: {
            columns: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
      },
    },
  });
};
