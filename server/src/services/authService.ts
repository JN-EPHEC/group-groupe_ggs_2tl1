import prisma from "../config/prisma.js";
import { randomBytes, scryptSync } from "node:crypto";
import jwt from "jsonwebtoken";

type RegisterInput = {
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

type LoginInput = {
    email: string,
    password: string
}

export const registerUser = async (input: RegisterInput) => {
    const verifyEmail = await prisma.user.findUnique({
        where: { email: input.email }
    });

    if (verifyEmail) {
        throw new Error("EMAIL_ALREADY_EXISTS");
    }

    const salt = randomBytes(16).toString("hex");
    const password_hash = scryptSync(input.password, salt, 64).toString("hex");

    const createUser = await prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
            data: {
                username: input.username,
                email: input.email,
            }
        });

        await tx.credentials.create({
            data: {
                user_id: user.id,
                password_hash,
                salt
            }
        });

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

    const token = jwt.sign(
        { userId: createUser.id },
        process.env.JWT_SECRET as string,
        { expiresIn: "1h" }
    );

    return {
        token,
        user: {
            id: createUser.id,
            username: createUser.username,
            email: createUser.email
        }
    };
};

export const loginUser = async (input: LoginInput) => {
    // Cherche l'utilisateur + credentials
        const user = await prisma.user.findUnique({
            where: { email: input.email! },
            include: { credentials: true }
        });

        // Message générique pour sécurité
        if (!user || !user.credentials) {
             throw new Error("USER_NOT_FOUND");
        }

        // Recalcul du hash avec le salt stocké
        const hashToCompare = scryptSync(input.password!, user.credentials.salt, 64).toString("hex");

        // Comparaison
        if (hashToCompare !== user.credentials.password_hash) {
            throw new Error("FALSE_PASSWORD");
        }

        // Génération du token JWT
        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET as string,
            { expiresIn: "1h" }
        );

        return {
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        }
}
