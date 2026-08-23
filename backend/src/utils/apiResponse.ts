import { Response } from 'express';
import { ApiResponse } from '../types';

export const sendSuccess = <T>(
  res: Response,
  message: string,
  data?: T,
  statusCode = 200
): Response => {
  const responseBody: ApiResponse<T> = {
    success: true,
    message,
    data,
  };
  return res.status(statusCode).json(responseBody);
};

export const sendError = (
  res: Response,
  message: string,
  error?: string | Record<string, unknown>,
  statusCode = 400
): Response => {
  const responseBody: ApiResponse = {
    success: false,
    message,
    error,
  };
  return res.status(statusCode).json(responseBody);
};
