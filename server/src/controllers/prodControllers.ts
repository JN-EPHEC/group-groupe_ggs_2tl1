import type { Request, Response, NextFunction } from "express";
import { allProduct, oneProduct } from "../services/prodServices.js";

export const getAllProduct = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await allProduct();

    return res.status(200).json(result);
  } catch (error) {
    if (error instanceof Error && error.message === "PRODUCTS_NOT_FOUND") {
      return res.status(400).json({ message: "Aucun produits trouvé" });
    }

    return next(error);
  }
};

export const getProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await oneProduct(Number(req.params.id));

    return res.status(200).json(product);
  } catch (error) {
    if (error instanceof Error && error.message === "PRODUCT_NOT_FOUND") {
      return res.status(400).json({ message: "Produit inconnu" });
    }

    return next(error);
  }
};
