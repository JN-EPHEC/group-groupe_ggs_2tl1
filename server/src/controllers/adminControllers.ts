import type { Request, Response, NextFunction } from "express";
import {
  createAdminUser,
  createCategoryAdmin,
  createProductAdmin,
  deleteAdminUser,
  deleteProductAdmin,
  getAllUsersAdmin,
  getUserAdmin,
  updateProductAdmin,
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

  return null;
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

export const getAllUsers = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await getAllUsersAdmin();

    return res.status(200).json(users);
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
    const deletedUser = await deleteAdminUser(Number(req.params.id));

    return res.status(200).json(deletedUser);
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
