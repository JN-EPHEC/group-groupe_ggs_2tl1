import type { NextFunction, Request, Response } from "express";
import {
  getUserProfile,
  updateUserActiveStatus,
  updateUserPassword,
  updateUserProfile,
} from "../services/userServices.js";

const handleUserDataError = (error: unknown, res: Response) => {
  if (error instanceof Error && error.message === "NO_USER_DATA") {
    return res.status(400).json({ message: "Aucune données présente" });
  }

  return null;
};

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await getUserProfile(Number(req.user.id));

    return res.status(200).json(user);
  } catch (error) {
    if (error instanceof Error && error.message === "USER_NOT_FOUND") {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    return next(error);
  }
};

export const modifyClient = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await updateUserProfile(Number(req.user.id), req.body);

    return res.status(200).json(user);
  } catch (error) {
    const handled = handleUserDataError(error, res);
    if (handled) return handled;

    return next(error);
  }
};

export const modifyPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await updateUserPassword(Number(req.user.id), req.body);

    return res.status(200).json(user);
  } catch (error) {
    const handled = handleUserDataError(error, res);
    if (handled) return handled;

    return next(error);
  }
};

export const deleteAccount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await updateUserActiveStatus(Number(req.user.id), req.body);

    return res.status(200).json(user);
  } catch (error) {
    const handled = handleUserDataError(error, res);
    if (handled) return handled;

    return next(error);
  }
};
