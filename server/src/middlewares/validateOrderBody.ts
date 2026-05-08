import type { Request, Response, NextFunction } from "express";

export const validateOrderBody = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const rawItems = req.body?.items;

  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    return res.status(400).json({ message: "La commande doit contenir au moins un item" });
  }

  const invalidItem = rawItems.find((item: unknown) => {
    const candidate = item as { product_id?: unknown; quantity?: unknown };
    const productId = Number(candidate.product_id);
    const quantity = Number(candidate.quantity);

    return (
      !Number.isInteger(productId) ||
      productId <= 0 ||
      !Number.isInteger(quantity) ||
      quantity <= 0
    );
  });

  if (invalidItem) {
    return res.status(400).json({ message: "Items invalides: product_id et quantity (> 0) sont requis" });
  }

  next();
};

export default validateOrderBody;
