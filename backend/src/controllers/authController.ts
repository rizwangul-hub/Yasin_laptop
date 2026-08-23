import { Request, Response } from 'express';
import { User } from '../models/User';
import { comparePassword, hashPassword, generateToken } from '../utils/auth';
import { sendSuccess, sendError } from '../utils/apiResponse';
import { AuthenticatedRequest } from '../types';

export const loginAdmin = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+passwordHash');
  if (!user || !user.isActive) {
    sendError(res, 'Invalid email or password credentials', undefined, 401);
    return;
  }

  const isPasswordValid = await comparePassword(password, user.passwordHash);
  if (!isPasswordValid) {
    sendError(res, 'Invalid email or password credentials', undefined, 401);
    return;
  }

  user.lastLogin = new Date();
  await user.save();

  const token = generateToken({
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  });

  sendSuccess(res, 'Admin authentication successful', {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};

export const getMe = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    sendError(res, 'Unauthenticated', undefined, 401);
    return;
  }

  const user = await User.findById(req.user.userId);
  if (!user || !user.isActive) {
    sendError(res, 'User account not found or inactive', undefined, 404);
    return;
  }

  sendSuccess(res, 'Authenticated user profile fetched', user);
};

export const changePassword = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    sendError(res, 'Unauthenticated', undefined, 401);
    return;
  }

  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword || newPassword.length < 8) {
    sendError(res, 'New password must be at least 8 characters long', undefined, 400);
    return;
  }

  const user = await User.findById(req.user.userId).select('+passwordHash');
  if (!user) {
    sendError(res, 'User account not found', undefined, 404);
    return;
  }

  const isMatch = await comparePassword(currentPassword, user.passwordHash);
  if (!isMatch) {
    sendError(res, 'Current password is incorrect', undefined, 400);
    return;
  }

  user.passwordHash = await hashPassword(newPassword);
  await user.save();

  sendSuccess(res, 'Password changed successfully', { success: true });
};

export const logoutAdmin = async (_req: Request, res: Response): Promise<void> => {
  sendSuccess(res, 'Logged out successfully', { success: true });
};
