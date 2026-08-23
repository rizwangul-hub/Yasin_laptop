import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env';
import { AuthUserPayload } from '../types';

const SALT_ROUNDS = 10;

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

export const generateToken = (payload: AuthUserPayload): string => {
  return jwt.sign(payload, ENV.JWT_SECRET, {
    expiresIn: (ENV.JWT_EXPIRES_IN || '7d') as jwt.SignOptions['expiresIn'],
  });
};

export const verifyToken = (token: string): AuthUserPayload => {
  return jwt.verify(token, ENV.JWT_SECRET) as AuthUserPayload;
};
