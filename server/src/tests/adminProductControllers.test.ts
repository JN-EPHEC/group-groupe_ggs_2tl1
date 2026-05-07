import type { NextFunction, Request, Response } from 'express';
import { getAdminProducts, updateAdminProductStock } from '../controllers/adminProductControllers';
import { prismaMock } from './setup/prisma.singleton';

const createResponse = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('adminProductControllers', () => {
  it('retourne la liste des produits tries par stock ascendant', async () => {
    const req = {
      query: { sort: 'stock_asc' },
    } as unknown as Request;
    const res = createResponse();
    const next = jest.fn() as NextFunction;

    prismaMock.products.findMany.mockResolvedValue([
      {
        id: 2,
        name: 'Produit A',
        stock: 0,
        price: 12.5,
        category: { id: 1, name: 'Categorie test' },
      } as never,
      {
        id: 3,
        name: 'Produit B',
        stock: 4,
        price: 25,
        category: { id: 2, name: 'Autre categorie' },
      } as never,
    ]);

    await getAdminProducts(req, res, next);

    expect(prismaMock.products.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: [{ stock: 'asc' }, { id: 'asc' }],
      }),
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      data: [
        {
          id: 2,
          nom: 'Produit A',
          prix: 12.5,
          quantite: 0,
          categorie: { id: 1, name: 'Categorie test' },
          niveau_stock: 'rupture',
          alerte_stock: true,
        },
        {
          id: 3,
          nom: 'Produit B',
          prix: 25,
          quantite: 4,
          categorie: { id: 2, name: 'Autre categorie' },
          niveau_stock: 'faible',
          alerte_stock: true,
        },
      ],
      meta: { total: 2 },
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('retourne 400 si id produit invalide', async () => {
    const req = {
      params: { id: 'abc' },
      body: { quantite: 7 },
    } as unknown as Request;
    const res = createResponse();
    const next = jest.fn() as NextFunction;

    await updateAdminProductStock(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'ID produit invalide.' });
    expect(prismaMock.products.findUnique).not.toHaveBeenCalled();
  });

  it('retourne 400 si quantite invalide', async () => {
    const req = {
      params: { id: '4' },
      body: { quantite: -1 },
    } as unknown as Request;
    const res = createResponse();
    const next = jest.fn() as NextFunction;

    await updateAdminProductStock(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'La quantite doit etre un entier superieur ou egal a 0.',
    });
    expect(prismaMock.products.findUnique).not.toHaveBeenCalled();
  });

  it('retourne 404 si produit introuvable', async () => {
    const req = {
      params: { id: '9' },
      body: { quantite: 12 },
    } as unknown as Request;
    const res = createResponse();
    const next = jest.fn() as NextFunction;

    prismaMock.products.findUnique.mockResolvedValue(null);

    await updateAdminProductStock(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Produit introuvable.' });
    expect(prismaMock.products.update).not.toHaveBeenCalled();
  });

  it('met a jour le stock produit avec succes', async () => {
    const req = {
      params: { id: '9' },
      body: { quantite: 3 },
    } as unknown as Request;
    const res = createResponse();
    const next = jest.fn() as NextFunction;

    prismaMock.products.findUnique.mockResolvedValue({
      id: 9,
      stock: 8,
      name: 'Produit C',
    } as never);
    prismaMock.products.update.mockResolvedValue({
      id: 9,
      stock: 3,
      name: 'Produit C',
    } as never);

    await updateAdminProductStock(req, res, next);

    expect(prismaMock.products.update).toHaveBeenCalledWith({
      where: { id: 9 },
      data: { stock: 3 },
      select: {
        id: true,
        name: true,
        stock: true,
      },
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Stock produit mis a jour avec succes.',
      produit: {
        id: 9,
        nom: 'Produit C',
        quantite_precedente: 8,
        quantite: 3,
        niveau_stock: 'faible',
        alerte_stock: true,
      },
    });
    expect(next).not.toHaveBeenCalled();
  });
});
