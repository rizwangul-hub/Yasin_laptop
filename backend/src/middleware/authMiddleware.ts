import { Response, NextFunction } from 'express';
import { AuthenticatedRequest, UserRole } from '../types';
import { verifyToken } from '../utils/auth';
import { sendError } from '../utils/apiResponse';

export const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    sendError(res, 'Authorization token missing or invalid. Please login.', undefined, 401);
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    sendError(res, 'Invalid or expired authentication token', undefined, 401);
  }
};

export const authorize = (...roles: (UserRole | UserRole[])[]) => {
  const allowedRoles = roles.flat();

  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      sendError(res, 'Unauthorized request', undefined, 401);
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      sendError(res, 'Forbidden: You do not have permission to perform this action', undefined, 403);
      return;
    }

    next();
  };
};
