import type { NextFunction, Request, Response } from 'express';
import prisma from '../config/prisma.js';
import { sendOrderStatusChangedEmail } from '../services/emailService.js';

const parsePositiveInt = (value: unknown) => {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    return null;
  }
  return parsed;
};

const normalizeStatus = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toUpperCase()
    .replace(/\s+/g, '_');

const allowedTransitions: Record<string, string[]> = {
  EN_ATTENTE: ['VALIDEE', 'ANNULEE'],
  VALIDEE: ['EXPEDIEE', 'ANNULEE'],
  EXPEDIEE: ['LIVREE', 'ANNULEE'],
  LIVREE: ['ANNULEE'],
  ANNULEE: [],
};

export const updateAdminOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orderId = parsePositiveInt(req.params.id);
    const requestedStatus = typeof req.body?.statut === 'string' ? req.body.statut : '';

    if (!orderId) {
      return res.status(400).json({ message: 'ID commande invalide.' });
    }

    if (!requestedStatus.trim()) {
      return res.status(400).json({ message: 'Le statut est requis.' });
    }

    const order = await prisma.orders.findUnique({
      where: { id: orderId },
      include: {
        status: {
          select: { id: true, name: true },
        },
        user: {
          select: {
            email: true,
            username: true,
          },
        },
      },
    });

    if (!order) {
      return res.status(404).json({ message: 'Commande introuvable.' });
    }

    const statuses = await prisma.orderStatus.findMany({
      select: { id: true, name: true },
    });

    const requestedStatusKey = normalizeStatus(requestedStatus);
    const targetStatus = statuses.find((status) => normalizeStatus(status.name) === requestedStatusKey);

    if (!targetStatus) {
      return res.status(400).json({ message: 'Statut invalide.' });
    }

    const currentStatusKey = normalizeStatus(order.status.name);

    if (currentStatusKey === requestedStatusKey) {
      return res.status(400).json({ message: 'La commande est deja dans ce statut.' });
    }

    const isAllowedTransition = (allowedTransitions[currentStatusKey] ?? []).includes(requestedStatusKey);

    if (!isAllowedTransition) {
      return res.status(409).json({
        message: `Transition non autorisee: ${order.status.name} -> ${targetStatus.name}.`,
      });
    }

    const updatedOrder = await prisma.orders.update({
      where: { id: orderId },
      data: { status_id: targetStatus.id },
      include: {
        status: {
          select: { id: true, name: true },
        },
      },
    });

    await sendOrderStatusChangedEmail({
      to: order.user.email,
      username: order.user.username,
      orderId: order.id,
      previousStatus: order.status.name,
      nextStatus: targetStatus.name,
    });

    return res.status(200).json({
      message: 'Statut de la commande mis a jour avec succes.',
      commande: {
        id: updatedOrder.id,
        ancien_statut: order.status.name,
        nouveau_statut: updatedOrder.status.name,
      },
    });
  } catch (error) {
    return next(error);
  }
};

