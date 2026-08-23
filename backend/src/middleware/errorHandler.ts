import { ErrorRequestHandler } from 'express';
import { sendError } from '../utils/apiResponse';
import { logger } from '../utils/logger';
import { ENV } from '../config/env';

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  logger.error('Unhandled Application Error:', err.name || 'Error', err.message);

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let details: Record<string, unknown> | undefined = undefined;

  // Handle Mongoose CastError (e.g. invalid ObjectId format)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid format for field '${err.path}': ${err.value}`;
  }

  // Handle Mongoose Duplicate Key Error (E11000)
  if (err.code === 11000) {
    statusCode = 409;
    const duplicatedField = Object.keys(err.keyValue || {})[0] || 'field';
    const duplicatedValue = err.keyValue?.[duplicatedField];
    message = `Duplicate value '${duplicatedValue}' for field '${duplicatedField}'. Must be unique.`;
  }

  // Handle Mongoose Validation Error
  if (err.name === 'ValidationError' && err.errors) {
    statusCode = 422;
    message = 'Database validation failed';
    details = Object.keys(err.errors).reduce((acc, key) => {
      acc[key] = err.errors[key].message;
      return acc;
    }, {} as Record<string, string>);
  }

  // Handle JWT Errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid authentication token';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Authentication token has expired';
  }

  const errorResponseDetails = ENV.NODE_ENV === 'production'
    ? (details ? { details } : undefined)
    : {
        details,
        stack: err.stack,
      };

  sendError(res, message, errorResponseDetails, statusCode);
};
