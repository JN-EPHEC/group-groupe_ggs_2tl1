import type { NextFunction, Request, Response } from "express";
import prisma from "../config/prisma.js";

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    //il faudra faire un middleware de check pour éviter de rentrer ici si le userId n'existe pas, lors du refacto.
    const userId = Number((req.user as { id?: number } | undefined)?.id);

    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(401).json({ message: "Utilisateur non authentifie" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        //il faut remplacer username par firsname et lastname
        username: true,
        email: true,
        created_at: true,
        addresses: true,
        roles: {
          select: {
            role: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    return res.status(200).json(user);
  } catch (error) {
    return next(error);
  }
};

// Alias temporaire pour rester compatible avec le nom déjà utilisé dans certaines routes.
export const getProfil = getProfile;
