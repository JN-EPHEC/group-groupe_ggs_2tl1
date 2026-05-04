import type { Response, Request, NextFunction } from "express";
import prisma from "../config/prisma.js";

type CreateOrderItemInput = {
  product_id: number;
  quantity: number;
};

// Permet de récupérer toutes les commandes d'un client
export const getOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = Number((req.user as { id?: number } | undefined)?.id);

    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(401).json({ message: "Utilisateur non authentifie" });
    }

    const orders = await prisma.orders.findMany({
      where: { user_id: userId },
      orderBy: { orderDate: "desc" },
      include: {
        status: true,
        orderProducts: {
          include: {
            product: true,
          },
        },
      },
    });

    return res.status(200).json(orders);
  } catch (error) {
    return next(error);
  }
};

// Permet de récupérer une seule commande d'un client
export const getOneOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = Number((req.user as { id?: number } | undefined)?.id);
    const orderId = Number(req.params.id);

    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(401).json({ message: "Utilisateur non authentifie" });
    }

    if (!Number.isInteger(orderId) || orderId <= 0) {
      return res.status(400).json({ message: "Id commande invalide" });
    }

    const oneOrder = await prisma.orders.findFirst({
      where: {
        id: orderId,
        user_id: userId,
      },
      include: {
        status: true,
        orderProducts: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!oneOrder) {
      return res.status(404).json({ message: "Commande introuvable" });
    }

    return res.status(200).json(oneOrder);
  } catch (error) {
    return next(error);
  }
};

// Permet de créer une commande pour un client -- généré avec de l'ia
export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = Number((req.user as { id?: number } | undefined)?.id);

    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(401).json({ message: "Utilisateur non authentifie" });
    }

    //Récupère les données founies par le client - undefined si rien
    const rawItems = req.body?.items;

    if (!Array.isArray(rawItems) || rawItems.length === 0) {
      return res.status(400).json({ message: "La commande doit contenir au moins un item" });
    }

    //crée un nouvel objet avec un typage personnalisé -- Permet d'éviter toute introduction de mauvaise valeur de la part du client
    const parsedItems: CreateOrderItemInput[] = rawItems.map((item: unknown) => {
      const candidate = item as { product_id?: number; quantity?: number };
      return {
        product_id: Number(candidate.product_id),
        quantity: Number(candidate.quantity),
      };
    });

    //cherche la premiere ocurrence qui serait mauvaise dans le nouveal objet
    const invalidItem = parsedItems.find(
      (item) =>
        !Number.isInteger(item.product_id) ||
        item.product_id <= 0 ||
        !Number.isInteger(item.quantity) ||
        item.quantity <= 0
    );

    //Si un item est invalide, on sort et renvoie une erreur 400
    if (invalidItem) {
      return res.status(400).json({ message: "Items invalides: product_id et quantity (> 0) sont requis" });
    }

    //Regrouppe les items par produit et additionne les quantités
    const quantitiesByProduct = new Map<number, number>();
    for (const item of parsedItems) {
      quantitiesByProduct.set(item.product_id, (quantitiesByProduct.get(item.product_id) ?? 0) + item.quantity);
    }

    //récupère les clés sans doublons
    const uniqueProductIds = [...quantitiesByProduct.keys()];

    //vérifie qu'il n'y ai pas un autre statut, sinon met "en attente" par défaut
    let statusId = Number(req.body?.status_id);
    if (!Number.isInteger(statusId) || statusId <= 0) {
      const pendingStatus = await prisma.orderStatus.findFirst({
        where: { name: "En attente" },
      });

      if (!pendingStatus) {
        return res.status(400).json({ message: 'Statut "En attente" introuvable' });
      }

      statusId = pendingStatus.id;
    }

    //cree une transaction sql pour créer une commande
    const createdOrder = await prisma.$transaction(async (tx) => {
      const products = await tx.products.findMany({
        where: { id: { in: uniqueProductIds } },
      });

      //vérifie qu'il y ai bien le meme nombre d'article dans la commande que dans la db
      if (products.length !== uniqueProductIds.length) {
        return null;
      }

      const productById = new Map(products.map((p) => [p.id, p]));

      //Permet de véfifier que le produit existe et que le stock est suffisant
      for (const [productId, quantity] of quantitiesByProduct) {
        //stocke un produit et sa quantité
        const product = productById.get(productId);
        if (!product) return null;
        //renvoie une erreur si le stock est suffisant 
        if (product.stock < quantity) {
          throw new Error(`Stock insuffisant pour le produit ${productId}`);
        }
      }

      const order = await tx.orders.create({
        data: {
          user_id: userId,
          orderDate: new Date(),
          status_id: statusId,
        },
      });

      const orderLines = [...quantitiesByProduct.entries()].map(([productId, quantity]) => {
        const product = productById.get(productId)!;
        return {
          order_id: order.id,
          product_id: productId,
          quantity,
          priceAtPurchase: product.price,
        };
      });

      await tx.orderProduct.createMany({ data: orderLines });

      for (const [productId, quantity] of quantitiesByProduct) {
        const updated = await tx.products.updateMany({
          where: {
            id: productId,
            stock: { gte: quantity },
          },
          data: {
            stock: { decrement: quantity },
          },
        });

        if (updated.count !== 1) {
          throw new Error(`Mise a jour du stock impossible pour le produit ${productId}`);
        }
      }

      return tx.orders.findUnique({
        where: { id: order.id },
        include: {
          status: true,
          orderProducts: {
            include: {
              product: true,
            },
          },
        },
      });
    });

    if (!createdOrder) {
      return res.status(404).json({ message: "Un ou plusieurs produits sont introuvables" });
    }

    const totalPrice = createdOrder.orderProducts.reduce(
      (sum, line) => sum + line.priceAtPurchase * line.quantity,
      0
    );

    return res.status(201).json({
      ...createdOrder,
      totalPrice,
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Stock insuffisant")) {
      return res.status(409).json({ message: error.message });
    }
    return next(error);
  }
};
