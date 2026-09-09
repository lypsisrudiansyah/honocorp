import { HTTPException } from 'hono/http-exception';
import type { ContentfulStatusCode } from 'hono/utils/http-status';

export class AppHttpException extends HTTPException {
  public code?: string;

  constructor(status: ContentfulStatusCode, message: string, code?: string) {
    super(status, { message });
    this.code = code;
  }
}

export const notFoundError = (message: string = 'Resource not found', code: string = 'NOT_FOUND') => {
  return new AppHttpException(404, message, code);
};

export const badRequestError = (message: string = 'Bad request', code: string = 'BAD_REQUEST') => {
  return new AppHttpException(400, message, code);
};

export const conflictError = (message: string = 'Resource already exists', code: string = 'CONFLICT') => {
  return new AppHttpException(409, message, code);
};

export const unauthorizedError = (message: string = 'Unauthorized', code: string = 'UNAUTHORIZED') => {
  return new AppHttpException(401, message, code);
};

export const forbiddenError = (message: string = 'Forbidden', code: string = 'FORBIDDEN') => {
  return new AppHttpException(403, message, code);
};
