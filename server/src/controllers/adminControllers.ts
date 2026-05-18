import type { Request, Response, NextFunction } from "express";
import {
  createAdminUser,
  createCategoryAdmin,
  createProductAdmin,
  anonymizeUserAdmin,
  deleteProductAdmin,
  getProductAdmin,
  getUserAdmin,
  listProductsAdmin,
  listUsersAdmin,
  updateProductAdmin,
  updateProductStockAdmin,
  updateUserAdmin,
} from "../services/adminServices.js";

const handleAdminError = (error: unknown, res: Response) => {
  if (error instanceof Error && error.message === "PRODUCT_NOT_FOUND") {
    return res.status(404).json({ message: "le produit n'existe pas ou plus" });
  }

  if (error instanceof Error && error.message === "USER_NOT_FOUND") {
    return res.status(404).json({ message: "Utilisateur introuvable" });
  }

  if (error instanceof Error && error.message === "NO_USER_DATA") {
    return res.status(400).json({ message: "Aucune donnée à modifier" });
  }

  if (error instanceof Error && error.message === "ADMIN_ROLE_NOT_FOUND") {
    return res.status(500).json({ message: "Le rôle admin n'existe pas" });
  }

  if (error instanceof Error && error.message === "USER_NOT_ADMIN") {
    return res.status(403).json({ message: "Cet utilisateur n'est pas un admin" });
  }

  if (error instanceof Error && error.message === "CANNOT_DELETE_SELF") {
    return res.status(403).json({ message: "Vous ne pouvez pas supprimer votre propre compte" });
  }

  if (error instanceof Error && error.message === "USER_ALREADY_ANONYMIZED") {
    return res.status(409).json({ message: "Cet utilisateur est déjà anonymisé" });
  }

  if (error instanceof Error && error.message === "INVALID_STOCK") {
    return res.status(400).json({ message: "La quantité doit être un entier supérieur ou égal à 0" });
  }

  if (error instanceof Error && error.message === "INVALID_PRODUCT_NAME") {
    return res.status(400).json({ message: "Nom de produit invalide" });
  }

  if (error instanceof Error && error.message === "INVALID_PRODUCT_DESCRIPTION") {
    return res.status(400).json({ message: "Description trop longue (max 2000 caractères)" });
  }

  if (error instanceof Error && error.message === "INVALID_PRODUCT_PRICE") {
    return res.status(400).json({ message: "Prix invalide" });
  }

  if (error instanceof Error && error.message === "INVALID_PRODUCT_CATEGORY") {
    return res.status(400).json({ message: "Catégorie invalide" });
  }

  if (error instanceof Error && error.message === "CATEGORY_NOT_FOUND") {
    return res.status(404).json({ message: "Catégorie introuvable" });
  }

  if (error instanceof Error && error.message === "NO_PRODUCT_DATA") {
    return res.status(400).json({ message: "Aucune donnée de produit à modifier" });
  }

  return null;
};

export const getProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await getProductAdmin(Number(req.params.id));
    return res.status(200).json(product);
  } catch (error) {
    const handled = handleAdminError(error, res);
    if (handled) return handled;
    return next(error);
  }
};

export const listProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sort = typeof req.query.sort === "string" ? req.query.sort : undefined;
    const products = await listProductsAdmin({ sort });

    return res.status(200).json(products);
  } catch (error) {
    return next(error);
  }
};

export const updateProductStock = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await updateProductStockAdmin(
      Number(req.params.id),
      req.body.quantite ?? req.body.stock
    );

    return res.status(200).json(product);
  } catch (error) {
    const handled = handleAdminError(error, res);
    if (handled) return handled;

    return next(error);
  }
};

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await createProductAdmin(req.body);

    return res.status(201).json(product);
  } catch (error) {
    return next(error);
  }
};

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await deleteProductAdmin(Number(req.params.id));

    return res.status(200).json(product);
  } catch (error) {
    const handled = handleAdminError(error, res);
    if (handled) return handled;

    return next(error);
  }
};

export const modifyProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await updateProductAdmin(Number(req.params.id), req.body);

    return res.status(200).json(product);
  } catch (error) {
    const handled = handleAdminError(error, res);
    if (handled) return handled;

    return next(error);
  }
};

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const search = typeof req.query.search === "string" ? req.query.search : undefined;
    const pageParam = typeof req.query.page === "string" ? Number(req.query.page) : 1;
    const page = Number.isInteger(pageParam) && pageParam > 0 ? pageParam : 1;

    const result = await listUsersAdmin({ search, page });

    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await getUserAdmin(Number(req.params.id));

    return res.status(200).json(user);
  } catch (error) {
    const handled = handleAdminError(error, res);
    if (handled) return handled;

    return next(error);
  }
};

export const modifyUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await updateUserAdmin(Number(req.params.id), req.body);

    return res.status(200).json(user);
  } catch (error) {
    const handled = handleAdminError(error, res);
    if (handled) return handled;

    return next(error);
  }
};

export const createAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await createAdminUser(req.body);

    return res.status(201).json(user);
  } catch (error) {
    const handled = handleAdminError(error, res);
    if (handled) return handled;

    return next(error);
  }
};

export const deleteAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const adminUserId = Number(req.user?.id);
    const result = await anonymizeUserAdmin(Number(req.params.id), adminUserId);

    return res.status(200).json(result);
  } catch (error) {
    const handled = handleAdminError(error, res);
    if (handled) return handled;

    return next(error);
  }
};

export const createCat = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await createCategoryAdmin(req.body);

    return res.status(201).json(category);
  } catch (error) {
    return next(error);
  }
};
