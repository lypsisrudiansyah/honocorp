import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import {
  createProjectHandler,
  getProjectsHandler,
  getProjectByIdHandler,
} from '../controllers/project.controller.js';
import { createProjectSchema } from '../validations/project.validation.js';
import { errorResponse } from '../../utils/response.util.js';

const projectRoute = new Hono();

// GET all projects with members (Nested Query Drizzle)
projectRoute.get('/', getProjectsHandler);

// POST create project with members inside db.transaction()
projectRoute.post(
  '/',
  zValidator('json', createProjectSchema, (result, c) => {
    if (!result.success) {
      return errorResponse(
        c,
        'Project validation failed',
        422,
        result.error.issues,
        'VALIDATION_ERROR'
      );
    }
  }),
  createProjectHandler
);

// GET single project by id with members
projectRoute.get('/:id', getProjectByIdHandler);

export { projectRoute };
