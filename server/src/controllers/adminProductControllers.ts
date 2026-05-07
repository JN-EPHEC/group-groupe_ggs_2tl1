import type { NextFunction, Request, Response } from 'express';
import prisma from '../config/prisma.js';

type StockLevel = 'rupture' | 'faible' | 'ok';

const getStockLevel = (stock: number): StockLevel => {
  if (stock === 0) return 'rupture';
  if (stock <= 5) return 'faible';
  return 'ok';
};

const parsePositiveInt = (value: unknown) => {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    return null;
  }
  return parsed;
};

export const getAdminProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sort = typeof req.query.sort === 'string' ? req.query.sort : '';

    const orderBy =
      sort === 'stock_asc'
        ? [{ stock: 'asc' as const }, { id: 'asc' as const }]
        : sort === 'stock_desc'
          ? [{ stock: 'desc' as const }, { id: 'asc' as const }]
          : [{ id: 'asc' as const }];

    const products = await prisma.products.findMany({
      orderBy,
      select: {
        id: true,
        name: true,
        stock: true,
        price: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return res.status(200).json({
      data: products.map((product) => ({
        id: product.id,
        nom: product.name,
        prix: product.price,
        quantite: product.stock,
        categorie: product.category,
        niveau_stock: getStockLevel(product.stock),
        alerte_stock: product.stock <= 5,
      })),
      meta: {
        total: products.length,
      },
    });
  } catch (error) {
    return next(error);
  }
};

export const updateAdminProductStock = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productId = parsePositiveInt(req.params.id);
    const quantity = Number(req.body?.quantite);

    if (!productId) {
      return res.status(400).json({ message: 'ID produit invalide.' });
    }

    if (!Number.isInteger(quantity) || quantity < 0) {
      return res.status(400).json({ message: 'La quantite doit etre un entier superieur ou egal a 0.' });
    }

    const existingProduct = await prisma.products.findUnique({
      where: { id: productId },
      select: {
        id: true,
        stock: true,
        name: true,
      },
    });

    if (!existingProduct) {
      return res.status(404).json({ message: 'Produit introuvable.' });
    }

    const updatedProduct = await prisma.products.update({
      where: { id: productId },
      data: { stock: quantity },
      select: {
        id: true,
        name: true,
        stock: true,
      },
    });

    return res.status(200).json({
      message: 'Stock produit mis a jour avec succes.',
      produit: {
        id: updatedProduct.id,
        nom: updatedProduct.name,
        quantite_precedente: existingProduct.stock,
        quantite: updatedProduct.stock,
        niveau_stock: getStockLevel(updatedProduct.stock),
        alerte_stock: updatedProduct.stock <= 5,
      },
    });
  } catch (error) {
    return next(error);
  }
};

const isValidUrl = (value: string) => {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch (_error) {
    return false;
  }
};

export const updateAdminProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productId = parsePositiveInt(req.params.id);

    if (!productId) {
      return res.status(400).json({ message: 'ID produit invalide.' });
    }

    const nom = typeof req.body?.nom === 'string' ? req.body.nom.trim() : '';
    const description =
      req.body?.description === undefined || req.body?.description === null
        ? ''
        : String(req.body.description);
    const prix = Number(req.body?.prix);
    const quantite = Number(req.body?.quantite);
    const imageUrl = typeof req.body?.image_url === 'string' ? req.body.image_url.trim() : '';
    const categorieId = Number(req.body?.categorie_id);

    if (!nom || nom.length > 255) {
      return res.status(400).json({ message: 'Le nom est requis (max 255 caracteres).' });
    }

    if (!Number.isFinite(prix) || prix < 0) {
      return res.status(400).json({ message: 'Le prix doit etre un nombre superieur ou egal a 0.' });
    }

    if (description.length > 2000) {
      return res.status(400).json({ message: 'La description ne peut pas depasser 2000 caracteres.' });
    }

    if (!isValidUrl(imageUrl)) {
      return res.status(400).json({ message: "L'URL de l'image est invalide." });
    }

    if (!Number.isInteger(quantite) || quantite < 0) {
      return res.status(400).json({ message: 'La quantite doit etre un entier superieur ou egal a 0.' });
    }

    if (!Number.isInteger(categorieId) || categorieId <= 0) {
      return res.status(400).json({ message: 'ID categorie invalide.' });
    }

    const [existingProduct, existingCategory] = await Promise.all([
      prisma.products.findUnique({
        where: { id: productId },
        select: { id: true },
      }),
      prisma.categories.findUnique({
        where: { id: categorieId },
        select: { id: true, name: true },
      }),
    ]);

    if (!existingProduct) {
      return res.status(404).json({ message: 'Produit introuvable.' });
    }

    if (!existingCategory) {
      return res.status(404).json({ message: 'Categorie introuvable.' });
    }

    const updatedProduct = await prisma.products.update({
      where: { id: productId },
      data: {
        name: nom,
        description,
        price: prix,
        stock: quantite,
        category_id: categorieId,
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        stock: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return res.status(200).json({
      message: 'Produit mis a jour avec succes.',
      produit: {
        id: updatedProduct.id,
        nom: updatedProduct.name,
        description: updatedProduct.description,
        prix: updatedProduct.price,
        quantite: updatedProduct.stock,
        image_url: imageUrl,
        categorie: updatedProduct.category,
      },
    });
  } catch (error) {
    return next(error);
  }
};
