import prisma from "../config/prisma.js";

type CreateOrderItemInput = {
  product_id: number;
  quantity: number;
};

type CreateOrderInput = {
  items: CreateOrderItemInput[];
  status_id?: number;
};

export const ordersClient = async (userId: number) => {
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

    return orders;
}


export const oneOrderClient = async (userId: number,orderId: number) => {
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

    return oneOrder;
}

export const createOrderClient = async (userId: number, input: CreateOrderInput) => {
    const parsedItems: CreateOrderItemInput[] = input.items.map((item: unknown) => {
      const candidate = item as { product_id?: number; quantity?: number };
      return {
        product_id: Number(candidate.product_id),
        quantity: Number(candidate.quantity),
      };
    });

    //Regrouppe les items par produit et additionne les quantités
    const quantitiesByProduct = new Map<number, number>();
    for (const item of parsedItems) {
      quantitiesByProduct.set(item.product_id, (quantitiesByProduct.get(item.product_id) ?? 0) + item.quantity);
    }

    //récupère les clés sans doublons
    const uniqueProductIds = [...quantitiesByProduct.keys()];

    //vérifie qu'il n'y ai pas un autre statut, sinon met "en attente" par défaut
        let statusId = Number(input.status_id);
        if (!Number.isInteger(statusId) || statusId <= 0) {
          const pendingStatus = await prisma.orderStatus.findFirst({
            where: { name: "En attente" },
          });
    
          if (!pendingStatus) {
            throw new Error("STATUS_NOT_FOUND");
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
          throw new Error("PRODUCTS_NOT_FOUND");
        }

        const totalPrice = createdOrder.orderProducts.reduce(
          (sum, line) => sum + line.priceAtPurchase * line.quantity,
          0
        );

        return {
          ...createdOrder,
          totalPrice,
        };
}
