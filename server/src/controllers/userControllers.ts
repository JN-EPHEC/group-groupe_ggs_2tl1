import type { Request, Response, NextFunction } from 'express'
import prisma from "../config/prisma.js"

type UserPayload = {
        firstName?: unknown;
        lastName?: unknown;
};

const buildUpdateData = (payload: UserPayload) => {
        const data: { firstName?: string; lastName?: string | null } = {};

        if (typeof payload.firstName === 'string') {
                data.firstName = payload.firstName;
        }

        if (typeof payload.lastName === 'string' || payload.lastName === null) {
                data.lastName = payload.lastName;
        }

        return data;
};

//Services pour récuperer tous les users de l'api
export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
        const users = await prisma.user.findMany({
                orderBy: {
                        id: 'asc'
                }
        });
        return res.status(200).json(users);
}

//Services pour récuperer un user précis 
export const getUser = async (req: Request, res: Response, next: NextFunction) => {
        const user = (req as any).user;
        return res.status(200).json(user);
}

export const createUser = async (req: Request, res: Response, next: NextFunction) => {

        const payload = req.body as UserPayload;
        const user = await prisma.user.create({
                data: {
                        firstName: payload.firstName as string,
                        ...(payload.lastName !== undefined
                                ? { lastName: payload.lastName as string | null }
                                : {}),
                }
        });

        return res.status(201).json(user);
}

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
        const user = (req as any).user as { id: number };
        const payload = req.body as UserPayload;
        const data = buildUpdateData(payload);

        if (Object.keys(data).length === 0) {
                return res.status(200).json(user);
        }

        const updatedUser = await prisma.user.update({
                where: { id: user.id },
                data
        });

        return res.status(200).json(updatedUser);
}

export const deleteUser = async (req: Request, res: Response,next: NextFunction) => {
        const user = (req as any).user as { id: number };

        await prisma.user.delete({
                where: { id: user.id }
        });
        res.json({ message : `${user.id} a bien été supprimé`})
}
