import type { Request, Response, NextFunction } from 'express';
import type { Prisma } from '@prisma/client';
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
    const categoryId = parsePositiveInt(req.query.categorie_id, 0);
    const minPrice = Number(req.query.prix_min);
    const maxPrice = Number(req.query.prix_max);

    if (Number.isFinite(minPrice) && minPrice < 0) {
      return res.status(400).json({ message: 'prix_min doit etre superieur ou egal a 0.' });
    }

    if (Number.isFinite(maxPrice) && maxPrice < 0) {
      return res.status(400).json({ message: 'prix_max doit etre superieur ou egal a 0.' });
    }

    if (Number.isFinite(minPrice) && Number.isFinite(maxPrice) && maxPrice < minPrice) {
      return res.status(400).json({ message: 'prix_max doit etre superieur ou egal a prix_min.' });
    }

    const where: Prisma.ProductsWhereInput = {};

    if (categoryId > 0) {
      where.category_id = categoryId;
    }

    if (Number.isFinite(minPrice) || Number.isFinite(maxPrice)) {
      where.price = {};

      if (Number.isFinite(minPrice)) {
        where.price.gte = minPrice;
      }

      if (Number.isFinite(maxPrice)) {
        where.price.lte = maxPrice;
      }
    }

    const products = await prisma.products.findMany({
      where,
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
