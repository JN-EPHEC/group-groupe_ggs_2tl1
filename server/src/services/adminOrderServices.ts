import prisma from "../config/prisma.js";
import { sendOrderStatusEmail } from "./emailService.js";
import { canTransitionOrderStatus, isKnownOrderStatus } from "../utils/orderStatus.js";

type UpdateOrderStatusInput = {
  statut: string;
};

const orderInclude = {
  status: true,
  user: {
    select: {
      id: true,
      username: true,
      email: true,
    },
  },
  orderProducts: {
    include: {
      product: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  },
  statusHistory: {
    orderBy: { changed_at: "desc" as const },
  },
};

export const getAllOrdersAdmin = async () => {
  return prisma.orders.findMany({
    orderBy: { orderDate: "desc" },
    include: orderInclude,
  });
};

export const updateOrderStatusAdmin = async (orderId: number, input: UpdateOrderStatusInput) => {
  const nextStatus = input.statut?.trim();

  if (!nextStatus || !isKnownOrderStatus(nextStatus)) {
    throw new Error("INVALID_ORDER_STATUS");
  }

  const order = await prisma.orders.findUnique({
    where: { id: orderId },
    include: {
      status: true,
      user: {
        select: {
          email: true,
        },
      },
    },
  });

  if (!order) {
    throw new Error("ORDER_NOT_FOUND");
  }

  const currentStatus = order.status.name;

  if (!canTransitionOrderStatus(currentStatus, nextStatus)) {
    throw new Error("INVALID_STATUS_TRANSITION");
  }

  const targetStatus = await prisma.orderStatus.findUnique({
    where: { name: nextStatus },
  });

  if (!targetStatus) {
    throw new Error("STATUS_NOT_FOUND");
  }

  const updatedOrder = await prisma.$transaction(async (tx) => {
    await tx.orderStatusHistory.create({
      data: {
        order_id: orderId,
        from_status: currentStatus,
        to_status: nextStatus,
      },
    });

    return tx.orders.update({
      where: { id: orderId },
      data: { status_id: targetStatus.id },
      include: orderInclude,
    });
  });

  await sendOrderStatusEmail({
    to: order.user.email,
    orderId,
    newStatus: nextStatus,
  });

  return updatedOrder;
};
