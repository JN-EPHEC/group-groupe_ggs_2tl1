import type { Request, Response, NextFunction } from 'express';
import prisma from '../config/prisma.js';

export const getAllCategories = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await prisma.categories.findMany({
      orderBy: {
        name: 'asc',
      },
      select: {
        id: true,
        name: true,
      },
    });

    return res.status(200).json(categories);
  } catch (error) {
    return next(error);
  }
};
