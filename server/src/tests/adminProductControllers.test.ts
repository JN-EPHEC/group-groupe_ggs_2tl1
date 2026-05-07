import type { NextFunction, Request, Response } from 'express';
import { getAdminProducts, updateAdminProduct, updateAdminProductStock } from '../controllers/adminProductControllers';
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

  it('retourne 400 si URL image invalide lors de la modification produit', async () => {
    const req = {
      params: { id: '2' },
      body: {
        nom: 'Nouveau nom',
        description: 'Desc',
        prix: 99.9,
        quantite: 12,
        image_url: 'not-a-url',
        categorie_id: 1,
      },
    } as unknown as Request;
    const res = createResponse();
    const next = jest.fn() as NextFunction;

    await updateAdminProduct(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "L'URL de l'image est invalide." });
    expect(prismaMock.products.findUnique).not.toHaveBeenCalled();
  });

  it('retourne 404 si categorie introuvable lors de la modification produit', async () => {
    const req = {
      params: { id: '2' },
      body: {
        nom: 'Nouveau nom',
        description: 'Desc',
        prix: 99.9,
        quantite: 12,
        image_url: 'https://example.com/image.png',
        categorie_id: 100,
      },
    } as unknown as Request;
    const res = createResponse();
    const next = jest.fn() as NextFunction;

    prismaMock.products.findUnique.mockResolvedValue({ id: 2 } as never);
    prismaMock.categories.findUnique.mockResolvedValue(null);

    await updateAdminProduct(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Categorie introuvable.' });
    expect(prismaMock.products.update).not.toHaveBeenCalled();
  });

  it('met a jour un produit complet avec succes', async () => {
    const req = {
      params: { id: '2' },
      body: {
        nom: 'Produit modifie',
        description: 'Description modifiee',
        prix: 49.5,
        quantite: 7,
        image_url: 'https://example.com/new-image.png',
        categorie_id: 4,
      },
    } as unknown as Request;
    const res = createResponse();
    const next = jest.fn() as NextFunction;

    prismaMock.products.findUnique.mockResolvedValue({ id: 2 } as never);
    prismaMock.categories.findUnique.mockResolvedValue({ id: 4, name: 'Boissons' } as never);
    prismaMock.products.update.mockResolvedValue({
      id: 2,
      name: 'Produit modifie',
      description: 'Description modifiee',
      price: 49.5,
      stock: 7,
      category: { id: 4, name: 'Boissons' },
    } as never);

    await updateAdminProduct(req, res, next);

    expect(prismaMock.products.update).toHaveBeenCalledWith({
      where: { id: 2 },
      data: {
        name: 'Produit modifie',
        description: 'Description modifiee',
        price: 49.5,
        stock: 7,
        category_id: 4,
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        stock: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Produit mis a jour avec succes.',
      produit: {
        id: 2,
        nom: 'Produit modifie',
        description: 'Description modifiee',
        prix: 49.5,
        quantite: 7,
        image_url: 'https://example.com/new-image.png',
        categorie: { id: 4, name: 'Boissons' },
      },
    });
    expect(next).not.toHaveBeenCalled();
  });
});
