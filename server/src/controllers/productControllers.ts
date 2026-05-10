import type { Request, Response, NextFunction } from "express";
import { getCatalogProductById, getProductsCatalog } from "../services/productCatalogServices.js";

export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await getProductsCatalog(req.query);

    return res.status(200).json(products);
  } catch (error) {
    if (error instanceof Error && error.message === "MIN_PRICE_INVALID") {
      return res.status(400).json({ message: "prix_min doit etre superieur ou egal a 0." });
    }

    if (error instanceof Error && error.message === "MAX_PRICE_INVALID") {
      return res.status(400).json({ message: "prix_max doit etre superieur ou egal a 0." });
    }

    if (error instanceof Error && error.message === "PRICE_RANGE_INVALID") {
      return res.status(400).json({ message: "prix_max doit etre superieur ou egal a prix_min." });
    }

    if (error instanceof Error && error.message === "SORT_INVALID") {
      return res.status(400).json({ message: "sort invalide." });
    }

    return next(error);
  }
};

export const getProductById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await getCatalogProductById(Number(req.params.id));

    return res.status(200).json(product);
  } catch (error) {
    if (error instanceof Error && error.message === "PRODUCT_NOT_FOUND") {
      return res.status(404).json({ message: "Produit introuvable." });
    }

    return next(error);
  }
};
