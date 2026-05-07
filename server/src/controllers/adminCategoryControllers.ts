import type { NextFunction, Request, Response } from 'express';
import prisma from '../config/prisma.js';

const parsePositiveInt = (value: unknown) => {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    return null;
  }
  return parsed;
};

export const getAdminCategories = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await prisma.categories.findMany({
      orderBy: { id: 'asc' },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    return res.status(200).json({
      data: categories.map((category) => ({
        id: category.id,
        nom: category.name,
        produits_count: category._count.products,
      })),
    });
  } catch (error) {
    return next(error);
  }
};

export const createAdminCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const nom = typeof req.body?.nom === 'string' ? req.body.nom.trim() : '';

    if (!nom || nom.length > 100) {
      return res.status(400).json({ message: 'Le nom de categorie est requis (max 100 caracteres).' });
    }

    const existing = await prisma.categories.findUnique({
      where: { name: nom },
      select: { id: true },
    });

    if (existing) {
      return res.status(409).json({ message: 'Cette categorie existe deja.' });
    }

    const category = await prisma.categories.create({
      data: { name: nom },
      select: { id: true, name: true },
    });

    return res.status(201).json({
      message: 'Categorie creee avec succes.',
      categorie: {
        id: category.id,
        nom: category.name,
      },
    });
  } catch (error) {
    return next(error);
  }
};

export const updateAdminCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categoryId = parsePositiveInt(req.params.id);
    const nom = typeof req.body?.nom === 'string' ? req.body.nom.trim() : '';

    if (!categoryId) {
      return res.status(400).json({ message: 'ID categorie invalide.' });
    }

    if (!nom || nom.length > 100) {
      return res.status(400).json({ message: 'Le nom de categorie est requis (max 100 caracteres).' });
    }

    const existingCategory = await prisma.categories.findUnique({
      where: { id: categoryId },
      select: { id: true },
    });

    if (!existingCategory) {
      return res.status(404).json({ message: 'Categorie introuvable.' });
    }

    const duplicate = await prisma.categories.findFirst({
      where: {
        name: nom,
        NOT: { id: categoryId },
      },
      select: { id: true },
    });

    if (duplicate) {
      return res.status(409).json({ message: 'Cette categorie existe deja.' });
    }

    const updated = await prisma.categories.update({
      where: { id: categoryId },
      data: { name: nom },
      select: { id: true, name: true },
    });

    return res.status(200).json({
      message: 'Categorie modifiee avec succes.',
      categorie: {
        id: updated.id,
        nom: updated.name,
      },
    });
  } catch (error) {
    return next(error);
  }
};

export const deleteAdminCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categoryId = parsePositiveInt(req.params.id);

    if (!categoryId) {
      return res.status(400).json({ message: 'ID categorie invalide.' });
    }

    const category = await prisma.categories.findUnique({
      where: { id: categoryId },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    if (!category) {
      return res.status(404).json({ message: 'Categorie introuvable.' });
    }

    if (category._count.products > 0) {
      return res.status(409).json({ message: 'Suppression interdite: des produits sont encore lies a cette categorie.' });
    }

    await prisma.categories.delete({
      where: { id: categoryId },
    });

    return res.status(200).json({ message: 'Categorie supprimee avec succes.' });
  } catch (error) {
    return next(error);
  }
};
