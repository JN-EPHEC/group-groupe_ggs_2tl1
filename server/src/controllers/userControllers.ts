import type { NextFunction, Request, Response } from "express";
import prisma from "../config/prisma.js";
import { stringify } from "node:querystring";

//Permet de récupérer les informations de l'utilisateur
export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    //il faudra faire un middleware de check pour éviter de rentrer ici si le userId n'existe pas, lors du refacto.
    const userId = Number((req.user as { id?: number } | undefined)?.id);

    //Permet de vérifier si l'id est valide
    //il faudra faire un middleware de check pour éviter de rentrer ici si le userId n'existe pas, lors du refacto.

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


//Permet de Aucune données présente les informations de l'utilisateur
export const modifyClient = async (req: Request, res: Response, next: NextFunction) => {
  try {
    //il faudra faire un middleware de check pour éviter de rentrer ici si le userId n'existe pas, lors du refacto.
    const userId = Number((req.user as { id?: number } | undefined)?.id);

    // typage de l'objet data
    const data: { username?: string; email?: string } = {};

    //Permet de vérifier si l'id est valide
    //il faudra faire un middleware de check pour éviter de rentrer ici si le userId n'existe pas, lors du refacto.

    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(401).json({ message: "Utilisateur non authentifie" });
    }
    // stock dans data le usernale et l'email
    if (req.body.username !== undefined) data.username = req.body.username;

    if (req.body.email !== undefined) data.email = req.body.email;

    if (Object.keys(data).length === 0) {
      return res.status(400).json({ message: "Aucune données présente" });
    }

    //update le client prisma
    const user = await prisma.user.update({
      where: { id: userId },
      data
    })

    return res.status(200).json(user);
  }
  catch (error) {
    return next(error);
  }
}

//Permet de Aucune données présente le mot de passe de l'utilisateur
export const modifyPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    //il faudra faire un middleware de check pour éviter de rentrer ici si le userId n'existe pas, lors du refacto.
    const userId = Number((req.user as { id?: number } | undefined)?.id);

    //typage de l'objet data
    const data: { password_hash?: string } = {};

    //Permet de vérifier si l'id est valide
    //il faudra faire un middleware de check pour éviter de rentrer ici si le userId n'existe pas, lors du refacto.
    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(401).json({ message: "Utilisateur non authentifie" });
    }
    
    //stock dans data le password
    if (req.body.password_hash !== undefined) {
      data.password_hash = req.body.password_hash;
    }

    //vérifie que l'objet data contienne bien des données
    if (Object.keys(data).length === 0) {
      return res.status(400).json({ message: "Aucune données présente" });
    }

    //update le client prisma
    const user = await prisma.credentials.update({
      where: { user_id: userId },
      data
    })

    return res.status(200).json(user);
  }
  catch (error) {
    return next(error);
  }
}

//Permet de supprimer un compte
export const deleteAccount = async (req: Request, res: Response, next:NextFunction) => {
  try {
    //il faudra faire un middleware de check pour éviter de rentrer ici si le userId n'existe pas, lors du refacto.
    const userId = Number((req.user as { id?: number } | undefined)?.id);

    //Permet de vérifier si l'id est valide
    //il faudra faire un middleware de check pour éviter de rentrer ici si le userId n'existe pas, lors du refacto.
    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(401).json({ message: "Utilisateur non authentifie" });
    }

    //typage de l'objet data
    const data: { isActive?: boolean} = {};

    //Stock la valeur booleene dans data
    if (req.body.isActive !== undefined) {
      data.isActive = req.body.isActive;
    }

    //vérifie que l'objet data contienne bien des données
    if (Object.keys(data).length === 0) {
      return res.status(400).json({ message: "Aucune données présente" });
    }

    //update le client prisma
    const user = await prisma.user.update({
      where: { id: userId },
      data
    })

    return res.status(200).json(user);
  }
  catch (error) {
    return next(error);
  }
}