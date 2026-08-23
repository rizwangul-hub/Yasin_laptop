import { Request, Response } from 'express';
import { UseCase } from '../models/UseCase';
import { sendSuccess, sendError } from '../utils/apiResponse';
import { isDatabaseConnected } from '../config/database';

export const getUseCases = async (_req: Request, res: Response): Promise<void> => {
  if (!isDatabaseConnected()) {
    sendSuccess(res, 'Database offline; returning use cases shell', []);
    return;
  }

  const useCases = await UseCase.find({ isActive: true }).sort({ sortOrder: 1, name: 1 }).lean();
  sendSuccess(res, 'Use cases fetched successfully', useCases);
};

export const createUseCase = async (req: Request, res: Response): Promise<void> => {
  if (!isDatabaseConnected()) {
    sendError(res, 'Database offline', undefined, 503);
    return;
  }

  try {
    const data = req.body;
    if (!data.slug && data.name) {
      data.slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    }

    const useCase = new UseCase(data);
    await useCase.save();
    sendSuccess(res, 'Use Case created successfully', useCase, 201);
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Failed to create use case';
    sendError(res, msg, undefined, 400);
  }
};

export const updateUseCase = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  if (!isDatabaseConnected()) {
    sendError(res, 'Database offline', undefined, 503);
    return;
  }

  try {
    const useCase = await UseCase.findByIdAndUpdate(id, { $set: req.body }, { new: true, runValidators: true });
    if (!useCase) {
      sendError(res, 'Use case not found', undefined, 404);
      return;
    }
    sendSuccess(res, 'Use case updated successfully', useCase);
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Failed to update use case';
    sendError(res, msg, undefined, 400);
  }
};

export const deleteUseCase = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  if (!isDatabaseConnected()) {
    sendError(res, 'Database offline', undefined, 503);
    return;
  }

  const useCase = await UseCase.findByIdAndUpdate(id, { $set: { isActive: false } }, { new: true });
  if (!useCase) {
    sendError(res, 'Use case not found', undefined, 404);
    return;
  }
  sendSuccess(res, 'Use case archived successfully', { id });
};
