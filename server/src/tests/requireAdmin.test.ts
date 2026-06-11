import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import type { NextFunction, Request, Response } from "express";
import verifyAdmin from "../middlewares/requireAdmin";

function mockResponse() {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  } as unknown as Response;
  return res;
}

describe("verifyAdmin middleware", () => {
  let req: Request;
  let res: Response;
  let next: NextFunction;

  beforeEach(() => {
    req = { user: undefined } as Request;
    res = mockResponse();
    next = jest.fn();
  });

  it("autorise un utilisateur avec le rôle Admin", async () => {
    req.user = {
      roles: [{ role: { name: "Admin" } }],
    };

    await verifyAdmin(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it("refuse un utilisateur sans rôle admin", async () => {
    req.user = {
      roles: [{ role: { name: "Client" } }],
    };

    await verifyAdmin(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: "Accès non autorisé" });
  });

  it("refuse un utilisateur sans rôles", async () => {
    req.user = { roles: [] };

    await verifyAdmin(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(403);
  });
});
