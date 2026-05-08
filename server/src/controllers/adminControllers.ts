import type {Request, Response, NextFunction } from 'express'
import prisma from '../config/prisma.js'

// ==================== Gestion des produits ====================

// Permet de crééer un rpoduit
export const createProduct = async (req:Request, res: Response, next: NextFunction) =>{
    try{
    const data = req.body
     const product = await prisma.products.create({
        data : data
    });
    return res.status(201).json(product);
    }catch(err){
        next(err)
    }
}

// Permet de supprimer un produit
export const deleteProduct = async (req:Request, res: Response, next:NextFunction) => {
    try{
    const id = req.params.id
    const exists = await prisma.products.findUnique({where : {id : Number(id)}});
    if (!exists){
        return res.status(404).json({message : "le produit n'existe pas ou plus" })
    }
    const product = await prisma.products.delete({
        where : {id : Number(id)},
    });
    return res.status(200).json(product)
    } catch(err){
        next(err)
    }

}

// Permet de modifier un produit
export const modifyProduct = async (req:Request, res:Response,next :  NextFunction) => {
    try{
      const id = req.params.id
        const exists = await prisma.products.findUnique({where:{id:Number(id)}});
        if(!exists){
            return res.status(404).json({message : "le produit n'existe pas ou plus" })
        }
        const data = req.body
        const product = await prisma.products.update({
        where : {id : Number(id)},
        data : data
    })
    return res.status(200).json(product)
    } catch(err){
        next(err)
    }
}

// ==================== Gestion des utilisateurs ====================

// Permet de récupérer tous les utlisateurs de la base de données
export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                username: true,
                email: true,
                created_at: true,
                isActive: true,
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
        return res.status(200).json(users);
    } catch (error) {
        return next(error);
    }
}

// Permet de récupérer toutes les informations d'un utilisateurs
export const getUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = Number(req.params.id);

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                username: true,
                email: true,
                created_at: true,
                isActive: true,
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
}

// Permet de modifier un utilisateur
export const modifyUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = Number(req.params.id);

        const exists = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!exists) {
            return res.status(404).json({ message: "Utilisateur introuvable" });
        }

        const data: { username?: string; email?: string; isActive?: boolean } = {};

        if (req.body.username !== undefined) data.username = req.body.username;
        if (req.body.email !== undefined) data.email = req.body.email;
        if (req.body.isActive !== undefined) data.isActive = req.body.isActive;

        if (Object.keys(data).length === 0) {
            return res.status(400).json({ message: "Aucune donnée à modifier" });
        }

        const user = await prisma.user.update({
            where: { id: userId },
            data,
            select: {
                id: true,
                username: true,
                email: true,
                created_at: true,
                isActive: true,
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

        return res.status(200).json(user);
    } catch (error) {
        return next(error);
    }
}

// Permet de créer un admin
export const createAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = req.body;

        // Récupérer le rôle "admin"
        const adminRole = await prisma.role.findUnique({
            where: { name: "admin" },
        });

        if (!adminRole) {
            return res.status(500).json({ message: "Le rôle admin n'existe pas" });
        }

        // Créer l'utilisateur et attribuer le rôle admin
        const user = await prisma.user.create({
            data: {
                ...data,
                roles: {
                    create: {
                        role_id: adminRole.id,
                    },
                },
            },
            select: {
                id: true,
                username: true,
                email: true,
                created_at: true,
                isActive: true,
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

        return res.status(201).json(user);
    } catch (error) {
        return next(error);
    }
}

// Permet de supprimer un admin
export const deleteAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = Number(req.params.id);

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                username: true,
                email: true,
                roles: {
                    select: {
                        role: {
                            select: {
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

        // Vérifier que l'utilisateur a le rôle admin
        const isAdmin = user.roles.some(userRole => userRole.role.name === "admin");
        if (!isAdmin) {
            return res.status(403).json({ message: "Cet utilisateur n'est pas un admin" });
        }

        // Supprimer l'utilisateur
        const deletedUser = await prisma.user.delete({
            where: { id: userId },
            select: {
                id: true,
                username: true,
                email: true,
            },
        });

        return res.status(200).json({ message: "Admin supprimé", user: deletedUser });
    } catch (error) {
        return next(error);
    }
}

// ==================== Gestion des catégories====================

// Permet de créer une catégorie
export const createCat = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = req.body;

        const category = await prisma.categories.create({
            data: data,
        });

        return res.status(201).json(category);
    } catch (error) {
        return next(error);
    }
}
