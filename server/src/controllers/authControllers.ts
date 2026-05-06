import type { Request, Response, NextFunction } from 'express';
import prisma from "../config/prisma.js";
import { randomBytes, scryptSync } from "node:crypto";
import jwt from "jsonwebtoken";

type CreateUserInput = {
    username: string;
    email: string;
    password: string;
    addresses?: Array<{
        street: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
    }>;
};


export const authRegister = async (req: Request, res: Response, next: NextFunction) => {
    try {
        //récupères les données foournies par le formulaire de création de compte maos partiellement
        const input = req.body as Partial<CreateUserInput>;

        //permet de vérifier si les types des champs sont bons
        if (typeof input.username !== "string" || typeof input.email !== "string" || typeof input.password !== "string") {
            return res.status(400).json({ message: "Types invalides" });
        }

        //Permet de verifier que l'emai lest dans le bon format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(input.email)) {
            return res.status(400).json({ message: "Format email invalide" })
        }

        //Permet de verifier si l'email n'est pas deja present dans la db 
        const verifyEmail = await prisma.user.findUnique({
            where: { email: input.email }
        })

        if (verifyEmail) {
            return res.status(400).json({ message: "Compte utilisateur déjà existant" })
        }

        //Génère un salt et hash le password
        const salt = randomBytes(16).toString("hex");
        const password_hash = scryptSync(input.password, salt, 64).toString("hex");

        //transaction de création de user
        const createUser = await prisma.$transaction(async (tx) => {
            //rempli la table des users
            const user = await tx.user.create({
                data: {
                    username: input.username!,
                    email: input.email!,
                }
            });
            //rempli la table des mots de passe
            await tx.credentials.create({
                data: {
                    user_id: user.id,
                    password_hash: password_hash,
                    salt: salt
                }
            });
            //rempli la table des addresses
            const address = input.addresses?.[0];

            if (address) {
                await tx.address.create({
                    data: {
                        user_id: user.id,
                        street: address.street,
                        city: address.city,
                        state: address.state,
                        postalCode: address.postalCode,
                        country: address.country
                    }
                });
            }
            return user;
        });

        // Génération du token JWT (auto-login après inscription)
        const token = jwt.sign(
            { userId: createUser.id },
            process.env.JWT_SECRET as string,
            { expiresIn: "1h" }
        );

        return res.status(201).json({
            token,
            user: {
                id: createUser.id,
                username: createUser.username,
                email: createUser.email
            }
        });
    }

    catch (error) {
        return next(error);
    }
}

export const authLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const input = req.body as Partial<CreateUserInput>;

        // Vérification des types
        if (typeof input.email !== "string" || typeof input.password !== "string") {
            return res.status(400).json({ message: "Types invalides" });
        }

        // Cherche l'utilisateur + credentials
        const user = await prisma.user.findUnique({
            where: { email: input.email },
            include: { credentials: true }
        });

        // Message générique pour sécurité
        if (!user || !user.credentials) {
            return res.status(401).json({ message: "Email ou mot de passe incorrect" });
        }

        // Recalcul du hash avec le salt stocké
        const hashToCompare = scryptSync(input.password, user.credentials.salt, 64).toString("hex");

        // Comparaison
        if (hashToCompare !== user.credentials.password_hash) {
            return res.status(401).json({ message: "Email ou mot de passe incorrect" });
        }

        // Génération du token JWT
        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET as string,
            { expiresIn: "1h" }
        );

        return res.status(200).json({
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        return next(error);
    }
};