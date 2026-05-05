import type { Request, Response, NextFunction } from 'express';
import prisma from '../config/prisma.js';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 12;
const MAX_LIMIT = 12;

const parsePositiveInt = (value: unknown, fallback: number) => {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    return fallback;
  }
  return parsed;
};

export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parsePositiveInt(req.query.page, DEFAULT_PAGE);
    const requestedLimit = parsePositiveInt(req.query.limit, DEFAULT_LIMIT);
    const limit = Math.min(requestedLimit, MAX_LIMIT);
    const skip = (page - 1) * limit;

    const products = await prisma.products.findMany({
      skip,
      take: limit,
      orderBy: {
        id: 'asc',
      },
      include: {
        category: {
          select: {
            name: true,
          },
        },
      },
    });

    const response = products.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category.name,
      category_id: product.category_id,
    }));

    return res.status(200).json(response);
  } catch (error) {
    return next(error);
  }
};

export const getProductById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ message: 'ID produit invalide.' });
    }

    const product = await prisma.products.findUnique({
      where: { id },
      include: {
        category: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!product) {
      return res.status(404).json({ message: 'Produit introuvable.' });
    }

    return res.status(200).json({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category.name,
      category_id: product.category_id,
    });
  } catch (error) {
    return next(error);
  }
};
