import type { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import {
  createProjectWithMembers,
  getProjectsWithMembers,
  getProjectByIdWithMembers,
} from '../../services/project.service.js';
import { successResponse } from '../../utils/response.util.js';
import type { CreateProjectSchemaInput } from '../validations/project.validation.js';

/**
 * Fase 2.22: Handler untuk pembuatan proyek dan penugasan anggota di dalam db.transaction()
 */
export const createProjectHandler = async (c: Context) => {
  const body = (await c.req.json()) as CreateProjectSchemaInput;

  const project = await createProjectWithMembers({
    name: body.name,
    description: body.description,
    ownerId: body.ownerId,
    status: body.status,
    members: body.members,
  });

  return successResponse(c, project, 'Project created and members assigned successfully', 201);
};

/**
 * Fase 2.21: Handler mengambil Proyek beserta nama anggotanya menggunakan Nested Query Drizzle
 */
export const getProjectsHandler = async (c: Context) => {
  const projectsList = await getProjectsWithMembers();
  return successResponse(c, projectsList, 'Projects with members retrieved successfully');
};

/**
 * Fase 2.21 & 3.29: Handler mengambil satu Proyek dengan anggota (Nested Query) atau 404
 */
export const getProjectByIdHandler = async (c: Context) => {
  const id = Number(c.req.param('id'));
  if (isNaN(id) || id <= 0) {
    throw new HTTPException(400, { message: 'Invalid project ID parameter' });
  }

  const project = await getProjectByIdWithMembers(id);
  if (!project) {
    throw new HTTPException(404, { message: 'Project not found' });
  }

  return successResponse(c, project, 'Project details retrieved successfully');
};
