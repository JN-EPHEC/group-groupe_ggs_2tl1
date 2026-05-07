import type { NextFunction, Request, Response } from 'express';
import { updateAdminOrderStatus } from '../controllers/adminOrderControllers';
import { prismaMock } from './setup/prisma.singleton';

jest.mock('../services/emailService.js', () => ({
  __esModule: true,
  sendOrderStatusChangedEmail: jest.fn().mockResolvedValue(undefined),
}));

const createResponse = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('adminOrderControllers', () => {
  it('retourne 400 si id commande invalide', async () => {
    const req = {
      params: { id: 'abc' },
      body: { statut: 'VALIDEE' },
    } as unknown as Request;
    const res = createResponse();
    const next = jest.fn() as NextFunction;

    await updateAdminOrderStatus(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'ID commande invalide.' });
  });

  it('retourne 404 si commande introuvable', async () => {
    const req = {
      params: { id: '7' },
      body: { statut: 'VALIDEE' },
    } as unknown as Request;
    const res = createResponse();
    const next = jest.fn() as NextFunction;

    prismaMock.orders.findUnique.mockResolvedValue(null);

    await updateAdminOrderStatus(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Commande introuvable.' });
  });

  it('retourne 400 si statut cible invalide', async () => {
    const req = {
      params: { id: '3' },
      body: { statut: 'INCONNU' },
    } as unknown as Request;
    const res = createResponse();
    const next = jest.fn() as NextFunction;

    prismaMock.orders.findUnique.mockResolvedValue({
      id: 3,
      status: { id: 1, name: 'EN_ATTENTE' },
      user: { email: 'client@example.com', username: 'Client' },
    } as never);
    prismaMock.orderStatus.findMany.mockResolvedValue([
      { id: 1, name: 'EN_ATTENTE' },
      { id: 2, name: 'VALIDEE' },
    ] as never);

    await updateAdminOrderStatus(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Statut invalide.' });
  });

  it('retourne 409 pour une transition non autorisee', async () => {
    const req = {
      params: { id: '4' },
      body: { statut: 'LIVREE' },
    } as unknown as Request;
    const res = createResponse();
    const next = jest.fn() as NextFunction;

    prismaMock.orders.findUnique.mockResolvedValue({
      id: 4,
      status: { id: 1, name: 'EN_ATTENTE' },
      user: { email: 'client@example.com', username: 'Client' },
    } as never);
    prismaMock.orderStatus.findMany.mockResolvedValue([
      { id: 1, name: 'EN_ATTENTE' },
      { id: 2, name: 'VALIDEE' },
      { id: 3, name: 'EXPEDIEE' },
      { id: 4, name: 'LIVREE' },
      { id: 5, name: 'ANNULEE' },
    ] as never);

    await updateAdminOrderStatus(req, res, next);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Transition non autorisee: EN_ATTENTE -> LIVREE.',
    });
    expect(prismaMock.orders.update).not.toHaveBeenCalled();
  });

  it('met a jour le statut avec succes pour une transition autorisee', async () => {
    const req = {
      params: { id: '12' },
      body: { statut: 'EXPEDIEE' },
    } as unknown as Request;
    const res = createResponse();
    const next = jest.fn() as NextFunction;

    prismaMock.orders.findUnique.mockResolvedValue({
      id: 12,
      status: { id: 2, name: 'VALIDEE' },
      user: { email: 'client@example.com', username: 'Client Test' },
    } as never);
    prismaMock.orderStatus.findMany.mockResolvedValue([
      { id: 1, name: 'EN_ATTENTE' },
      { id: 2, name: 'VALIDEE' },
      { id: 3, name: 'EXPEDIEE' },
      { id: 4, name: 'LIVREE' },
      { id: 5, name: 'ANNULEE' },
    ] as never);
    prismaMock.orders.update.mockResolvedValue({
      id: 12,
      status: { id: 3, name: 'EXPEDIEE' },
    } as never);

    await updateAdminOrderStatus(req, res, next);

    expect(prismaMock.orders.update).toHaveBeenCalledWith({
      where: { id: 12 },
      data: { status_id: 3 },
      include: {
        status: {
          select: { id: true, name: true },
        },
      },
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Statut de la commande mis a jour avec succes.',
      commande: {
        id: 12,
        ancien_statut: 'VALIDEE',
        nouveau_statut: 'EXPEDIEE',
      },
    });
    expect(next).not.toHaveBeenCalled();
  });
});
