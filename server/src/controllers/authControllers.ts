import type { Request, Response, NextFunction } from 'express';
import prisma from "../config/prisma.js";
import { randomBytes, scryptSync } from "node:crypto";


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

type loginInput = {
    email: string;
    password: string;
}


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

        return res.status(201).json(createUser);
    }

    catch (error) {
        return next(error);
    }
}
//Permet la connexion d'un utilisateur
export const authLogin = async (req: Request,res: Response,next: NextFunction) => {
    try {
        const input = req.body;

        if (typeof input.email !== "string" || typeof input.password !== "string") {
            return res.status(400).json({message: "Types incorrect"});
        }

        const user = await prisma.user.findUnique({
            where: {email: input.email},
            include: {
                credentials: true
            }
        })
        //vérifie si le user existe bien et si le mot de passe est bon
        if (!user || !user.credentials) {
            return res.status(401).json({message: "Email ou mot de passe incorrect"});
        }
        //hash le paswwaord en input avec le meme salt
        const hashInput = scryptSync(input.password, user.credentials.salt, 64).toString("hex");
        //compare les 2 hash
        if (hashInput !== user.credentials.password_hash) {
            return res.status(401).json({ message: "Mot de passe incorrect"});
        }
        //cas ou la connexion est réussie
        return res.status(200).json({
            message: "Connexion réussie",
            userId: user.id
        })
    }
    catch (error) {
        return next(error);
    }
} 