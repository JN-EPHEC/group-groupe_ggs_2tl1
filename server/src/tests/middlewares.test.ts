import { describe, expect, it, jest } from "@jest/globals";
import type { Request, Response } from "express";
import checkEmptyBody from "../middlewares/checkEmptyBody";
import checkIdParam from "../middlewares/checkIdParam";
import validateAddressBody from "../middlewares/validateAddressBody";
import { validateLoginBody, validateRegisterBody } from "../middlewares/validateAuthBody";
import validateOrderBody from "../middlewares/validateOrderBody";

const mockResponse = () => {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  } as unknown as Response;

  return res;
};

describe("Middlewares", () => {
  describe("checkIdParam", () => {
    it("appelle next si l'id est valide", () => {
      const req = { params: { id: "1" } } as unknown as Request;
      const res = mockResponse();
      const next = jest.fn();

      checkIdParam(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(res.status).not.toHaveBeenCalled();
    });

    it("renvoie 400 si l'id est invalide", () => {
      const req = { params: { id: "abc" } } as unknown as Request;
      const res = mockResponse();
      const next = jest.fn();

      checkIdParam(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "id invalide" });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe("checkEmptyBody", () => {
    it("appelle next si le body contient des données", () => {
      const req = { body: { username: "test" } } as Request;
      const res = mockResponse();
      const next = jest.fn();

      checkEmptyBody(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(res.status).not.toHaveBeenCalled();
    });

    it("renvoie 400 si le body est vide", () => {
      const req = { body: {} } as Request;
      const res = mockResponse();
      const next = jest.fn();

      checkEmptyBody(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Le body est vide" });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe("validateRegisterBody", () => {
    it("appelle next si le body register est valide", () => {
      const req = {
        body: { username: "user", email: "user@test.com", password: "password123" },
      } as Request;
      const res = mockResponse();
      const next = jest.fn();

      validateRegisterBody(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(res.status).not.toHaveBeenCalled();
    });

    it("renvoie 400 si un type est invalide", () => {
      const req = {
        body: { username: "user", email: "user@test.com", password: 123 },
      } as unknown as Request;
      const res = mockResponse();
      const next = jest.fn();

      validateRegisterBody(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Types invalides" });
      expect(next).not.toHaveBeenCalled();
    });

    it("renvoie 400 si l'email est invalide", () => {
      const req = {
        body: { username: "user", email: "bad-email", password: "password123" },
      } as Request;
      const res = mockResponse();
      const next = jest.fn();

      validateRegisterBody(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Format email invalide" });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe("validateLoginBody", () => {
    it("appelle next si le body login est valide", () => {
      const req = { body: { email: "user@test.com", password: "password123" } } as Request;
      const res = mockResponse();
      const next = jest.fn();

      validateLoginBody(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(res.status).not.toHaveBeenCalled();
    });

    it("renvoie 400 si le body login est invalide", () => {
      const req = { body: { email: "user@test.com" } } as Request;
      const res = mockResponse();
      const next = jest.fn();

      validateLoginBody(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Types invalides" });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe("validateAddressBody", () => {
    const validAddress = {
      street: "Rue test",
      city: "Bruxelles",
      state: "Bruxelles",
      postalCode: "1000",
      country: "Belgique",
    };

    it("appelle next si l'adresse est valide", () => {
      const req = { body: validAddress } as Request;
      const res = mockResponse();
      const next = jest.fn();

      validateAddressBody(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(res.status).not.toHaveBeenCalled();
    });

    it("renvoie 400 si un champ adresse est manquant", () => {
      const req = { body: { ...validAddress, city: "" } } as Request;
      const res = mockResponse();
      const next = jest.fn();

      validateAddressBody(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Champs adresse manquants" });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe("validateOrderBody", () => {
    it("appelle next si la commande est valide", () => {
      const req = { body: { items: [{ product_id: 1, quantity: 2 }] } } as Request;
      const res = mockResponse();
      const next = jest.fn();

      validateOrderBody(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(res.status).not.toHaveBeenCalled();
    });

    it("renvoie 400 si la commande ne contient pas d'items", () => {
      const req = { body: { items: [] } } as Request;
      const res = mockResponse();
      const next = jest.fn();

      validateOrderBody(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "La commande doit contenir au moins un item" });
      expect(next).not.toHaveBeenCalled();
    });

    it("renvoie 400 si un item est invalide", () => {
      const req = { body: { items: [{ product_id: 1, quantity: 0 }] } } as Request;
      const res = mockResponse();
      const next = jest.fn();

      validateOrderBody(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Items invalides: product_id et quantity (> 0) sont requis",
      });
      expect(next).not.toHaveBeenCalled();
    });
  });
});
