import type { Context } from 'hono';
import type { ContentfulStatusCode } from 'hono/utils/http-status';

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  meta?: Record<string, unknown>;
  code?: string;
  errors?: unknown;
}

export const successResponse = <T>(
  c: Context,
  data: T,
  message: string = 'Success',
  status: ContentfulStatusCode = 200,
  meta?: Record<string, unknown>
) => {
  const payload: ApiResponse<T> = {
    success: true,
    message,
    data,
    ...(meta ? { meta } : {}),
  };
  return c.json(payload, status);
};

export const errorResponse = (
  c: Context,
  message: string = 'Internal Server Error',
  status: ContentfulStatusCode = 500,
  errors?: unknown,
  code?: string
) => {
  const payload: ApiResponse = {
    success: false,
    message,
    ...(code ? { code } : {}),
    ...(errors !== undefined ? { errors } : {}),
  };
  return c.json(payload, status);
};
